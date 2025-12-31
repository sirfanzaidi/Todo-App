# Quick Start Guide: Phase II - Full-Stack Web Todo Application

**Feature**: Phase II - Persistent web todo application with authentication
**Created**: 2025-12-31
**Status**: Development Setup Guide

## Overview

This guide will help you set up the Phase II development environment for the Evolution of Todo full-stack web application. The system consists of a FastAPI backend with PostgreSQL persistence and a Next.js frontend with TypeScript.

---

## Prerequisites

### Required Software

- **Python**: 3.11 or higher
- **Node.js**: 18 or higher (LTS recommended)
- **npm**: 9 or higher (comes with Node.js)
- **Git**: For version control
- **Neon PostgreSQL Account**: Free tier available at https://neon.tech

### Recommended Tools

- **VS Code** or your preferred IDE
- **Postman** or **Thunder Client** for API testing
- **PostgreSQL Client** (optional) for database inspection

---

## Setup Instructions

### 1. Clone Repository

```bash
# If not already cloned
git clone <repository-url>
cd todo-app

# Checkout Phase II branch
git checkout 002-phase-ii-persistence
```

### 2. Database Setup (Neon PostgreSQL)

#### Create Neon Database

1. Sign up for free account at https://neon.tech
2. Create a new project named "todo-app-phase-ii"
3. Copy the connection string (format: `postgresql://user:password@host.neon.tech:5432/dbname`)
4. **Important**: Use the **pooling endpoint** (port 6432) for serverless compatibility

**Example connection strings:**
```bash
# Direct connection (port 5432) - for local development
postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech:5432/neondb

# Pooling endpoint (port 6432) - for production/serverless
postgresql://username:password@ep-cool-name-123456-pooler.us-east-2.aws.neon.tech:6432/neondb
```

---

### 3. Backend Setup (FastAPI)

#### Navigate to Backend Directory

```bash
cd backend
```

#### Create Virtual Environment

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

#### Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**If `requirements.txt` doesn't exist yet, create it with:**
```txt
fastapi==0.104.1
sqlmodel==0.0.14
uvicorn[standard]==0.24.0
python-dotenv==1.0.0
alembic==1.12.1
asyncpg==0.29.0
python-multipart==0.0.6
email-validator==2.1.0
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
httpx==0.25.1
```

#### Configure Environment Variables

Create `.env` file in `backend/` directory:

```bash
# backend/.env
ENVIRONMENT=development

# Database (use pooling endpoint for production)
DATABASE_URL=postgresql://username:password@host-pooler.neon.tech:6432/dbname?sslmode=require

# Better Auth (get these from Better Auth setup)
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Application
API_HOST=0.0.0.0
API_PORT=8000
```

**Generate SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### Initialize Database Migrations

```bash
# Initialize Alembic
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial schema: users and todos tables"

# Apply migration
alembic upgrade head
```

#### Start Backend Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Test backend:**
```bash
curl http://localhost:8000/health
# Expected: {"status": "ok"}
```

---

### 4. Frontend Setup (Next.js)

#### Navigate to Frontend Directory

```bash
cd frontend  # or cd ../frontend if coming from backend/
```

#### Install Dependencies

```bash
npm install
```

**If `package.json` doesn't exist yet, create it:**
```bash
npm init -y
npm install next@14 react@18 react-dom@18
npm install --save-dev typescript @types/react @types/node
npm install --save-dev eslint eslint-config-next
npm install --save-dev @types/react-dom
```

#### Configure Environment Variables

Create `.env.local` file in `frontend/` directory:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Better Auth configuration (if using Better Auth SDK)
BETTER_AUTH_CLIENT_ID=your-client-id
```

#### Start Frontend Dev Server

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

---

## Testing the Application

### 1. Test Backend API

**Health Check:**
```bash
curl http://localhost:8000/health
```

**API Documentation (OpenAPI/Swagger):**
```
http://localhost:8000/docs
```

**Test Signup (via curl):**
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123"
  }'
```

**Test Signin:**
```bash
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123"
  }'
```

