---
id: 002
title: Create Phase II Technical Plan
stage: plan
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: phase-ii-persistence
branch: 002-phase-ii-persistence
user: architect
command: /sp.plan
labels: ["plan", "architecture", "phase-ii", "full-stack", "design"]
links:
  spec: specs/002-phase-ii-persistence/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-phase-ii-persistence/plan.md
  - specs/002-phase-ii-persistence/research.md
  - specs/002-phase-ii-persistence/data-model.md
  - specs/002-phase-ii-persistence/contracts/auth-api.yaml
  - specs/002-phase-ii-persistence/contracts/todo-api.yaml
  - specs/002-phase-ii-persistence/quickstart.md
tests:
  - null
---

## Prompt

Create the Phase II technical plan for the "Evolution of Todo" project.

The plan must be strictly derived from the Phase II specification and constitution.

BACKEND PLAN:
1. Backend framework responsibility (REST API)
2. API routing and controller structure
3. Authentication integration using Better Auth
4. Data persistence using Neon PostgreSQL
5. User-to-do data ownership handling
6. Error handling and validation approach

FRONTEND PLAN:
1. Next.js application structure
2. Page-level routing (auth pages + todo pages)
3. Component responsibilities
4. API communication strategy
5. Authentication state handling
6. Responsive UI strategy

DATABASE PLAN:
1. User data model
2. Todo data model
3. Relationship between user and todo
4. Migration or schema management approach

INTEGRATION PLAN:
1. Frontend ↔ Backend communication flow
2. Auth token/session flow
3. Local development setup

CONSTRAINTS:
- No AI
- No agents
- No background workers
- No future phase infrastructure
- No implementation code

The plan must explain HOW Phase II will be built without introducing new features.

## Response snapshot

Created comprehensive Phase II technical plan with complete Phase 0 research and Phase 1 design artifacts.

**Plan Structure** (plan.md):
- **Summary**: FastAPI backend + Neon PostgreSQL + SQLModel ORM + Next.js frontend + Better Auth
- **Technical Context**: All technologies specified (Python 3.11+, TypeScript, performance goals, constraints)
- **Constitution Check**: ✅ ALL FIVE PRINCIPLES PASSED
  - Spec-Driven Development: Following SDD workflow
  - Agent Boundaries: Plan awaits approval before tasks
  - Phase Governance: No Phase III+ features included
  - Technology Stack: All technologies from Phase II matrix
  - Quality Standards: Clean architecture, stateless services, security
- **Project Structure**: Web app architecture (backend/, frontend/) with detailed directory trees
- **Phase 0 Research**: 6 research areas defined (R1-R6)
- **Phase 1 Design**: Data models, API contracts, frontend components, quickstart guide

**Research Completed** (research.md):
- R1: Better Auth integration with FastAPI → External service approach via REST API
- R2: Neon PostgreSQL configuration → Pooling endpoint with NullPool for serverless
- R3: Next.js App Router auth → Server+Client component hybrid pattern
- R4: CORS & session handling → Cookie-based auth with SameSite=Lax
- R5: Alembic migrations → Auto-generate from SQLModel changes
- R6: State management → React Context for auth + useState for todos (no React Query needed)

**Data Model Created** (data-model.md):
- **User Entity**: id (UUID), email (unique), password_hash, timestamps
- **Todo Entity**: id (UUID), user_id (FK), title (500 max), is_completed (boolean), timestamps
- **Relationship**: One-to-many (User → Todos) with foreign key constraint
- **Indexes**: user_id, (user_id, created_at DESC) for efficient queries
- **Frontend components**: AuthForm, TodoList, TodoItem, TodoForm with data flow diagrams

**API Contracts Created** (contracts/):
- **auth-api.yaml**: POST /signup, /signin, /signout with OpenAPI 3.0.3 specs
- **todo-api.yaml**: GET /todos, POST /todos, PUT /todos/:id, DELETE /todos/:id
- Complete request/response schemas with error codes (400, 401, 403, 404)

**Quickstart Guide Created** (quickstart.md):
- Prerequisites (Python 3.11+, Node.js 18+, Neon account)
- Backend setup (venv, dependencies, migrations, server start)
- Frontend setup (npm install, env vars, dev server)
- Testing procedures (unit tests, manual E2E test)
- Troubleshooting guide (CORS, database connection, auth failures)
- Environment variables reference tables

**Architecture Decisions Identified** (for ADRs):
1. Better Auth integration pattern (external service)
2. Frontend state management (Context API + useState)
3. API authentication mechanism (HTTP-only cookies)
4. Database migration workflow (Alembic auto-generation)

## Outcome

- ✅ Impact: Complete technical plan created for Phase II full-stack implementation
- 🧪 Tests: N/A (planning phase)
- 📁 Files: 6 files created (plan.md, research.md, data-model.md, 2 contract YAML files, quickstart.md)
- 🔁 Next prompts: Run `/sp.tasks` to generate implementation task breakdown
- 🧠 Reflection: Plan successfully integrates Phase II technology matrix from constitution while maintaining clean architecture principles and separation of concerns

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution Check - ALL PASS (5/5 principles)
- Prompt variant (if applicable): Standard /sp.plan with Phase II requirements
- Next experiment: Validate that task generation honors constitutional Phase II technology constraints and SDD workflow
