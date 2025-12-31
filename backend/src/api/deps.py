"""Dependency injection functions for FastAPI routes."""

from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, status
from sqlmodel import Session, select

from ..core.database import get_session
from ..models.user import User
from ..services.auth_service import decode_access_token


async def get_current_user(
    session: Annotated[Session, Depends(get_session)],
    session_token: Annotated[str | None, Cookie(alias="session")] = None,
) -> User:
    """
    Extract current authenticated user from session cookie.

    This dependency function validates the session token from HTTP-only cookie
    and retrieves the corresponding user from the database.

    Args:
        session: Database session (injected)
        session_token: Session token from cookie (injected)

    Returns:
        Authenticated User object

    Raises:
        HTTPException: 401 if authentication fails
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )

    if not session_token:
        raise credentials_exception

    # Decode JWT token
    payload = decode_access_token(session_token)
    if not payload:
        raise credentials_exception

    user_id: str | None = payload.get("sub")
    if not user_id:
        raise credentials_exception

    # Retrieve user from database
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()

    if not user:
        raise credentials_exception

    return user
