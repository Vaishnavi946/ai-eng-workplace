from fastapi import APIRouter, UploadFile, File
import uuid
from app.services.text_processing import chunk_text
from app.services.vector_store import add_chunks
from app.models.schemas import DocumentUploadResponse

router = APIRouter()


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8")

    document_id = str(uuid.uuid4())
    chunks = chunk_text(text)

    add_chunks(document_id=document_id, document_name=file.filename, chunks=chunks)

    return DocumentUploadResponse(
        message="Document uploaded and processed successfully",
        document_id=document_id,
        chunks_created=len(chunks),
    )