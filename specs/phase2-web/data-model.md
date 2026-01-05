# Data Model: Phase II - Full-Stack Web Todo Application

**Feature**: Phase II - Persistent web todo application with authentication
**Created**: 2025-12-31
**Status**: Design

## Overview

This document defines the data models for Phase II of the Evolution of Todo project. The system uses two primary entities: User (for authentication) and Todo (for task management). The models follow SQLModel conventions for FastAPI + PostgreSQL integration, with clear ownership relationships ensuring data isolation between users.

## Database Technology

- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLModel (combines SQLAlchemy and Pydantic)
- **Migration Tool**: Alembic
- **Connection**: Managed via SQLModel engine with connection pooling

## Entity Definitions

### User Entity

**Purpose**: Represents authenticated users who can create and manage their own todo lists.

**Table Name**: `users`

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL | Unique identifier, auto-generated |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User's email address for authentication |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password (Better Auth handles hashing) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last account update timestamp (auto-updated on modification) |

**Validation Rules**:
- Email must be valid email format (validated at application layer)
- Email must be unique across all users (enforced by database UNIQUE constraint)
- Password must meet minimum strength requirements (8+ characters, enforced by Better Auth before hashing)
- `password_hash` never exposed in API responses

**Indexes**:
- Primary index on `id` (automatic)
- Unique index on `email` (for fast lookup during signin)

**Relationships**:
- One-to-many with Todo entity (one user owns zero or more todos)

**State Transitions**:
```
[New User] --signup--> [Active User]
```

**SQLModel Representation** (conceptual):
```python
class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    todos: list["Todo"] = Relationship(back_populates="owner")
```

**Security Considerations**:
- Password is hashed before storage (Better Auth responsibility)
- `password_hash` field excluded from API responses (Pydantic model configuration)
- Email uniqueness prevents duplicate accounts
- No soft delete in Phase II (hard constraint: accounts cannot be deleted)

---

### Todo Entity

**Purpose**: Represents a task item in a user's todo list. Each todo is owned by exactly one user and can only be accessed/modified by that user.

**Table Name**: `todos`

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL | Unique identifier, auto-generated |
| `user_id` | UUID | FOREIGN KEY (users.id), NOT NULL | Owner of this todo |
| `title` | VARCHAR(500) | NOT NULL | Task description (1-500 characters) |
| `is_completed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Todo creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last todo update timestamp (auto-updated on modification) |

**Validation Rules**:
- `title` must not be empty (minimum 1 character, enforced at application layer)
- `title` maximum 500 characters (enforced by database VARCHAR constraint)
- `user_id` must reference valid existing user (enforced by foreign key constraint)
- Only the owning user can read, update, or delete this todo (enforced at application layer)

**Indexes**:
- Primary index on `id` (automatic)
- Index on `user_id` (for efficient "get all todos for user" queries)
- Composite index on `(user_id, created_at DESC)` (for sorting user's todos by creation date)

**Relationships**:
- Many-to-one with User entity (each todo belongs to one user)

**State Transitions**:
```
[New Todo] --create--> [Incomplete] --mark complete--> [Completed]
                           ^                              |
                           |--------mark incomplete--------|

[Any State] --delete--> [Deleted] (permanent removal)
```

**SQLModel Representation** (conceptual):
```python
class Todo(SQLModel, table=True):
    __tablename__ = "todos"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    title: str = Field(min_length=1, max_length=500)
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    owner: User = Relationship(back_populates="todos")
```

**Business Rules**:
- A user can have unlimited todos (no hard limit in Phase II)
- Deleting a user would cascade delete their todos (but user deletion not implemented in Phase II)
- Todos are sorted by `created_at` descending by default (newest first)
- Empty state is valid (user with zero todos)

---

## Relationship Diagram

```
┌─────────────────────────┐
│         User            │
│─────────────────────────│
│ id (PK)                 │
│ email (UNIQUE)          │
│ password_hash           │
│ created_at              │
│ updated_at              │
└───────────┬─────────────┘
            │
            │ owns
            │ (1:many)
            │
            ▼
