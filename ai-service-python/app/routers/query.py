from fastapi import APIRouter
from app.models.schemas import QueryRequest, QueryResponse, SourceCitation
from app.services.vector_store import search_similar_chunks
from app.services.gemini_service import generate_answer

router = APIRouter()


@router.post("/ask", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    relevant_chunks = search_similar_chunks(request.question)

    answer = generate_answer(request.question, relevant_chunks)

    sources = [
        SourceCitation(document_name=chunk["document_name"], chunk_text=chunk["text"][:200])
        for chunk in relevant_chunks
    ]

    return QueryResponse(answer=answer, sources=sources)