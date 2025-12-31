"""User model for authentication and ownership."""

from datetime import datetime
from uuid import UUID, uuid4

from pydantic import field_validator, model_validator
from sqlmodel import Field, SQLModel

from ..core.security import sanitize_string


class User(SQLModel, table=True):
    """
    User entity representing authenticated application users.

    Each user can own multiple todos and has a unique email address.
    """

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    full_name: str = Field(max_length=100, nullable=False)
    email: str = Field(unique=True, index=True, max_length=255, nullable=False)
    password_hash: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class UserCreate(SQLModel):
    """Schema for user creation (signup)."""

    full_name: str
    email: str
    password: str
    retype_password: str

    @field_validator("full_name", mode="before")
    @classmethod
    def sanitize_name(cls, v: str) -> str:
        """Sanitize full name input."""
        return sanitize_string(v)

    @field_validator("email", mode="before")
    @classmethod
    def sanitize_email(cls, v: str) -> str:
        """Sanitize email input."""
        return sanitize_string(v).lower()

    @field_validator("password", "retype_password", mode="before")
    @classmethod
    def sanitize_passwords(cls, v: str) -> str:
        """Sanitize password inputs (trim only)."""
        if isinstance(v, str):
            return v.strip()
        return v

    @model_validator(mode="after")
    def validate_passwords_match(self) -> "UserCreate":
        """Verify that password and retype_password match."""
        if self.password != self.retype_password:
            raise ValueError("Passwords do not match 🔐")
        return self


class UserSignin(SQLModel):
    """Schema for user signin (login)."""

    email: str
    password: str

    @field_validator("email", mode="before")
    @classmethod
    def sanitize_email(cls, v: str) -> str:
        """Sanitize email input."""
        return sanitize_string(v).lower()

    @field_validator("password", mode="before")
    @classmethod
    def sanitize_password(cls, v: str) -> str:
        """Sanitize password input (trim only)."""
        if isinstance(v, str):
            return v.strip()
        return v


class UserResponse(SQLModel):
    """Schema for user responses (excludes password_hash)."""

    id: UUID
    full_name: str
    email: str
    created_at: datetime
