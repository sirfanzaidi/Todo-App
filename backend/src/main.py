"""FastAPI application entry point."""

import logging
import time
import uuid
from typing import Callable

from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api import auth, todos
from .core.config import settings
from .core.errors import ErrorCodes, create_error_response

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI application instance
app = FastAPI(
    title="Todo App API",
    description="Phase II - Full-Stack Web Todo Application Backend",
    version="1.0.0",
)

# Configure CORS middleware FIRST to ensure headers are always present
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,  # Required for HTTP-only cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def request_logging_middleware(
    request: Request, call_next: Callable
) -> Response:
    """Log all incoming requests with request ID tracking."""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    # Log request
    logger.info(
        f"Request {request_id}: {request.method} {request.url.path} "
        f"from {request.client.host if request.client else 'unknown'}"
    )

    start_time = time.time()

    # Process request
    try:
        response = await call_next(request)
        process_time = time.time() - start_time

        # Log response
        logger.info(
            f"Request {request_id}: Status {response.status_code} "
            f"completed in {process_time:.3f}s"
        )

        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id

        return response
    except Exception as exc:
        process_time = time.time() - start_time
        logger.error(
            f"Request {request_id}: Failed after {process_time:.3f}s - {exc}"
        )
        raise


# Security headers middleware
@app.middleware("http")
async def security_headers_middleware(
    request: Request, call_next: Callable
) -> Response:
    """Add security headers to all responses."""
    response = await call_next(request)

    # Add security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains"
    )

    return response


# Global exception handler
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError) -> JSONResponse:
    """Handle ValueErrors (like bcrypt 72-char limit) gracefully."""
    request_id = getattr(request.state, "request_id", "unknown")

    # Check for specific bcrypt error
    if "password cannot be longer than 72 bytes" in str(exc):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=create_error_response(
                detail="Password cannot be longer than 72 characters 🔐",
                error_code=ErrorCodes.VALIDATION_ERROR,
            ),
        )

    logger.error(f"ValueError in request {request_id}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=create_error_response(
            detail=str(exc),
            error_code=ErrorCodes.VALIDATION_ERROR,
        ),
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle all unhandled exceptions."""
    request_id = getattr(request.state, "request_id", "unknown")

    logger.error(f"Unhandled exception in request {request_id}: {exc}", exc_info=True)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=create_error_response(
            detail="An internal server error occurred. Please try again later.",
            error_code=ErrorCodes.INTERNAL_ERROR,
        ),
    )


# Register routers
app.include_router(auth.router)
app.include_router(todos.router)


@app.get("/health")
async def health_check() -> dict[str, str]:
    """
    Health check endpoint.

    Returns:
        dict: Status message indicating the API is healthy
    """
    return {"status": "ok"}
