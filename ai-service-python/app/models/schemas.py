from pydantic import BaseModel
from typing import Optional


class DocumentUploadResponse(BaseModel):
    message: str
    document_id: str
    chunks_created: int


class QueryRequest(BaseModel):
    question: str


class SourceCitation(BaseModel):
    document_name: str
    chunk_text: str


class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceCitation]