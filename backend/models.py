from sqlalchemy import Column, Integer, Text
from pgvector.sqlalchemy import Vector

from database import Base


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_name = Column(Text)
    chunk_text = Column(Text, nullable=False)
    embedding = Column(Vector(1024))