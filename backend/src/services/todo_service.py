"""Todo service for business logic."""

from datetime import datetime
from uuid import UUID

from sqlmodel import Session, select

from ..models.todo import Todo
from ..models.user import User


def get_user_todos(session: Session, user: User) -> list[Todo]:
    """
    Retrieve all todos for a specific user, sorted by creation date (newest first).

    Args:
        session: Database session
        user: User to get todos for

    Returns:
        List of todos owned by the user
    """
    statement = (
        select(Todo)
        .where(Todo.user_id == user.id)
        .order_by(Todo.created_at.desc())
    )
    todos = session.exec(statement).all()
    return list(todos)


def create_todo(session: Session, user: User, title: str) -> Todo:
    """
    Create a new todo for a user.

    Args:
        session: Database session
        user: User who owns the todo
        title: Todo task description

    Returns:
        Created todo object
    """
    new_todo = Todo(
        user_id=user.id,
        title=title,
        is_completed=False,
    )

    session.add(new_todo)
    session.commit()
    session.refresh(new_todo)

    return new_todo


def get_todo_by_id(session: Session, todo_id: UUID) -> Todo | None:
    """
    Get a todo by its ID.

    Args:
        session: Database session
        todo_id: UUID of the todo

    Returns:
        Todo object if found, None otherwise
    """
    statement = select(Todo).where(Todo.id == todo_id)
    return session.exec(statement).first()


def update_todo(
    session: Session,
    todo: Todo,
    title: str | None = None,
    is_completed: bool | None = None,
) -> Todo:
    """
    Update a todo's title and/or completion status.

    Args:
        session: Database session
        todo: Todo to update
        title: New title (optional)
        is_completed: New completion status (optional)

    Returns:
        Updated todo object
    """
    if title is not None:
        todo.title = title
    if is_completed is not None:
        todo.is_completed = is_completed

    todo.updated_at = datetime.utcnow()

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return todo


def delete_todo(session: Session, todo: Todo) -> None:
    """
    Delete a todo from the database.

    Args:
        session: Database session
        todo: Todo to delete
    """
    session.delete(todo)
    session.commit()
