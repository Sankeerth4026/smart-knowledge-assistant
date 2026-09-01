from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.source import Source
from app.models.chat import ChatMessage
from app.schemas.chat_schema import ChatRequest,ChatResponse,CitationResponse,ChatMessageResponse
from app.services.rag_service import answer_question_from_source
from app.models.user import User
from typing import List

router=APIRouter(
    prefix="/chat",
    tags=["chat"],
)

@router.get("/{source_id}", response_model=List[ChatMessageResponse])
def get_chat_history(
        source_id: str,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    source = db.query(Source).filter(
        Source.id == source_id,
        Source.user_id == current_user.id,
    ).first()
    if source is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source not found"
        )
    
    messages = db.query(ChatMessage).filter(
        ChatMessage.source_id == source_id
    ).order_by(ChatMessage.created_at.asc()).all()
    
    # Format created_at to string to match schema
    for msg in messages:
        msg.created_at = msg.created_at.isoformat() if msg.created_at else ""
        
    return messages


@router.post("",response_model=ChatResponse)
def ask_question(
        chat_data:ChatRequest,
        db:Session =Depends(get_db),
        current_user:User=Depends(get_current_user)
):
    source=db.query(Source).filter(
        Source.id==chat_data.source_id,
        Source.user_id==current_user.id,
    ).first()
    if source is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source not found"
        )
    if(source.status!="processed"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The source file is not processed"
        )
    
    # Fetch recent history
    history = db.query(ChatMessage).filter(
        ChatMessage.source_id == source.id
    ).order_by(ChatMessage.created_at.desc()).limit(10).all()
    history.reverse() # chronologically
    
    try:
        response = answer_question_from_source(
              user_id=current_user.id,
              source_id=source.id,
              question=chat_data.question,
              chat_history=history
        )
        
        # Save user message
        user_msg = ChatMessage(
            source_id=source.id,
            user_id=current_user.id,
            role="user",
            content=chat_data.question
        )
        db.add(user_msg)
        
        # Save AI message
        ai_msg = ChatMessage(
            source_id=source.id,
            user_id=current_user.id,
            role="assistant",
            content=response["answer"]
        )
        db.add(ai_msg)
        
        db.commit()
        
        return response
        
    except FileNotFoundError:
       raise HTTPException(
           status_code=status.HTTP_404_NOT_FOUND,
           detail="vector index not found"
       )
    except Exception as err:
        print("RAG chat error",str(err))

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="failed to generate an answer"
        )
