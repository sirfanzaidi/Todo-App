"""Security utilities for input validation and sanitization."""

import re
from typing import Any


def sanitize_string(value: str) -> str:
    """Sanitize string input by removing control characters and trimming whitespace.

    Args:
        value: Input string to sanitize

    Returns:
        Sanitized string with control characters removed and whitespace trimmed
    """
    if not isinstance(value, str):
        return value

    # Remove null bytes
    value = value.replace("\x00", "")

    # Remove other control characters (except newlines, tabs, carriage returns)
    value = re.sub(r"[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]", "", value)

    # Trim whitespace
    value = value.strip()

    return value


def validate_email_format(email: str) -> bool:
    """Validate email format using regex.

    Args:
        email: Email address to validate

    Returns:
        True if email format is valid, False otherwise
    """
    # Basic email validation pattern
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))


def sanitize_input_dict(data: dict[str, Any]) -> dict[str, Any]:
    """Recursively sanitize all string values in a dictionary.

    Args:
        data: Dictionary with potentially unsafe string values

    Returns:
        Dictionary with sanitized string values
    """
    sanitized = {}

    for key, value in data.items():
        if isinstance(value, str):
            sanitized[key] = sanitize_string(value)
        elif isinstance(value, dict):
            sanitized[key] = sanitize_input_dict(value)
        elif isinstance(value, list):
            sanitized[key] = [
                sanitize_string(item) if isinstance(item, str) else item
                for item in value
            ]
        else:
            sanitized[key] = value

    return sanitized