**Test Get Todos (requires auth):**
```bash
curl http://localhost:8000/api/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Test Frontend

1. Navigate to http://localhost:3000
2. You should see the landing page
3. Click "Sign Up" → Create a test account
4. After signup, you should be redirected to `/todos`
5. Try creating, editing, and deleting todos

### 3. End-to-End Manual Test

**Complete user flow:**

1. **Sign Up**:
   - Navigate to http://localhost:3000/signup
   - Enter email and password
   - Submit → should redirect to /todos

2. **Create Todos**:
   - Add a new todo: "Buy groceries"
   - Add another: "Write documentation"
   - Verify both appear in the list

3. **Mark Complete**:
   - Check the checkbox next to "Buy groceries"
   - Verify it shows as completed (strikethrough)

4. **Edit Todo**:
   - Click edit on "Write documentation"
   - Change to "Write Phase II documentation"
   - Verify update persists

5. **Delete Todo**:
   - Click delete on completed todo
   - Verify it's removed from list

6. **Sign Out**:
   - Click sign out button
   - Verify redirect to /signin

7. **Sign In Again**:
   - Sign in with same credentials
   - Verify todos persist (not deleted)

---

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=src tests/

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

**Expected output:**
```
========================= test session starts =========================
collected 25 items

tests/test_auth.py .......                                     [ 28%]
tests/test_todos.py ..................                         [100%]

========================= 25 passed in 2.35s =========================
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

**Expected output:**
```
 PASS  src/components/TodoList.test.tsx
 PASS  src/components/AuthForm.test.tsx

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
```

---

## Common Issues and Troubleshooting

### Issue: Database Connection Error

**Error:**
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solutions:**
1. Verify Neon database is active (check Neon dashboard)
2. Check `DATABASE_URL` in `.env` is correct
3. Ensure you're using the pooling endpoint (port 6432)
4. Verify SSL mode: `?sslmode=require` is appended

**Test connection manually:**
```bash
psql "postgresql://user:pass@host.neon.tech:5432/dbname?sslmode=require"
```

---

### Issue: CORS Errors in Frontend

**Error in browser console:**
```
Access to fetch at 'http://localhost:8000/api/auth/signin' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**
1. Verify backend `CORS_ORIGINS` includes `http://localhost:3000`
2. Ensure frontend uses `credentials: 'include'` in fetch calls
3. Check FastAPI CORS middleware is configured with `allow_credentials=True`

**Check CORS configuration:**
```python
# backend/src/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,  # Required for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Issue: Authentication Failures

**Error:**
```
401 Unauthorized
```

**Solutions:**
1. Verify Better Auth is properly configured
2. Check session cookies are being set (inspect browser DevTools → Application → Cookies)
3. Ensure `httpOnly` cookie is set with correct `sameSite` attribute
4. Test with curl to isolate frontend vs backend issue

**Inspect cookies:**
```bash
# In browser DevTools Console
document.cookie
```

---

### Issue: Alembic Migration Errors

**Error:**
```
Target database is not up to date.
```

**Solutions:**
```bash
# Check current migration state
alembic current

# View migration history
alembic history

# Upgrade to latest
alembic upgrade head

# Downgrade if needed
alembic downgrade -1
```

---

### Issue: Port Already in Use

**Error:**
```
Address already in use
```

**Solutions:**

**Find process using port:**
```bash
# Linux/macOS
lsof -i :8000  # or :3000

# Windows
netstat -ano | findstr :8000
```

**Kill process:**
```bash
# Linux/macOS
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

**Or use different port:**
```bash
# Backend
uvicorn src.main:app --reload --port 8001

# Frontend
npm run dev -- -p 3001
```

---

### Issue: Frontend Build Errors

**Error:**
```
Module not found: Can't resolve '@/lib/api'
```

**Solutions:**
1. Verify `tsconfig.json` has correct path mappings:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

2. Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

---

## Development Workflow

