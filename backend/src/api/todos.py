"""Todo CRUD API endpoints."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from ..api.deps import get_current_user
from ..core.database import get_session
from ..models.todo import TodoCreate, TodoResponse, TodoUpdate
from ..models.user import User
from ..services import todo_service

router = APIRouter(prefix="/api/todos", tags=["Todos"])


@router.get("", status_code=status.HTTP_200_OK)
async def get_todos(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict:
    """
    Retrieve all todos for the authenticated user.

    Todos are sorted by creation date (newest first) and filtered
    to only include todos owned by the current user.

    Args:
        session: Database session
        current_user: Authenticated user

    Returns:
        Dictionary with list of todos

    Raises:
        HTTPException: 401 if not authenticated
    """
    todos = todo_service.get_user_todos(session, current_user)

    return {
        "todos": [
            TodoResponse(
                id=todo.id,
                title=todo.title,
                is_completed=todo.is_completed,
                created_at=todo.created_at,
                updated_at=todo.updated_at,
            )
            for todo in todos
        ]
    }


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_data: TodoCreate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict:
    """
    Create a new todo for the authenticated user.

    Args:
        todo_data: Todo creation data (title)
        session: Database session
        current_user: Authenticated user

    Returns:
        Dictionary with created todo

    Raises:
        HTTPException: 400 if invalid input
        HTTPException: 401 if not authenticated
    """
    # Validate title
    if not todo_data.title or not todo_data.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title must not be empty",
        )

    if len(todo_data.title) > 500:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title must be between 1 and 500 characters",
        )

    # Create todo
    new_todo = todo_service.create_todo(session, current_user, todo_data.title.strip())

    return {
        "todo": TodoResponse(
            id=new_todo.id,
            title=new_todo.title,
            is_completed=new_todo.is_completed,
            created_at=new_todo.created_at,
            updated_at=new_todo.updated_at,
        )
    }


@router.put("/{todo_id}", status_code=status.HTTP_200_OK)
async def update_todo(
    todo_id: UUID,
    todo_data: TodoUpdate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict:
    """
    Update an existing todo (title and/or completion status).

    Users can only update their own todos.

    Args:
        todo_id: UUID of the todo to update
        todo_data: Update data (title and/or is_completed)
        session: Database session
        current_user: Authenticated user

    Returns:
        Dictionary with updated todo

    Raises:
        HTTPException: 400 if invalid input
        HTTPException: 401 if not authenticated
        HTTPException: 403 if todo belongs to different user
        HTTPException: 404 if todo not found
    """
    # Get todo
    todo = todo_service.get_todo_by_id(session, todo_id)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found",
        )

    # Verify ownership
    if todo.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this todo",
        )

    # Validate title if provided
    if todo_data.title is not None:
        if not todo_data.title or not todo_data.title.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title must not be empty",
            )

        if len(todo_data.title) > 500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title must be between 1 and 500 characters",
            )

    # Update todo
    updated_todo = todo_service.update_todo(
        session,
        todo,
        title=todo_data.title.strip() if todo_data.title else None,
        is_completed=todo_data.is_completed,
    )

    return {
        "todo": TodoResponse(
            id=updated_todo.id,
            title=updated_todo.title,
            is_completed=updated_todo.is_completed,
            created_at=updated_todo.created_at,
            updated_at=updated_todo.updated_at,
        )
    }


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(
    todo_id: UUID,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> None:
    """
    Delete a todo permanently.

    Users can only delete their own todos.

    Args:
        todo_id: UUID of the todo to delete
        session: Database session
        current_user: Authenticated user

    Raises:
        HTTPException: 401 if not authenticated
        HTTPException: 403 if todo belongs to different user
        HTTPException: 404 if todo not found
    """
    # Get todo
    todo = todo_service.get_todo_by_id(session, todo_id)

    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found",
        )

    # Verify ownership
    if todo.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this todo",
        )

    # Delete todo
    todo_service.delete_todo(session, todo)
