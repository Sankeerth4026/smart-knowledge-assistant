from pydantic import BaseModel,Field

class ChatRequest(BaseModel):
    source_id:str
    question:str=Field(...,min_length=2,max_length=1000)

class CitationResponse(BaseModel):
    title:str
    page_number:int | None
    chunk_index:int |None
    content_preview:str

class ChatResponse(BaseModel):
    answer:str
    citations: list[CitationResponse]

class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: str

    class Config:
        from_attributes = True