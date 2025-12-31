# Implementation Plan: Phase II - Full-Stack Web Todo Application

**Branch**: `002-phase-ii-persistence` | **Date**: 2025-12-31 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-phase-ii-persistence/spec.md`

## Summary

Phase II transforms the console todo application into a full-stack web application with user authentication and persistent storage. The architecture uses FastAPI for the backend REST API, Neon Serverless PostgreSQL for data persistence with SQLModel ORM, Next.js with TypeScript for the frontend, and Better Auth for authentication. The system enforces user data isolation where each authenticated user can only access and modify their own todos. The technical approach follows clean architecture principles with clear separation between backend API, frontend UI, and data persistence layers.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript (frontend)
**Primary Dependencies**: FastAPI, SQLModel, Better Auth, Next.js, React
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest (backend), Jest/React Testing Library (frontend)
**Target Platform**: Web application (Linux/Windows server for backend, web browsers for frontend)
**Project Type**: Web (frontend + backend architecture)
**Performance Goals**: API p95 latency < 500ms, UI operations complete in < 2 seconds, support 1000+ concurrent users
**Constraints**: No AI/ML frameworks, no message queues, no container orchestration, no background jobs, stateless API design
**Scale/Scope**: Multi-user web application, ~7 API endpoints, 4 frontend pages, 2 database tables

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitutional Compliance Review

#### ✅ Principle I: Spec-Driven Development
- **Status**: PASS
- **Evidence**: Plan derived from approved spec.md, will generate tasks.md before implementation
- **Compliance**: Following SDD workflow (Constitution → Spec → Plan → Tasks → Implement)

#### ✅ Principle II: Agent Behavior and Human-Agent Boundaries
- **Status**: PASS
- **Evidence**: Plan awaits human approval before proceeding to task breakdown
- **Compliance**: No features invented beyond spec, architectural decisions documented for approval

#### ✅ Principle III: Phase Governance and Scope Control
- **Status**: PASS
- **Evidence**: Plan strictly implements Phase II requirements, no Phase III+ features included
- **Verification**:
  - ❌ No AI/ML frameworks
  - ❌ No agent frameworks
  - ❌ No Kubernetes or container orchestration
  - ❌ No Kafka or message queues
  - ✅ Only Phase II approved technologies used

#### ✅ Principle IV: Technology Stack and Platform Constraints
- **Status**: PASS
- **Evidence**: Plan uses Phase II authorized technology matrix
- **Backend Technologies**:
  - ✅ Python 3.11+
  - ✅ FastAPI (REST API framework)
  - ✅ SQLModel (ORM)
  - ✅ Neon Serverless PostgreSQL
- **Frontend Technologies**:
  - ✅ Next.js (React framework)
  - ✅ TypeScript
- **Authentication**:
  - ✅ Better Auth
- **Development Tools**:
  - ✅ pytest, Jest/React Testing Library
  - ✅ Ruff (Python), ESLint (TypeScript)
  - ✅ mypy, TypeScript compiler

#### ✅ Principle V: Quality Standards and Architectural Principles
- **Status**: PASS
- **Evidence**: Plan follows clean architecture, stateless services, separation of concerns
- **Architectural Compliance**:
  - ✅ Clean Architecture: Models/Services/Controllers/Infrastructure separation
  - ✅ Stateless Services: API endpoints stateless, session in Better Auth
  - ✅ Separation of Concerns: Clear backend/frontend/data layers
  - ✅ Cloud-Native Readiness: Environment-based config, health endpoints planned
  - ✅ Code Quality: Type hints (Python), TypeScript strict mode
  - ✅ Security: Authentication enforcement, input validation, SQL injection prevention via ORM

### Gate Decision: ✅ **PASS - Proceed to Phase 0 Research**

No constitutional violations. All technologies align with Phase II matrix.

## Project Structure

### Documentation (this feature)

```text
specs/002-phase-ii-persistence/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   ├── auth-api.yaml    # Better Auth endpoints
│   └── todo-api.yaml    # Todo CRUD endpoints
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User SQLModel
│   │   └── todo.py          # Todo SQLModel
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py  # Better Auth integration
│   │   └── todo_service.py  # Todo business logic
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependency injection (get current user)
│   │   ├── auth.py          # Auth endpoints (signup/signin/signout)
│   │   └── todos.py         # Todo CRUD endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py        # Environment configuration
│   │   └── database.py      # Database connection and session
│   └── main.py              # FastAPI app entry point
├── tests/
│   ├── contract/            # API contract tests
│   ├── integration/         # Integration tests
│   └── unit/                # Unit tests
├── alembic/                 # Database migrations
├── requirements.txt         # Python dependencies
└── .env.example             # Example environment variables

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Landing/redirect page
│   │   ├── signup/
│   │   │   └── page.tsx     # Signup page
│   │   ├── signin/
│   │   │   └── page.tsx     # Signin page
│   │   └── todos/
│   │       └── page.tsx     # Todo list page
│   ├── components/
│   │   ├── AuthForm.tsx     # Reusable auth form component
│   │   ├── TodoList.tsx     # Todo list display
│   │   ├── TodoItem.tsx     # Individual todo item
│   │   └── TodoForm.tsx     # Add/edit todo form
│   ├── lib/
│   │   ├── api.ts           # API client functions
│   │   └── auth.ts          # Auth state management
│   └── types/
│       └── index.ts         # TypeScript type definitions
├── tests/
│   └── components/          # Component tests
├── package.json             # Node dependencies
├── tsconfig.json            # TypeScript configuration
└── .env.local.example       # Example frontend environment variables
```

**Structure Decision**: Web application architecture (Option 2) selected due to clear frontend + backend separation. Backend handles API and data persistence using FastAPI and PostgreSQL. Frontend handles UI using Next.js with server-side rendering capabilities. This structure enables independent development and testing of backend and frontend, supports clear API contracts, and allows future scaling of each layer independently.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All complexity is justified by Phase II requirements and constitutional Phase II technology matrix.

---

## Phase 0: Outline & Research

**Purpose**: Resolve technical unknowns and establish best practices for Phase II technologies.

### Research Areas

#### R1: Better Auth Integration with FastAPI
**Question**: How to integrate Better Auth for user authentication in a FastAPI backend?

**Research Focus**:
- Better Auth authentication flow (signup, signin, session management)
- Better Auth Python SDK or REST API integration approach
- Session token/cookie handling between Better Auth and FastAPI
- User model integration (Better Auth users vs custom User model)

**Decision Criteria**:
- Must support email/password authentication
- Must provide session persistence
- Must integrate cleanly with FastAPI dependency injection
- Must support frontend session validation

#### R2: Neon PostgreSQL Connection and Configuration
**Question**: How to configure and connect to Neon Serverless PostgreSQL from FastAPI with SQLModel?

**Research Focus**:
- Neon connection string format and pooling requirements
- SQLModel engine configuration for Neon PostgreSQL
- Connection pooling best practices for serverless databases
- Environment variable management for database credentials

**Decision Criteria**:
- Must support serverless connection model (handles cold starts)
- Must use environment variables for credentials
- Must support connection pooling for performance
- Must work with Alembic for migrations

#### R3: Next.js App Router with Better Auth
**Question**: How to implement Better Auth session management in Next.js App Router (not Pages Router)?

**Research Focus**:
- Better Auth JavaScript/TypeScript SDK usage
- Next.js App Router authentication patterns (server components vs client components)
- Protected route implementation in App Router
- Session state management across client/server boundary

**Decision Criteria**:
- Must use Next.js 13+ App Router (not legacy Pages Router)
- Must protect routes from unauthenticated access
- Must persist session across page navigations
- Must handle token refresh if needed

#### R4: FastAPI and Next.js Communication (CORS and Session)
**Question**: How to configure CORS and session handling between FastAPI backend and Next.js frontend?

**Research Focus**:
- CORS middleware configuration in FastAPI
- Cookie-based vs token-based authentication pros/cons
- Secure cookie settings (httpOnly, secure, sameSite)
- Local development setup (localhost different ports)

**Decision Criteria**:
- Must allow Next.js frontend to call FastAPI backend
- Must maintain secure session across domains (development vs production)
- Must prevent CSRF attacks
- Must support local development (different ports) and production (same domain/proxy)

#### R5: SQLModel Migration Strategy with Alembic
**Question**: How to manage database schema migrations for SQLModel models using Alembic?

**Research Focus**:
- Alembic initialization with SQLModel
- Auto-generating migrations from SQLModel changes
- User and Todo table creation migrations
- Foreign key relationship migrations (user_id in todos)

**Decision Criteria**:
- Must auto-detect SQLModel schema changes
- Must generate reversible migrations
- Must handle foreign key constraints properly
- Must support team collaboration (migration versioning)

#### R6: Frontend State Management Approach
**Question**: What state management approach should be used for authentication state and todo list state in Next.js?

**Research Focus**:
- React Context API for auth state
- Server State management (React Query, SWR) vs client state
- Optimistic updates for todo operations
- State persistence strategies

**Decision Criteria**:
- Must be simple (no complex state management libraries unless needed)
- Must handle authentication state globally
- Must support optimistic UI updates for better UX
- Must integrate with Next.js App Router patterns

### Research Deliverable

Output file: `research.md` containing:
- Decision for each research area (R1-R6)
- Rationale for chosen approach
- Alternatives considered and why rejected
- Code examples or configuration snippets where helpful
- References to official documentation

---

## Phase 1: Design & Contracts

**Prerequisites**: research.md complete

### 1. Data Model Design

**Output**: `data-model.md`

#### User Entity

**Purpose**: Represents authenticated users of the application

**Fields**:
- `id` (UUID, primary key, auto-generated)
- `email` (string, unique, not null) - User's email address for authentication
- `password_hash` (string, not null) - Hashed password (Better Auth handles hashing)
- `created_at` (datetime, auto-generated) - Account creation timestamp
- `updated_at` (datetime, auto-updated) - Last account update timestamp

**Validation Rules**:
- Email must be valid email format
- Email must be unique across all users
- Password must meet minimum strength requirements (handled by Better Auth)

**Relationships**:
- One user has many todos (one-to-many)

**State Transitions**:
- Created → Active (upon successful signup)
- No deletion planned in Phase II (out of scope)

#### Todo Entity

**Purpose**: Represents a task item in a user's todo list

**Fields**:
- `id` (UUID, primary key, auto-generated)
- `user_id` (UUID, foreign key to User.id, not null) - Owner of this todo
- `title` (string, max 500 chars, not null) - Task description
- `is_completed` (boolean, default false) - Completion status
- `created_at` (datetime, auto-generated) - Todo creation timestamp
- `updated_at` (datetime, auto-updated) - Last todo update timestamp

**Validation Rules**:
- Title must not be empty (minimum 1 character)
- Title maximum 500 characters
- user_id must reference valid existing user
- Only the owning user can modify or delete

**Relationships**:
- Each todo belongs to one user (many-to-one)

**State Transitions**:
- Created (is_completed = false) → Completed (is_completed = true)
- Completed → Reopened (is_completed = false)
- Any state → Deleted (permanent removal)

**Database Indexes**:
- Primary index on `id`
- Index on `user_id` (for efficient user-specific queries)
- Composite index on `(user_id, created_at)` (for sorting user's todos)

### 2. API Contract Design

**Output**: `contracts/` directory with OpenAPI specifications

#### Authentication API Contract

**File**: `contracts/auth-api.yaml`

##### POST /api/auth/signup
**Purpose**: Create new user account
**Request Body**:
```json
{
  "email": "string (email format)",
  "password": "string (min 8 chars)"
}
```
**Success Response** (201 Created):
```json
{
  "user": {
    "id": "uuid",
    "email": "string"
  },
  "session": {
    "token": "string (if token-based)"
  }
}
```
**Error Responses**:
- 400: Invalid email format or weak password
- 409: Email already exists

##### POST /api/auth/signin
**Purpose**: Authenticate existing user
**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Success Response** (200 OK):
```json
{
  "user": {
    "id": "uuid",
    "email": "string"
  },
  "session": {
    "token": "string (if token-based)"
  }
}
```
**Error Responses**:
- 400: Missing email or password
- 401: Invalid credentials

##### POST /api/auth/signout
**Purpose**: End user session
**Request Headers**:
- Authorization: Bearer {token} OR Cookie with session
**Success Response** (200 OK):
```json
{
  "message": "Signed out successfully"
}
```
**Error Responses**:
- 401: Not authenticated

#### Todo API Contract

**File**: `contracts/todo-api.yaml`

##### GET /api/todos
**Purpose**: Retrieve all todos for authenticated user
**Request Headers**:
- Authorization: Bearer {token} OR Cookie with session
**Success Response** (200 OK):
```json
{
  "todos": [
    {
      "id": "uuid",
      "title": "string",
      "is_completed": boolean,
      "created_at": "ISO 8601 datetime",
      "updated_at": "ISO 8601 datetime"
    }
  ]
}
```
**Error Responses**:
- 401: Not authenticated

##### POST /api/todos
**Purpose**: Create new todo for authenticated user
**Request Headers**:
- Authorization: Bearer {token} OR Cookie with session
**Request Body**:
```json
{
  "title": "string (1-500 chars)"
}
```
**Success Response** (201 Created):
```json
{
  "todo": {
    "id": "uuid",
    "title": "string",
    "is_completed": false,
    "created_at": "ISO 8601 datetime",
    "updated_at": "ISO 8601 datetime"
  }
}
```
**Error Responses**:
- 400: Empty title or exceeds 500 chars
- 401: Not authenticated

##### PUT /api/todos/{id}
**Purpose**: Update existing todo (title and/or completion status)
**Request Headers**:
- Authorization: Bearer {token} OR Cookie with session
**Request Body** (both fields optional, at least one required):
```json
{
  "title": "string (1-500 chars, optional)",
  "is_completed": boolean (optional)
}
```
**Success Response** (200 OK):
```json
{
  "todo": {
    "id": "uuid",
    "title": "string",
    "is_completed": boolean,
    "created_at": "ISO 8601 datetime",
    "updated_at": "ISO 8601 datetime"
  }
}
```
**Error Responses**:
- 400: Invalid title (empty or > 500 chars)
- 401: Not authenticated
- 403: Todo belongs to different user
- 404: Todo not found

##### DELETE /api/todos/{id}
**Purpose**: Delete existing todo
**Request Headers**:
- Authorization: Bearer {token} OR Cookie with session
**Success Response** (204 No Content):
- Empty body
**Error Responses**:
- 401: Not authenticated
- 403: Todo belongs to different user
- 404: Todo not found

### 3. Frontend Component Architecture

**Output**: Documented in `data-model.md` under "Frontend Components"

#### Page Components

1. **Landing Page** (`app/page.tsx`)
   - **Responsibility**: Redirect unauthenticated users to /signin, authenticated to /todos
   - **State**: Check authentication status
   - **Actions**: Redirect based on auth state

2. **Signup Page** (`app/signup/page.tsx`)
   - **Responsibility**: User registration form
   - **State**: Form data (email, password), validation errors, loading state
   - **Actions**: Call POST /api/auth/signup, redirect to /todos on success
   - **Components Used**: AuthForm

3. **Signin Page** (`app/signin/page.tsx`)
   - **Responsibility**: User authentication form
   - **State**: Form data (email, password), validation errors, loading state
   - **Actions**: Call POST /api/auth/signin, redirect to /todos on success
   - **Components Used**: AuthForm

4. **Todo List Page** (`app/todos/page.tsx`)
   - **Responsibility**: Display and manage user's todos
   - **State**: Todos list, loading state, error state
   - **Actions**: Fetch todos, add todo, update todo, delete todo
   - **Components Used**: TodoList, TodoForm
   - **Auth Guard**: Redirect to /signin if not authenticated

#### Reusable Components

1. **AuthForm** (`components/AuthForm.tsx`)
   - **Props**: mode (signup/signin), onSubmit, loading, error
   - **Responsibility**: Render email/password form with validation
   - **State**: Local form state, client-side validation

2. **TodoList** (`components/TodoList.tsx`)
   - **Props**: todos, onUpdate, onDelete
   - **Responsibility**: Render list of todos with empty state
   - **Components Used**: TodoItem

3. **TodoItem** (`components/TodoItem.tsx`)
   - **Props**: todo, onUpdate, onDelete
   - **Responsibility**: Render individual todo with completion toggle and edit/delete actions
   - **State**: Edit mode (inline editing)

4. **TodoForm** (`components/TodoForm.tsx`)
   - **Props**: onSubmit, loading
   - **Responsibility**: Input field for adding new todo
   - **State**: New todo title, local validation

#### API Client Layer

**File**: `lib/api.ts`

**Responsibility**: Centralized API communication functions

**Functions**:
- `signup(email, password)` → POST /api/auth/signup
- `signin(email, password)` → POST /api/auth/signin
- `signout()` → POST /api/auth/signout
- `getTodos()` → GET /api/todos
- `createTodo(title)` → POST /api/todos
- `updateTodo(id, updates)` → PUT /api/todos/{id}
- `deleteTodo(id)` → DELETE /api/todos/{id}

**Error Handling**: Standardized error parsing and user-friendly messages

#### Authentication State Management

**File**: `lib/auth.ts`

**Responsibility**: Manage authentication state across application

**Approach** (determined in research.md):
- React Context for global auth state OR
- Better Auth SDK built-in state management

**Functions**:
- `useAuth()` hook - Get current user and auth status
- `requireAuth()` - Protect routes (redirect if not authenticated)
- Session persistence via cookies/local storage (as determined by Better Auth integration)

### 4. Quickstart Guide

**Output**: `quickstart.md`

**Contents**:
1. **Prerequisites**: Python 3.11+, Node.js 18+, Neon PostgreSQL account
2. **Backend Setup**:
   - Clone repository
   - Install Python dependencies (`pip install -r backend/requirements.txt`)
   - Configure environment variables (`.env` file with Neon connection string, Better Auth secrets)
   - Run database migrations (`alembic upgrade head`)
   - Start FastAPI server (`uvicorn src.main:app --reload`)
3. **Frontend Setup**:
   - Install Node dependencies (`npm install` in frontend/)
   - Configure environment variables (`.env.local` with API base URL)
   - Start Next.js dev server (`npm run dev`)
4. **Testing the Application**:
   - Navigate to http://localhost:3000
   - Create account, sign in, manage todos
5. **Running Tests**:
   - Backend: `pytest` in backend/
   - Frontend: `npm test` in frontend/
6. **Common Issues and Troubleshooting**:
   - Database connection errors
   - CORS issues (check backend CORS config)
   - Authentication failures (check Better Auth configuration)

---

## Phase 2: Tasks (NOT CREATED BY /sp.plan)

**Note**: Task breakdown will be created by `/sp.tasks` command after this plan is approved.

The tasks will be organized by user story priority (P1-P5) following the specification:
- **P1**: User Registration and Authentication
- **P2**: View My Todo List
- **P3**: Create New Todos
- **P4**: Update and Complete Todos
- **P5**: Delete Todos

Each phase will include:
- Setup tasks (project initialization, dependencies)
- Foundational tasks (database setup, auth infrastructure)
- User story implementation tasks (backend + frontend for each story)
- Testing tasks (unit, integration, contract tests)
- Polish tasks (error handling, responsive design, documentation)

---

## Architecture Decision Points

The following decisions require documentation in ADRs (will be suggested after plan approval):

1. **Better Auth Integration Pattern** (R1)
   - Decision: How Better Auth integrates with FastAPI (SDK, REST API, custom wrapper)
   - Impact: Affects authentication flow, session management, and user model design

2. **Frontend State Management Strategy** (R6)
   - Decision: React Context vs React Query/SWR vs Zustand for state
   - Impact: Affects component architecture, data fetching patterns, and optimization strategies

3. **API Authentication Mechanism** (R3, R4)
   - Decision: Cookie-based sessions vs JWT tokens
   - Impact: Affects security model, CORS configuration, and frontend-backend integration

4. **Database Migration Workflow** (R5)
   - Decision: Alembic auto-generation approach and team workflow
   - Impact: Affects development workflow, deployment process, and schema evolution

**Recommendation**: Create ADRs for decisions 1, 2, and 3 after research phase completes, as these are architecturally significant with long-term implications.

---

## Implementation Order

1. ✅ **Phase 0**: Complete research.md (resolve R1-R6)
2. ✅ **Phase 1**: Design artifacts (data-model.md, contracts/, quickstart.md)
3. 📋 **Phase 2**: Generate tasks.md via `/sp.tasks` command (user approval required)
4. 🔨 **Phase 3**: Execute tasks via `/sp.implement` command (after task approval)

**Current Status**: Plan complete, awaiting approval to proceed to research phase.