### Daily Development Routine

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn src.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Database migrations (as needed)
cd backend
alembic revision --autogenerate -m "Add new field"
alembic upgrade head
```

### Database Schema Changes

**Workflow:**
1. Modify SQLModel classes in `backend/src/models/`
2. Generate migration: `alembic revision --autogenerate -m "Description"`
3. Review generated migration file in `backend/alembic/versions/`
4. Apply migration: `alembic upgrade head`
5. Test changes in application

### Code Changes Checklist

Before committing:
- [ ] Backend: Run `pytest` → all tests pass
- [ ] Backend: Run `ruff check .` → no linting errors
- [ ] Backend: Run `mypy src` → no type errors
- [ ] Frontend: Run `npm test` → all tests pass
- [ ] Frontend: Run `npm run lint` → no linting errors
- [ ] Manual testing of changed features
- [ ] Database migrations applied and tested

---

## Environment Variables Summary

### Backend (.env)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | `postgresql://user:pass@host:6432/db` | Neon PostgreSQL connection string |
| `ENVIRONMENT` | No | `development` | Environment mode (development/production) |
| `CORS_ORIGINS` | ✅ Yes | `http://localhost:3000` | Allowed frontend origins |
| `SECRET_KEY` | ✅ Yes | `random-secret-key` | JWT signing secret |
| `BETTER_AUTH_SECRET` | ✅ Yes | `auth-secret-key` | Better Auth secret |
| `API_HOST` | No | `0.0.0.0` | API server host |
| `API_PORT` | No | `8000` | API server port |

### Frontend (.env.local)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | `http://localhost:8000` | Backend API base URL |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Frontend app URL |

---

## Next Steps

Once the development environment is running:

1. **Review the plan**: Read `plan.md` to understand the architecture
2. **Review the spec**: Read `spec.md` to understand requirements
3. **Review data models**: Read `data-model.md` to understand database schema
4. **Review API contracts**: Check `contracts/*.yaml` for API specifications
5. **Start implementing**: Follow the tasks defined in `tasks.md` (once generated via `/sp.tasks`)

---

## Useful Commands Reference

### Backend Commands

```bash
# Start server
uvicorn src.main:app --reload

# Run tests
pytest
pytest --cov=src tests/

# Database migrations
alembic revision --autogenerate -m "Message"
alembic upgrade head
alembic downgrade -1

# Linting and type checking
ruff check .
mypy src

# Install new package
pip install package-name
pip freeze > requirements.txt
```

### Frontend Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build
npm start  # Serve production build

# Run tests
npm test
npm test -- --watch

# Linting
npm run lint

# Install new package
npm install package-name
npm install --save-dev package-name  # For dev dependencies
```

### Git Commands

```bash
# Check current branch
git branch

# Create new branch
git checkout -b feature-name

# Commit changes
git add .
git commit -m "feat: add user authentication"

# Push changes
git push origin 002-phase-ii-persistence

# Pull latest
git pull origin 002-phase-ii-persistence
```

---

## Production Deployment Notes

**Important differences for production:**

1. **Environment Variables**:
   - Use production database URL (pooling endpoint)
   - Set `ENVIRONMENT=production`
   - Generate new `SECRET_KEY` (never reuse development keys)
   - Set `CORS_ORIGINS` to production domain

2. **Security**:
   - Enable HTTPS (set `secure=True` for cookies)
   - Use strong passwords and secrets
   - Enable database SSL (`?sslmode=require`)
   - Set `httpOnly`, `secure`, and `sameSite` cookie attributes

3. **Performance**:
   - Use Neon pooling endpoint (port 6432)
   - Enable database connection pooling
   - Set appropriate cache headers
   - Enable Next.js production optimizations

4. **Monitoring**:
   - Set up error logging
   - Monitor database connections
   - Track API response times
   - Set up health check endpoints

**Production deployment is out of scope for Phase II development.**

---

## Additional Resources

### Official Documentation

- **FastAPI**: https://fastapi.tiangolo.com/
- **SQLModel**: https://sqlmodel.tiangolo.com/
- **Alembic**: https://alembic.sqlalchemy.org/
- **Next.js**: https://nextjs.org/docs
- **Neon PostgreSQL**: https://neon.tech/docs
- **Better Auth**: https://www.betterauth.dev/docs

### Phase II Artifacts

- **Specification**: `spec.md` - Requirements and user stories
- **Plan**: `plan.md` - Architecture and technical approach
- **Data Model**: `data-model.md` - Database schema and relationships
- **API Contracts**: `contracts/*.yaml` - OpenAPI specifications
- **Research**: `research.md` - Technology research findings

---

**Last Updated**: 2025-12-31
**Status**: ✅ Ready for Development
**Next Command**: `/sp.tasks` (to generate implementation tasks)
