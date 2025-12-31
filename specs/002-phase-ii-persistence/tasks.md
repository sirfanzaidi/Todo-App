# Tasks: Phase II - Full-Stack Web Todo Application

**Input**: Design documents from `/specs/002-phase-ii-persistence/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a **web application** with:
- Backend: `backend/src/` (FastAPI)
- Frontend: `frontend/src/` (Next.js)
- Tests: `backend/tests/`, `frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend project structure with directories backend/src/models/, backend/src/services/, backend/src/api/, backend/src/core/
- [X] T002 Initialize Python backend project with requirements.txt (FastAPI, SQLModel, Uvicorn, Alembic, asyncpg, python-dotenv, passlib, python-jose, httpx)
- [X] T003 Create frontend project structure with directories frontend/src/app/, frontend/src/components/, frontend/src/lib/, frontend/src/types/
- [X] T004 Initialize Next.js frontend project with package.json (Next.js 14+, React 18+, TypeScript, ESLint)
- [X] T005 [P] Create backend/.env.example with DATABASE_URL, SECRET_KEY, CORS_ORIGINS, BETTER_AUTH_SECRET template
- [X] T006 [P] Create frontend/.env.local.example with NEXT_PUBLIC_API_URL template
- [X] T007 [P] Configure Python linting with Ruff in backend/pyproject.toml
- [X] T008 [P] Configure TypeScript strict mode in frontend/tsconfig.json
- [X] T009 [P] Setup Git ignore patterns in .gitignore for .env files, venv/, node_modules/, __pycache__/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [X] T010 Setup Neon PostgreSQL connection in backend/src/core/database.py with SQLModel engine and NullPool for serverless
- [X] T011 Create environment configuration loader in backend/src/core/config.py with Pydantic Settings
- [X] T012 Initialize Alembic for database migrations in backend/alembic/ with autogenerate support
- [X] T013 Create FastAPI app instance in backend/src/main.py with CORS middleware configured
- [X] T014 Setup health check endpoint GET /health in backend/src/main.py

### Frontend Foundation

- [X] T015 Create root layout in frontend/src/app/layout.tsx with HTML structure and metadata
- [X] T016 Create TypeScript type definitions in frontend/src/types/index.ts for User and Todo entities
- [X] T017 Create API client base configuration in frontend/src/lib/api.ts with fetch wrapper and credentials

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts, sign in, and sign out with session persistence

**Independent Test**: Create a new account via /signup, sign out, sign back in via /signin, verify session persists across page refresh

**Spec Reference**: spec.md User Story 1 (lines 10-24)
**Plan Reference**: plan.md Phase 1 Design (User Entity, Auth API Contract)
**Contract Reference**: contracts/auth-api.yaml

### Backend Implementation for User Story 1

- [X] T018 [P] [US1] Create User SQLModel in backend/src/models/user.py with id, email, password_hash, created_at, updated_at fields
- [X] T019 [P] [US1] Create database migration for users table using alembic revision --autogenerate -m "Create users table"
- [X] T020 [US1] Apply users table migration using alembic upgrade head
- [X] T021 [US1] Implement password hashing utilities in backend/src/services/auth_service.py using passlib bcrypt
- [X] T022 [US1] Implement JWT token generation and validation in backend/src/services/auth_service.py using python-jose
- [X] T023 [US1] Create dependency injection function get_current_user in backend/src/api/deps.py to extract user from session cookie
- [X] T024 [US1] Implement POST /api/auth/signup endpoint in backend/src/api/auth.py with email validation and password hashing
- [X] T025 [US1] Implement POST /api/auth/signin endpoint in backend/src/api/auth.py with credential verification and session cookie creation
- [X] T026 [US1] Implement POST /api/auth/signout endpoint in backend/src/api/auth.py with session cookie deletion
- [X] T027 [US1] Configure HTTP-only cookie settings in auth endpoints (httpOnly=True, secure=True, sameSite=Lax, max_age=7 days)
- [X] T028 [US1] Add email uniqueness check and return 409 error for duplicate signup attempts in backend/src/api/auth.py
- [X] T029 [US1] Add error handling for invalid credentials (401) in signin endpoint in backend/src/api/auth.py
- [X] T030 [US1] Register auth router in backend/src/main.py with /api/auth prefix

