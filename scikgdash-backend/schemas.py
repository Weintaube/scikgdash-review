# db/schemas.py

from pydantic import BaseModel
from typing import List, Optional

class CommentBase(BaseModel):
    id: int
    typeRes: Optional[str] = None
    uri: str
    typeComm: str
    description: Optional[str] = None

    class Config:
        orm_mode = True

class ResourceBase(BaseModel):
    id: int
    title: Optional[str] = None
    type: str
    url: str
    comments: List[CommentBase] = []

    class Config:
        orm_mode = True
