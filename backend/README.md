---
title: Todo App Backend
emoji: ✅
colorFrom: indigo
colorTo: pink
sdk: docker
pinned: false
license: mit
app_port: 7860
---

# Todo App Backend API

A modern FastAPI backend for a full-stack Todo application with JWT authentication.

## Features

- 🔐 JWT Authentication with HTTP-only cookies
- ✅ Full CRUD operations for todos
- 🗄️ PostgreSQL database with SQLModel ORM
- 🚀 RESTful API design
- ⚡ Fast and async with FastAPI
- 🔒 Secure password hashing with bcrypt

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/me` - Get current user

### Todos
- `GET /api/todos` - Get all todos for current user
- `POST /api/todos` - Create new todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo

## Environment Variables

Configure these in your Hugging Face Space settings:

```
DATABASE_URL=postgresql+psycopg://user:pass@host/db?sslmode=require
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend.vercel.app
```

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (Neon)
- **ORM**: SQLModel
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)
- **Migrations**: Alembic

## Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start server
uvicorn src.main:app --reload
```

Built with ❤️ using Claude Code