┌─────────────────────────┐
│         Todo            │
│─────────────────────────│
│ id (PK)                 │
│ user_id (FK) ───────────┼──> User.id
│ title                   │
│ is_completed            │
│ created_at              │
│ updated_at              │
└─────────────────────────┘
```

**Relationship Characteristics**:
- **Cardinality**: One User → Many Todos (1:N)
- **Ownership**: Todos cannot exist without a user
- **Cascade**: Deletes would cascade (not implemented in Phase II)
- **Referential Integrity**: Enforced by database foreign key constraint

---

## Database Schema Migration Strategy

**Tool**: Alembic

**Migration Workflow**:
1. Developer modifies SQLModel classes
2. Run `alembic revision --autogenerate -m "description"`
3. Review generated migration file
4. Test migration: `alembic upgrade head` (local)
5. Commit migration file to version control
6. Deploy: `alembic upgrade head` (production)

**Initial Migrations**:
1. **Migration 001**: Create `users` table
2. **Migration 002**: Create `todos` table with foreign key to `users`
3. **Migration 003**: Add indexes on `user_id` and `(user_id, created_at)`

**Migration Safety**:
- All migrations are reversible via `alembic downgrade`
- Foreign key constraints prevent orphaned todos
- Unique constraints prevent duplicate emails

---

## Frontend Component Data Flow

### Authentication Flow

```
┌─────────────────┐
│  Signup Page    │
│  (app/signup)   │
└────────┬────────┘
         │
         │ POST /api/auth/signup
         │ { email, password }
         ▼
┌─────────────────┐      ┌──────────────┐
│  Backend API    │──────>│  Users Table │
│  (auth.py)      │      │ (create row) │
└────────┬────────┘      └──────────────┘
         │
         │ 201 Created
         │ { user, session }
         ▼
┌─────────────────┐
│  Todo List Page │
│  (app/todos)    │
└─────────────────┘
```

### Todo Management Flow

```
┌─────────────────┐
│  Todo List Page │
│  (app/todos)    │
└────────┬────────┘
         │
         │ GET /api/todos
         │ (authenticated)
         ▼
┌─────────────────┐      ┌──────────────┐
│  Backend API    │<─────│  Todos Table │
│  (todos.py)     │      │ (filter by   │
└────────┬────────┘      │  user_id)    │
         │               └──────────────┘
         │ 200 OK
         │ { todos: [...] }
         ▼
┌─────────────────┐
│  TodoList       │
│  Component      │
└─────────────────┘
```

### Data Ownership Enforcement

**Backend Enforcement** (critical security layer):
- All API endpoints extract `current_user` from session
- Todo queries filtered by `user_id = current_user.id`
- Update/delete operations verify `todo.user_id == current_user.id`
- Unauthorized access returns 403 Forbidden

**Example Authorization Check**:
```python
# GET /api/todos
def get_todos(current_user: User = Depends(get_current_user)):
    return db.query(Todo).filter(Todo.user_id == current_user.id).all()

# DELETE /api/todos/{id}
def delete_todo(id: UUID, current_user: User = Depends(get_current_user)):
    todo = db.query(Todo).filter(Todo.id == id).first()
    if not todo:
        raise HTTPException(404, "Todo not found")
    if todo.user_id != current_user.id:
        raise HTTPException(403, "Not authorized to delete this todo")
    db.delete(todo)
    db.commit()
