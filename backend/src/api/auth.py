"""Authentication API endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlmodel import Session, select

from ..core.config import settings
from ..core.database import get_session
from ..models.user import User, UserCreate, UserSignin, UserResponse
from ..services.auth_service import (
    create_access_token,
    hash_password,
    verify_password,
)
from .deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Cookie settings based on environment
IS_PRODUCTION = settings.ENVIRONMENT == "production"
COOKIE_SECURE = IS_PRODUCTION  # True in production (HTTPS), False in dev (HTTP)
COOKIE_SAMESITE = "none" if IS_PRODUCTION else "lax"  # "none" for cross-site in production


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    response: Response,
    session: Annotated[Session, Depends(get_session)],
) -> dict:
    """
    Create new user account.

    Args:
        user_data: Email and password for new user
        response: FastAPI response object for setting cookies
        session: Database session

    Returns:
        User information and session token

    Raises:
        HTTPException: 409 if email already exists
        HTTPException: 400 if invalid input
    """
    # Validate email format (basic check)
    if "@" not in user_data.email or "." not in user_data.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format",
        )

    # Validate password strength
    if len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters",
        )

    if len(user_data.password) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password cannot be longer than 72 characters",
        )

    # Check if email already exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hashed_password,
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Create session token
    access_token = create_access_token(data={"sub": str(new_user.id)})

    # Set HTTP-only cookie
    response.set_cookie(
        key="session",
        value=access_token,
        httponly=True,  # JavaScript cannot access
        secure=COOKIE_SECURE,  # True in production (HTTPS), False in dev
        samesite=COOKIE_SAMESITE,  # "none" for cross-site in production, "lax" in dev
        max_age=7 * 24 * 60 * 60,  # 7 days
    )

    return {
        "user": UserResponse(
            id=new_user.id,
            full_name=new_user.full_name,
            email=new_user.email,
            created_at=new_user.created_at,
        ),
        "session": {"token": access_token},
    }


@router.post("/signin", status_code=status.HTTP_200_OK)
async def signin(
    user_data: UserSignin,
    response: Response,
    session: Annotated[Session, Depends(get_session)],
) -> dict:
    """
    Authenticate existing user.

    Args:
        user_data: Email and password for authentication
        response: FastAPI response object for setting cookies
        session: Database session

    Returns:
        User information and session token

    Raises:
        HTTPException: 400 if missing credentials
        HTTPException: 401 if invalid credentials
    """
    # Validate input
    if not user_data.email or not user_data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required",
        )

    # Find user by email
    statement = select(User).where(User.email == user_data.email)
    user = session.exec(statement).first()

    # Verify credentials
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Create session token
    access_token = create_access_token(data={"sub": str(user.id)})

    # Set HTTP-only cookie
    response.set_cookie(
        key="session",
        value=access_token,
        httponly=True,
        secure=COOKIE_SECURE,  # True in production (HTTPS), False in dev
        samesite=COOKIE_SAMESITE,  # "none" for cross-site in production, "lax" in dev
        max_age=7 * 24 * 60 * 60,  # 7 days
    )

    return {
        "user": UserResponse(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
            created_at=user.created_at,
        ),
        "session": {"token": access_token},
    }


@router.post("/signout", status_code=status.HTTP_200_OK)
async def signout(
    response: Response,
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict:
    """
    Sign out current user by clearing session cookie.

    Args:
        response: FastAPI response object for clearing cookies
        current_user: Authenticated user (validates token)

    Returns:
        Success message
    """
    # Clear session cookie
    response.delete_cookie(key="session", samesite=COOKIE_SAMESITE)

    return {"message": "Signed out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserResponse:
    """
    Get current authenticated user information.

    Args:
        current_user: The authenticated user from session cookie

    Returns:
        User details 🚀
    """
    return UserResponse(
        id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        created_at=current_user.created_at,
    )