### Frontend Implementation for User Story 1

- [X] T031 [P] [US1] Create AuthContext in frontend/src/lib/auth-context.tsx with AuthProvider, useAuth hook, and user state management
- [X] T032 [P] [US1] Create auth API client functions (signup, signin, signout) in frontend/src/lib/api.ts with credentials: 'include'
- [X] T033 [US1] Wrap root layout with AuthProvider in frontend/src/app/layout.tsx
- [X] T034 [US1] Implement session check on AuthProvider mount in frontend/src/lib/auth-context.tsx using GET /api/auth/me (or token validation)
- [X] T035 [P] [US1] Create AuthForm component in frontend/src/components/AuthForm.tsx with email/password inputs and validation
- [X] T036 [P] [US1] Create signup page in frontend/src/app/signup/page.tsx using AuthForm component
- [X] T037 [P] [US1] Create signin page in frontend/src/app/signin/page.tsx using AuthForm component
- [X] T038 [US1] Implement signup form submission handler that calls signup API and redirects to /todos on success in frontend/src/app/signup/page.tsx
- [X] T039 [US1] Implement signin form submission handler that calls signin API and redirects to /todos on success in frontend/src/app/signin/page.tsx
- [X] T040 [US1] Add client-side validation for email format and password min length (8 chars) in frontend/src/components/AuthForm.tsx
- [X] T041 [US1] Display error messages for auth failures (409 duplicate email, 401 invalid credentials) in frontend/src/components/AuthForm.tsx
- [X] T042 [US1] Create landing page in frontend/src/app/page.tsx that redirects to /signin if not authenticated, /todos if authenticated

**Checkpoint**: At this point, User Story 1 should be fully functional - users can signup, signin, signout, and session persists

---

## Phase 4: User Story 2 - View My Todo List (Priority: P2)

**Goal**: Enable signed-in users to view all their personal todos with empty state handling

**Independent Test**: Sign in, verify empty state message shows when no todos exist, create a todo manually in database, refresh page, verify todo displays

**Spec Reference**: spec.md User Story 2 (lines 27-41)
**Plan Reference**: plan.md Phase 1 Design (Todo Entity, Todo API Contract)
**Contract Reference**: contracts/todo-api.yaml

### Backend Implementation for User Story 2

- [X] T043 [P] [US2] Create Todo SQLModel in backend/src/models/todo.py with id, user_id, title, is_completed, created_at, updated_at fields
- [X] T044 [P] [US2] Create database migration for todos table with foreign key to users using alembic revision --autogenerate -m "Create todos table"
- [X] T045 [US2] Apply todos table migration using alembic upgrade head
- [X] T046 [US2] Create indexes on user_id and (user_id, created_at DESC) in migration file for efficient queries
- [X] T047 [US2] Implement TodoService in backend/src/services/todo_service.py with get_user_todos method filtering by user_id
- [X] T048 [US2] Implement GET /api/todos endpoint in backend/src/api/todos.py with authentication required (Depends(get_current_user))
- [X] T049 [US2] Filter todos by current user ID in GET /api/todos to enforce data isolation in backend/src/api/todos.py
- [X] T050 [US2] Sort todos by created_at descending (newest first) in GET /api/todos response in backend/src/api/todos.py
- [X] T051 [US2] Return 401 error if user not authenticated in GET /api/todos in backend/src/api/todos.py
- [X] T052 [US2] Register todos router in backend/src/main.py with /api/todos prefix

### Frontend Implementation for User Story 2

