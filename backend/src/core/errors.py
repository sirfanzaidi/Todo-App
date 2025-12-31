"""Standardized error responses for the API."""

from typing import Any
from pydantic import BaseModel


class ErrorDetail(BaseModel):
    """Standard error response format."""

    detail: str
    error_code: str
    field: str | None = None


class ErrorResponse(BaseModel):
    """Error response wrapper."""

    error: ErrorDetail


# Error codes for different types of errors
class ErrorCodes:
    """Standard error codes."""

    # Authentication errors
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
    NOT_AUTHENTICATED = "NOT_AUTHENTICATED"
    INVALID_TOKEN = "INVALID_TOKEN"
    SESSION_EXPIRED = "SESSION_EXPIRED"

    # Authorization errors
    FORBIDDEN = "FORBIDDEN"

    # Validation errors
    VALIDATION_ERROR = "VALIDATION_ERROR"
    INVALID_EMAIL = "INVALID_EMAIL"
    WEAK_PASSWORD = "WEAK_PASSWORD"
    EMPTY_FIELD = "EMPTY_FIELD"
    FIELD_TOO_LONG = "FIELD_TOO_LONG"

    # Resource errors
    NOT_FOUND = "NOT_FOUND"
    ALREADY_EXISTS = "ALREADY_EXISTS"

    # Server errors
    INTERNAL_ERROR = "INTERNAL_ERROR"
    DATABASE_ERROR = "DATABASE_ERROR"


def create_error_response(
    detail: str,
    error_code: str,
    field: str | None = None,
) -> dict[str, Any]:
    """Create a standardized error response.

    Args:
        detail: Human-readable error message
        error_code: Machine-readable error code
        field: Optional field name for validation errors

    Returns:
        Dictionary with error details
    """
    return {
        "error": {
            "detail": detail,
            "error_code": error_code,
            "field": field,
        }
    }
