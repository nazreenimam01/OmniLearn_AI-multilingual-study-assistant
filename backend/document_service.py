from database import SessionLocal
from models import DocumentChunk
from embedding_service import create_embedding
from chunker import split_text_into_chunks


def process_document(document_name: str, text: str):

    chunks = split_text_into_chunks(text)

    db = SessionLocal()

    try:
        for chunk_text in chunks:

            embedding = create_embedding(chunk_text)

            document_chunk = DocumentChunk(
                document_name=document_name,
                chunk_text=chunk_text,
                embedding=embedding
            )

            db.add(document_chunk)

        db.commit()

        return len(chunks)

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()