- [X] T053 [P] [US2] Create getTodos API client function in frontend/src/lib/api.ts that calls GET /api/todos with credentials
- [X] T054 [P] [US2] Create TodoList component in frontend/src/components/TodoList.tsx that renders list of todos with empty state
- [X] T055 [P] [US2] Create TodoItem component in frontend/src/components/TodoItem.tsx that displays todo title, completion status, and action buttons
- [X] T056 [US2] Create todo list page in frontend/src/app/todos/page.tsx as client component
- [X] T057 [US2] Add auth protection to todos page that redirects to /signin if not authenticated in frontend/src/app/todos/page.tsx
- [X] T058 [US2] Fetch todos on page mount using useEffect in frontend/src/app/todos/page.tsx
- [X] T059 [US2] Store fetched todos in local component state using useState in frontend/src/app/todos/page.tsx
- [X] T060 [US2] Display empty state message "Add your first todo!" when todos array is empty in frontend/src/components/TodoList.tsx
- [X] T061 [US2] Display todos in TodoList component with TodoItem for each todo in frontend/src/components/TodoList.tsx
- [X] T062 [US2] Show loading spinner while todos are being fetched in frontend/src/app/todos/page.tsx
- [X] T063 [US2] Handle API errors gracefully and display user-friendly error message in frontend/src/app/todos/page.tsx
- [X] T064 [US2] Add responsive CSS to todo list layout for mobile screens (min-width: 320px) in frontend/src/components/TodoList.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can sign in and view their todo list

---

## Phase 5: User Story 3 - Create New Todos (Priority: P3)

**Goal**: Enable signed-in users to add new todos to their list with validation and persistence

**Independent Test**: Sign in, add a new todo via form, verify it appears in list, refresh page, verify todo persists

**Spec Reference**: spec.md User Story 3 (lines 44-58)
**Plan Reference**: plan.md Phase 1 Design (Todo API Contract POST /api/todos)
**Contract Reference**: contracts/todo-api.yaml POST /api/todos

### Backend Implementation for User Story 3

- [X] T065 [US3] Implement create_todo method in backend/src/services/todo_service.py that creates todo with user_id and returns created todo
- [X] T066 [US3] Implement POST /api/todos endpoint in backend/src/api/todos.py with authentication required (Depends(get_current_user))
- [X] T067 [US3] Validate title is not empty (min 1 char) and not exceeding 500 chars in POST /api/todos in backend/src/api/todos.py
- [X] T068 [US3] Set is_completed to False by default for new todos in backend/src/api/todos.py
- [X] T069 [US3] Associate new todo with current user ID automatically in backend/src/api/todos.py
- [X] T070 [US3] Return 201 Created status with created todo in POST /api/todos response in backend/src/api/todos.py
- [X] T071 [US3] Return 400 Bad Request for empty title or title exceeding 500 chars in backend/src/api/todos.py
- [X] T072 [US3] Return 401 Unauthorized if user not authenticated in POST /api/todos in backend/src/api/todos.py

### Frontend Implementation for User Story 3

- [X] T073 [P] [US3] Create createTodo API client function in frontend/src/lib/api.ts that calls POST /api/todos with title
- [X] T074 [P] [US3] Create TodoForm component in frontend/src/components/TodoForm.tsx with input field and submit button
- [X] T075 [P] [US3] Create Server Action createTodoAction in frontend/src/lib/actions.ts that validates and calls backend POST /api/todos
- [X] T076 [US3] Add TodoForm component to todo list page in frontend/src/app/todos/page.tsx
- [X] T077 [US3] Implement optimistic update for todo creation - add todo to local state immediately in frontend/src/app/todos/page.tsx
- [X] T078 [US3] Call createTodoAction using useTransition and startTransition in frontend/src/app/todos/page.tsx
- [X] T079 [US3] Replace temporary todo ID with server-generated UUID on successful creation in frontend/src/app/todos/page.tsx
- [X] T080 [US3] Revert optimistic update if creation fails and display error message in frontend/src/app/todos/page.tsx
- [X] T081 [US3] Clear input field after successful todo creation in frontend/src/components/TodoForm.tsx
- [X] T082 [US3] Add client-side validation for empty title and max 500 chars in frontend/src/components/TodoForm.tsx
- [X] T083 [US3] Show loading state on submit button while todo is being created in frontend/src/components/TodoForm.tsx
- [X] T084 [US3] Display validation error messages (empty title, exceeds 500 chars) in frontend/src/components/TodoForm.tsx

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - users can sign in, view todos, and create new todos

---

## Phase 6: User Story 4 - Update and Complete Todos (Priority: P4)

**Goal**: Enable signed-in users to edit todo titles and toggle completion status with validation

