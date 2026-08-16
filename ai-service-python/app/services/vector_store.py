import chromadb
from app.core.config import CHROMA_PERSIST_DIR
from app.services.embeddings import get_embedding, get_embeddings_batch

client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
collection = client.get_or_create_collection(name="documents")


def add_chunks(document_id: str, document_name: str, chunks: list[str]):
    """Save document chunks into the vector database, with their embeddings."""
    embeddings = get_embeddings_batch(chunks)

    ids = [f"{document_id}-{i}" for i in range(len(chunks))]
    metadatas = [{"document_name": document_name, "document_id": document_id} for _ in chunks]

    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=chunks,
        metadatas=metadatas,
    )


def search_similar_chunks(question: str, n_results: int = 4):
    """Find the most relevant document chunks for a given question."""
    question_embedding = get_embedding(question)

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=n_results,
    )

    chunks = []
    if results["documents"] and len(results["documents"]) > 0:
        for i, doc_text in enumerate(results["documents"][0]):
            metadata = results["metadatas"][0][i]
            chunks.append({
                "text": doc_text,
                "document_name": metadata.get("document_name", "unknown"),
            })

    return chunks