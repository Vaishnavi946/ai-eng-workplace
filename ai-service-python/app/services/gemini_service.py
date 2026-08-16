import google.generativeai as genai
from app.core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-flash-latest")

def generate_answer(question: str, context_chunks: list[dict]) -> str:
    """Ask Gemini to answer a question using only the provided document chunks."""

    if not context_chunks:
        return "I couldn't find any relevant information in the uploaded documents to answer this question."

    context_text = "\n\n".join(
        f"[From: {chunk['document_name']}]\n{chunk['text']}"
        for chunk in context_chunks
    )

    prompt = f"""You are a helpful assistant answering questions based ONLY on the provided documents.
If the documents don't contain enough information to answer, say so honestly.
Do not make up information that isn't in the documents.

DOCUMENTS:
{context_text}

QUESTION: {question}

ANSWER:"""

    response = model.generate_content(prompt)
    return response.text