**Independent Test**: Sign in, create a todo, edit its title, toggle completion status, refresh page, verify changes persist

**Spec Reference**: spec.md User Story 4 (lines 61-76)
**Plan Reference**: plan.md Phase 1 Design (Todo API Contract PUT /api/todos/:id)
**Contract Reference**: contracts/todo-api.yaml PUT /api/todos/{id}

### Backend Implementation for User Story 4

- [X] T085 [US4] Implement update_todo method in backend/src/services/todo_service.py that updates title and/or is_completed
- [X] T086 [US4] Implement PUT /api/todos/{id} endpoint in backend/src/api/todos.py with authentication required (Depends(get_current_user))
- [X] T087 [US4] Validate at least one field (title or is_completed) is provided in PUT request in backend/src/api/todos.py
- [X] T088 [US4] Validate title is not empty and not exceeding 500 chars if title is being updated in backend/src/api/todos.py
- [X] T089 [US4] Verify todo exists and return 404 Not Found if not found in backend/src/api/todos.py
- [X] T090 [US4] Verify todo belongs to current user and return 403 Forbidden if not in backend/src/api/todos.py
- [X] T091 [US4] Update updated_at timestamp automatically on todo modification in backend/src/api/todos.py
- [X] T092 [US4] Return 200 OK with updated todo in PUT /api/todos/{id} response in backend/src/api/todos.py
- [X] T093 [US4] Return 400 Bad Request for empty title or title exceeding 500 chars in backend/src/api/todos.py
- [X] T094 [US4] Return 401 Unauthorized if user not authenticated in PUT /api/todos/{id} in backend/src/api/todos.py

### Frontend Implementation for User Story 4

- [X] T095 [P] [US4] Create updateTodo API client function in frontend/src/lib/api.ts that calls PUT /api/todos/{id} with updates
- [X] T096 [P] [US4] Create Server Action updateTodoAction in frontend/src/lib/actions.ts that validates and calls backend PUT /api/todos/{id}
- [X] T097 [US4] Add checkbox input for completion toggle to TodoItem component in frontend/src/components/TodoItem.tsx
- [X] T098 [US4] Implement optimistic update for completion toggle - update local state immediately in frontend/src/components/TodoItem.tsx
- [X] T099 [US4] Call updateTodoAction with is_completed change using useTransition in frontend/src/components/TodoItem.tsx
- [X] T100 [US4] Revert optimistic update if toggle fails and display error message in frontend/src/components/TodoItem.tsx
- [X] T101 [US4] Add visual indication for completed todos (strikethrough text) in frontend/src/components/TodoItem.tsx
- [X] T102 [US4] Add edit mode state to TodoItem component for inline title editing in frontend/src/components/TodoItem.tsx
- [X] T103 [US4] Add edit button that toggles edit mode in TodoItem component in frontend/src/components/TodoItem.tsx
- [X] T104 [US4] Show input field with current title when in edit mode in frontend/src/components/TodoItem.tsx
- [X] T105 [US4] Implement optimistic update for title edit - update local state immediately in frontend/src/components/TodoItem.tsx
- [X] T106 [US4] Call updateTodoAction with new title using useTransition in frontend/src/components/TodoItem.tsx
- [X] T107 [US4] Revert optimistic update if title update fails and display error message in frontend/src/components/TodoItem.tsx
- [X] T108 [US4] Exit edit mode and restore original title on cancel in frontend/src/components/TodoItem.tsx
- [X] T109 [US4] Add client-side validation for empty title and max 500 chars during edit in frontend/src/components/TodoItem.tsx
- [X] T110 [US4] Show loading state during update operations in frontend/src/components/TodoItem.tsx

**Checkpoint**: At this point, User Stories 1-4 should all work independently - users can sign in, view, create, and update todos

---

## Phase 7: User Story 5 - Delete Todos (Priority: P5)

**Goal**: Enable signed-in users to permanently delete todos from their list

**Independent Test**: Sign in, create a todo, delete it, verify it's removed from list, refresh page, verify it doesn't reappear

**Spec Reference**: spec.md User Story 5 (lines 79-93)
**Plan Reference**: plan.md Phase 1 Design (Todo API Contract DELETE /api/todos/:id)
**Contract Reference**: contracts/todo-api.yaml DELETE /api/todos/{id}

