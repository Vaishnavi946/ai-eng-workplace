def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """
    Split a long text into smaller overlapping chunks.
    chunk_size = how many characters per chunk
    overlap = how many characters repeat between chunks (helps preserve context)
    """
    if len(text) <= chunk_size:
        return [text]

    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk.strip())
        start += chunk_size - overlap

    return [c for c in chunks if c]  # remove any empty chunks