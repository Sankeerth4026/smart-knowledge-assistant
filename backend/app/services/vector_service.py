import os
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from app.services.embedding_service import get_embedding_model
from app.core.config import settings

# Set as OS env var so langchain-pinecone can discover it
os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY

# Initialize Pinecone client once
pc = Pinecone(api_key=settings.PINECONE_API_KEY)


def get_source_vector_path(user_id: str, source_id: str) -> str:
    return f"pinecone://{settings.PINECONE_INDEX_NAME}/{source_id}"


def create_pinecone_index(chunks, user_id: str, source_id: str):
    if not chunks:
        raise ValueError("Error no chunks provided to create vectors")

    embedding_model = get_embedding_model()

    # Get the index object directly to bypass langchain's API key lookup
    index = pc.Index(settings.PINECONE_INDEX_NAME)

    vectorstore = PineconeVectorStore(
        index=index,
        embedding=embedding_model,
        namespace=source_id,
    )
    vectorstore.add_documents(documents=chunks)

    return {
        "vector_path": get_source_vector_path(user_id, source_id),
        "total_vector": len(chunks),
    }


def delete_pinecone_namespace(source_id: str):
    try:
        index = pc.Index(settings.PINECONE_INDEX_NAME)
        index.delete(delete_all=True, namespace=source_id)
    except Exception as e:
        print(f"Error deleting pinecone namespace {source_id}: {e}")


def search_source_vector(user_id: str, source_id: str, query: str, k: int = 4):
    embedding_model = get_embedding_model()

    index = pc.Index(settings.PINECONE_INDEX_NAME)

    vectorstore = PineconeVectorStore(
        index=index,
        embedding=embedding_model,
        namespace=source_id,
    )

    results = vectorstore.similarity_search(
        query=query,
        k=k,
    )
    return results