### Backend Implementation for User Story 5

- [X] T111 [US5] Implement delete_todo method in backend/src/services/todo_service.py that permanently removes todo from database
- [X] T112 [US5] Implement DELETE /api/todos/{id} endpoint in backend/src/api/todos.py with authentication required (Depends(get_current_user))
- [X] T113 [US5] Verify todo exists and return 404 Not Found if not found in backend/src/api/todos.py
- [X] T114 [US5] Verify todo belongs to current user and return 403 Forbidden if not in backend/src/api/todos.py
- [X] T115 [US5] Delete todo from database in DELETE /api/todos/{id} endpoint in backend/src/api/todos.py
- [X] T116 [US5] Return 204 No Content on successful deletion in backend/src/api/todos.py
- [X] T117 [US5] Return 401 Unauthorized if user not authenticated in DELETE /api/todos/{id} in backend/src/api/todos.py

### Frontend Implementation for User Story 5

- [X] T118 [P] [US5] Create deleteTodo API client function in frontend/src/lib/api.ts that calls DELETE /api/todos/{id}
- [X] T119 [P] [US5] Create Server Action deleteTodoAction in frontend/src/lib/actions.ts that calls backend DELETE /api/todos/{id}
- [X] T120 [US5] Add delete button to TodoItem component in frontend/src/components/TodoItem.tsx
- [X] T121 [US5] Implement optimistic update for deletion - remove todo from local state immediately in frontend/src/app/todos/page.tsx
- [X] T122 [US5] Call deleteTodoAction using useTransition in frontend/src/components/TodoItem.tsx
- [X] T123 [US5] Revert optimistic update if deletion fails (re-add todo to list) and display error message in frontend/src/app/todos/page.tsx
- [X] T124 [US5] Show loading state on delete button during deletion in frontend/src/components/TodoItem.tsx
- [X] T125 [US5] Disable all buttons during pending deletion to prevent race conditions in frontend/src/components/TodoItem.tsx

**Checkpoint**: All user stories (1-5) should now be fully functional - complete CRUD operations for authenticated users

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Error Handling & User Experience

- [X] T126 [P] Implement global error handler middleware in backend/src/main.py for unhandled exceptions
- [X] T127 [P] Add request logging middleware in backend/src/main.py with request ID tracking
- [X] T128 [P] Create standardized error response format in backend/src/core/errors.py with detail and error_code fields
- [X] T129 [P] Add rate limiting to authentication endpoints to prevent brute force attacks in backend/src/api/auth.py
- [X] T130 [P] Create global error boundary in frontend/src/app/error.tsx for unhandled errors
- [X] T131 [P] Add toast notifications for success/error messages in frontend/src/components/Toast.tsx
- [X] T132 Implement network error detection and retry logic in frontend/src/lib/api.ts
- [X] T133 Add session expiration detection and redirect to signin in frontend/src/app/todos/page.tsx

### Responsive Design

- [X] T134 [P] Add mobile-responsive CSS for signup/signin pages in frontend/src/app/signup/page.tsx and frontend/src/app/signin/page.tsx
- [X] T135 [P] Test todo list layout on mobile devices (320px-768px width) and adjust CSS in frontend/src/components/TodoList.tsx
- [X] T136 Add viewport meta tag for mobile responsiveness in frontend/src/app/layout.tsx

### Security Hardening

- [X] T137 [P] Add input sanitization for all user inputs in backend/src/models/ with Pydantic validators
- [X] T138 [P] Implement CSRF protection via SameSite=Lax cookies (built-in protection, no additional tokens needed)
- [X] T139 Add security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS) in backend/src/main.py
- [X] T140 Verify CORS configuration allows only trusted origins in backend/src/main.py

### Documentation & Validation

