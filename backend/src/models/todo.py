"""Todo model for task management."""

from datetime import datetime
from uuid import UUID, uuid4

from pydantic import field_validator
from sqlmodel import Field, SQLModel

from ..core.security import sanitize_string


class Todo(SQLModel, table=True):
    """
    Todo entity representing a task item in a user's list.

    Each todo belongs to exactly one user and tracks completion status.
    """

    __tablename__ = "todos"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    title: str = Field(min_length=1, max_length=500, nullable=False)
    is_completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class TodoCreate(SQLModel):
    """Schema for creating a new todo."""

    title: str

    @field_validator("title", mode="before")
    @classmethod
    def sanitize_title(cls, v: str) -> str:
        """Sanitize title input."""
        return sanitize_string(v)


class TodoUpdate(SQLModel):
    """Schema for updating an existing todo."""

    title: str | None = None
    is_completed: bool | None = None

    @field_validator("title", mode="before")
    @classmethod
    def sanitize_title(cls, v: str | None) -> str | None:
        """Sanitize title input if provided."""
        if v is not None and isinstance(v, str):
            return sanitize_string(v)
        return v


class TodoResponse(SQLModel):
    """Schema for todo responses."""

    id: UUID
    title: str
    is_completed: bool
    created_at: datetime
    updated_at: datetime
