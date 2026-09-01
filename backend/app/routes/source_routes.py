from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
import os 
import uuid
import shutil
from app.core.database import get_db
from app.models.source import Source
from sqlalchemy.orm import Session
from app.schemas.source_schema import SourceResponse
from app.core.security import get_current_user
from app.models.user import User
from app.services.pdf_service import get_pdf_stats,load_pdf_documunets
from app.services.chuncking_service import  split_documents_into_chunks
from app.services.embedding_service import test_generate_embeddings
from app.services.vector_service import get_source_vector_path,create_pinecone_index,search_source_vector,delete_pinecone_namespace
from app.services.s3_service import generate_s3_key,upload_pdf_to_s3

router=APIRouter(
    prefix='/source',
    tags=["Sources"]
)

UPLOAD_DIR="uploads"

os.makedirs(UPLOAD_DIR,exist_ok=True)

@router.post("/pdf", response_model=SourceResponse)
def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="PDF files only"
        )

    file_id = str(uuid.uuid4())
    safe_filename = file.filename.replace(" ", "_")
    file_name = f"{file_id}_{safe_filename}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    new_source = None

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        new_source = Source(
            user_id=current_user.id,
            type="pdf",
            title=file.filename,
            filepath=file_path,
            status="processing",
        )

        db.add(new_source)
        db.commit()
        db.refresh(new_source)

        document_pages = load_pdf_documunets(file_path)

        if not document_pages:
            raise ValueError("No pages could be extracted from the PDF")

        stats = get_pdf_stats(document_pages)

        chunks = split_documents_into_chunks(document_pages)

        if not chunks:
            raise ValueError("No text chunks were generated from the PDF")

        for index, chunk in enumerate(chunks):
            chunk.metadata["user_id"] = current_user.id
            chunk.metadata["source_id"] = new_source.id
            chunk.metadata["source_type"] = "pdf"
            chunk.metadata["title"] = file.filename
            chunk.metadata["chunk_index"] = index

        vector_info = create_pinecone_index(
            chunks=chunks,
            user_id=current_user.id,
            source_id=new_source.id,
        )

        new_source.total_pages = stats["total_pages"]
        new_source.total_characters = stats["total_characters"]
        new_source.status = "processed"
        new_source.error_message = None

        db.commit()
        db.refresh(new_source)

        print("PDF processed successfully")
        print("Source ID:", new_source.id)
        print("Total pages:", new_source.total_pages)
        print("Total characters:", new_source.total_characters)
        print("Total chunks:", len(chunks))
        print("Vector path:", vector_info["vector_path"])
        print("Total vectors:", vector_info["total_vector"])

        return new_source

    except Exception as error:
        import traceback
        print("=" * 60)
        print("ACTUAL UPLOAD ERROR:")
        traceback.print_exc()
        print("=" * 60)
        db.rollback()

        if new_source is not None:
            delete_pinecone_namespace(new_source.id)

            source_record = (
                db.query(Source)
                .filter(Source.id == new_source.id)
                .first()
            )

            if source_record:
                db.delete(source_record)
                db.commit()

        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "PDF processing failed and the upload was removed. "
                "Please upload the file again."
            )
        )

    finally:
        file.file.close()

@router.get("/",response_model=list[SourceResponse])
def get_sources(db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
   sources=db.query(Source).filter(Source.user_id==current_user.id).order_by(Source.created_at.desc()).all()
   return sources
@router.get("/{source_id}/test-search")
def test_source_search(
    source_id: str,
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    source = (
        db.query(Source)
        .filter(
            Source.id == source_id,
            Source.user_id == current_user.id
        )
        .first()
    )

    if not source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source not found"
        )

    results = search_source_vector(
        user_id=current_user.id,
        source_id=source.id,
        query=query,
        k=3
    )

    return {
        "query": query,
        "results": [
            {
                "content_preview": doc.page_content[:300],
                "metadata": doc.metadata
            }
            for doc in results
        ]
    }

@router.post("/test-s3")
def test_s3_upload(
    file:UploadFile=File(...),
    current_user: User = Depends(get_current_user),

):
    file_bytes=file.file.read()
    s3_key=upload_pdf_to_s3(
        file_bytes=file_bytes,
        s3_key=generate_s3_key(
          user_id=current_user.id,
          source_id="test-source",
          filename=file.filename
        )
    )
    return {
        "message":"file uploaded sucessfully",
        "s3 Key":s3_key
    }
    