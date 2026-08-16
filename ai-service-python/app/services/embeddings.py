from sentence_transformers import SentenceTransformer

# This model runs locally on your computer - no API needed for this part
# It's small and fast, good for a project like this
_model = SentenceTransformer("all-MiniLM-L6-v2")


def get_embedding(text: str) -> list[float]:
    """Convert a piece of text into a list of numbers representing its meaning."""
    embedding = _model.encode(text)
    return embedding.tolist()


def get_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """Convert multiple pieces of text into embeddings at once (faster than one by one)."""
    embeddings = _model.encode(texts)
    return embeddings.tolist()