```

---

## Frontend Components (Data Perspective)

### Component Data Requirements

**1. AuthForm Component**
- **Input Data**: None (user input captured via form)
- **Output Data**: `{ email: string, password: string }`
- **State**: Form fields, validation errors, loading state
- **Data Flow**: User input → Form validation → API call (signup/signin)

**2. TodoList Component**
- **Input Data**: `todos: Todo[]` (from parent or API)
- **Output Events**: `onUpdate(id, updates)`, `onDelete(id)`
- **State**: None (stateless presentation component)
- **Data Flow**: Props → Render → User interaction → Event callbacks

**3. TodoItem Component**
- **Input Data**: `todo: Todo` (single todo object)
- **Output Events**: `onUpdate(id, updates)`, `onDelete(id)`
- **State**: `isEditing: boolean` (for inline edit mode)
- **Data Flow**: Props → Render → Edit mode toggle → Update callback

**4. TodoForm Component**
- **Input Data**: None
- **Output Events**: `onSubmit(title: string)`
- **State**: `title: string`, `isSubmitting: boolean`
- **Data Flow**: User input → Validation → Submit event → Clear form

### State Management Architecture

**Authentication State** (global):
- **Location**: `lib/auth.ts` (React Context or Better Auth SDK)
- **Data**: `{ user: User | null, isAuthenticated: boolean, isLoading: boolean }`
- **Actions**: `signin()`, `signup()`, `signout()`, `checkAuth()`
- **Persistence**: Cookies or localStorage (via Better Auth)

**Todo List State** (page-level):
- **Location**: `app/todos/page.tsx`
- **Data**: `{ todos: Todo[], isLoading: boolean, error: string | null }`
- **Actions**: `fetchTodos()`, `createTodo(title)`, `updateTodo(id, updates)`, `deleteTodo(id)`
- **Optimistic Updates**: UI updates immediately, rollback on error

**State Flow Example**:
```typescript
// Page component fetches and manages todos
const TodosPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleCreate = async (title: string) => {
    const newTodo = { id: tempId(), title, is_completed: false }; // Optimistic
    setTodos([newTodo, ...todos]);

    try {
      const created = await api.createTodo(title);
      setTodos(todos.map(t => t.id === tempId() ? created : t)); // Replace temp
    } catch (error) {
      setTodos(todos.filter(t => t.id !== tempId())); // Rollback
    }
  };

  return <TodoList todos={todos} onCreate={handleCreate} />;
};
```

---

## Data Validation Summary

### Backend Validation (FastAPI + SQLModel)

**User Model**:
- Email format validation (Pydantic email validator)
- Email uniqueness (database constraint + application check)
- Password strength (Better Auth validation before hashing)

**Todo Model**:
- Title not empty (Pydantic `min_length=1`)
- Title max length (Pydantic `max_length=500`, database VARCHAR(500))
- user_id foreign key (database constraint)
- Ownership verification (application logic before update/delete)

### Frontend Validation (TypeScript + React)

**Auth Forms**:
- Email format (HTML5 email input + client-side regex)
- Password minimum length (HTML5 minlength + client-side check)
- Match validation errors from backend (display user-friendly messages)

**Todo Forms**:
- Title not empty (HTML5 required + client-side check)
- Title max length (HTML5 maxlength=500 + character counter)
- Debounced input for better UX

---

## Performance Considerations

**Database Queries**:
- Index on `user_id` ensures fast filtering: `WHERE user_id = ?`
- Composite index `(user_id, created_at)` enables fast sorted retrieval
- No N+1 queries (todos fetched in single query per user)

**API Response Times**:
- Target: GET /api/todos < 100ms for typical user (< 1000 todos)
- Target: POST/PUT/DELETE < 200ms

**Frontend Rendering**:
- Virtual scrolling if user has > 1000 todos (Phase III consideration)
- Optimistic updates reduce perceived latency
- Debounced search/filter (if implemented later)

---

## Data Integrity and Security

**Integrity Constraints**:
- Foreign keys prevent orphaned todos
- Unique email prevents duplicate users
- NOT NULL constraints prevent invalid data
- Transaction boundaries ensure consistency (create user + initial session atomically)

**Security Measures**:
- Passwords hashed via Better Auth (bcrypt or argon2)
- SQL injection prevented by SQLModel parameterized queries
- Authentication required for all todo endpoints
- Authorization enforced at service layer (user can only access own todos)
- HTTPS in production (prevents credential interception)
- Secure cookie settings (httpOnly, secure, sameSite)

---

## Future Considerations (Out of Scope for Phase II)

- User profile fields (name, avatar, preferences)
- Todo categories/tags (many-to-many relationship)
- Shared todos (collaboration, permissions)
- Soft delete (is_deleted flag instead of hard delete)
- Audit log (track all changes to todos)
- Todo priorities or due dates
- Full-text search on todo titles
- Pagination for large todo lists

**Note**: These features require schema changes and would be addressed in future phases with corresponding migrations.
