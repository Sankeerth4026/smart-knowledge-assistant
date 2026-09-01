import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text
from sqlalchemy.sql import func
from app.core.database import Base


class Source(Base):
    __tablename__ = "sources"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    user_id = Column(
        String,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    type = Column(
        String(30),
        nullable=False,
        default="pdf"
    )

    title = Column(
        String(225),
        nullable=False
    )

    filepath = Column(
        String(500),
        nullable=False
    )

    status = Column(
        String(30),
        default="processing",
        nullable=False
    )

    total_pages = Column(
        Integer,
        nullable=False,
        default=0
    )

    total_characters = Column(
        Integer,
        nullable=False,
        default=0
    )

    error_message = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )