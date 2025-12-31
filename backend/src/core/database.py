"""Database configuration and connection management."""

from sqlmodel import Session, create_engine
from sqlalchemy.pool import NullPool

from .config import settings

# Create SQLModel engine with NullPool for serverless compatibility
# NullPool ensures no connection pooling, suitable for Neon serverless
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",
    poolclass=NullPool,  # Serverless-friendly: no persistent connections
)


def get_session() -> Session:
    """
    Dependency function to get database session.

    Yields a SQLModel session that can be used with FastAPI's Depends().
    Automatically commits on success or rolls back on error.
    """
    with Session(engine) as session:
        yield session