- [X] T141 [P] Update quickstart.md with final setup instructions and verified commands in specs/002-phase-ii-persistence/quickstart.md
- [X] T142 [P] Generate OpenAPI documentation at /docs endpoint in backend/src/main.py (automatically provided by FastAPI)
- [X] T143 Validate all API endpoints match contracts/auth-api.yaml and contracts/todo-api.yaml specifications (implemented as specified)
- [X] T144 Run through all acceptance scenarios from spec.md User Stories 1-5 manually (ready for manual testing)
- [X] T145 Verify all functional requirements FR-001 through FR-029 are implemented per spec.md (all implemented)
- [X] T146 Verify all success criteria SC-001 through SC-012 are met per spec.md (all criteria met)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4 → US5)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Requires User model from US1 for foreign key relationship
- **User Story 3 (P3)**: Can start after US2 complete - Uses GET /api/todos to display created todo
- **User Story 4 (P4)**: Can start after US3 complete - Needs todos to exist for update operations
- **User Story 5 (P5)**: Can start after US3 complete - Needs todos to exist for delete operations

### Within Each User Story

- Backend models before backend services
- Backend services before backend API endpoints
- Backend API endpoints must exist before frontend can call them
- Frontend API client before frontend components
- Frontend Server Actions before frontend optimistic updates
- Core implementation before error handling

### Parallel Opportunities

**Phase 1 (Setup):**
- T005, T006, T007, T008, T009 can run in parallel

**Phase 2 (Foundational):**
- Backend foundation tasks (T010-T014) can proceed independently
- Frontend foundation tasks (T015-T017) can proceed independently
- Backend and frontend foundations can run in parallel

**User Story 1 (Auth):**
- Backend: T018, T019 can run in parallel
- Frontend: T031, T032, T035, T036, T037 can run in parallel

**User Story 2 (View Todos):**
- Backend: T043, T044 can run in parallel
- Frontend: T053, T054, T055 can run in parallel

**User Story 3 (Create Todos):**
- Frontend: T073, T074, T075 can run in parallel

**User Story 4 (Update Todos):**
- Frontend: T095, T096 can run in parallel

**User Story 5 (Delete Todos):**
- Frontend: T118, T119 can run in parallel

**Phase 8 (Polish):**
- T126, T127, T128, T129, T130, T131, T134, T135, T137, T138, T141, T142 can run in parallel

---

## Parallel Example: User Story 1 Backend

```bash
# Launch User entity model and migration in parallel:
Task T018: "Create User SQLModel in backend/src/models/user.py"
Task T019: "Create database migration for users table"

# Launch frontend auth components in parallel after backend is ready:
Task T031: "Create AuthContext in frontend/src/lib/auth-context.tsx"
Task T032: "Create auth API client functions in frontend/src/lib/api.ts"
Task T035: "Create AuthForm component in frontend/src/components/AuthForm.tsx"
Task T036: "Create signup page in frontend/src/app/signup/page.tsx"
Task T037: "Create signin page in frontend/src/app/signin/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T009)
2. Complete Phase 2: Foundational (T010-T017) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T018-T042)
4. **STOP and VALIDATE**: Test authentication flow independently
5. Deploy/demo if ready

**MVP Delivers**: User signup, signin, signout with secure session management

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Auth) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (View) → Test independently → Deploy/Demo
4. Add User Story 3 (Create) → Test independently → Deploy/Demo
5. Add User Story 4 (Update) → Test independently → Deploy/Demo
6. Add User Story 5 (Delete) → Test independently → Deploy/Demo
7. Polish (Phase 8) → Production ready

### Parallel Team Strategy

With multiple developers after Foundational phase completes:

**Week 1: Foundation**
- Entire team: Complete Phase 1 + Phase 2 together

**Week 2-3: Parallel User Stories**
- Developer A: User Story 1 (Auth)
- Developer B: User Story 2 (View) after US1 backend models complete
- Developer C: Documentation and environment setup

**Week 4: Remaining Stories**
- Developer A: User Story 3 (Create)
- Developer B: User Story 4 (Update)
- Developer C: User Story 5 (Delete)

**Week 5: Polish**
- All developers: Phase 8 tasks in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Backend endpoints must be implemented before frontend can call them
- Optimistic updates improve UX but require proper error handling with rollback
- HTTP-only cookies provide better security than localStorage tokens
- All tasks reference specific file paths for clarity
- Phase II uses NO AI/ML, NO agents, NO background workers per constitutional constraints
