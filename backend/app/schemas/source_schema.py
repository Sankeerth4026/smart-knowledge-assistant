from pydantic import BaseModel
from typing import Optional

class SourceResponse(BaseModel):
    id:str
    title:str
    type:str
    status:str
    total_pages:int=0
    total_characters:int=0
    error_message:Optional[str]=None
    
    class config:
        from_attributes = True

