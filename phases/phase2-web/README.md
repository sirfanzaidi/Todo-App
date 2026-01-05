# Phase 2: Web Todo App

Full-stack web application with Next.js frontend and FastAPI backend.

## Architecture

- **Frontend**: Next.js 14 (React + TypeScript) - `./frontend/`
- **Backend**: FastAPI (Python 3.13) - `./backend/`
- **Database**: PostgreSQL (Neon Cloud)
- **Authentication**: JWT-based with HTTP-only cookies
- **Deployment**:
  - Frontend: Vercel (https://frontend-ecru-nine-13.vercel.app)
  - Backend: Railway/Render (configured)
  - Database: Neon PostgreSQL (serverless)

## Tech Stack

### Backend
- FastAPI 0.124+ - Modern Python web framework
- SQLModel 0.0.14 - SQL database ORM
- Psycopg 3.3+ - PostgreSQL adapter
- Alembic 1.12 - Database migrations
- PassLib + Bcrypt 4.2 - Password hashing
- Python-JOSE 3.3 - JWT token handling

### Frontend
- Next.js 14 - React framework with App Router
- TypeScript 5.2+ - Type safety
- React 18.2 - UI library
- Native Fetch API - HTTP client

## Quick Start

### Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Manual Setup (Current Working Configuration)

#### Prerequisites
- Python 3.13+
- Node.js 22+ and npm 11+
- PostgreSQL database (or use Neon Cloud)

#### Backend Setup
```bash
cd backend

# Install dependencies (using system Python)
pip install -r requirements.txt

# Configure environment
# The .env file is already configured with Neon PostgreSQL
# Update DATABASE_URL if using your own database

# Run migrations
alembic upgrade head

# Start backend server
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will start at: http://localhost:8000

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# The .env.local is already configured to connect to localhost:8000
# Update NEXT_PUBLIC_API_URL if your backend is elsewhere

# Start development server
npm run dev
```

Frontend will start at: http://localhost:3000

## Environment Configuration

### Backend (.env)
```env
APP_ENV=development
DATABASE_URL=postgresql+psycopg://user:pass@host/db?sslmode=require
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
API_HOST=0.0.0.0
API_PORT=8000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login user
- `POST /auth/signout` - Logout user
- `GET /auth/me` - Get current user

### Todos
- `GET /todos/` - List all todos
- `POST /todos/` - Create new todo
- `GET /todos/{id}` - Get specific todo
- `PUT /todos/{id}` - Update todo
- `DELETE /todos/{id}` - Delete todo

### Health
- `GET /health` - API health check

## Development

### Backend Testing
```bash
cd backend
python -m pytest
```

### Frontend Linting
```bash
cd frontend
npm run lint
```

### Database Migrations
```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Production Deployment

### Frontend (Vercel)
Already deployed at: https://frontend-ecru-nine-13.vercel.app

Configuration in `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### Backend (Railway/Render)
Configured with:
- `Procfile` - Process definition
- `railway.json` - Railway configuration
- `Dockerfile` - Container build

Environment variables needed:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret
- `CORS_ORIGINS` - Allowed frontend origins

## Troubleshooting

### Backend Issues

**Virtual environment not working:**
- The venv may be from a different system
- Solution: Use system Python directly with `python -m pip install -r requirements.txt`

**Database connection errors:**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running (or Neon is accessible)
- Verify SSL mode is set correctly for cloud databases

**ImportError: No module named 'sqlmodel':**
- Run: `pip install -r requirements.txt`

### Frontend Issues

**Cannot connect to backend:**
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in .env.local
- Ensure CORS is configured in backend .env

**Port 3000 already in use:**
- Kill existing process: `npx kill-port 3000`
- Or use different port: `PORT=3001 npm run dev`

## Documentation

See `../../specs/phase2-web/` for:
- Detailed specifications
- Architecture decisions
- Implementation plans
- Task breakdowns

## Features

- User authentication with JWT
- CRUD operations for todos
- Responsive UI design
- Real-time form validation
- Error handling and toast notifications
- Secure HTTP-only cookie authentication
- CORS and CSRF protection
- Database migrations
- API documentation (Swagger/OpenAPI)
