# Phase II Research: Frontend State Management Strategy

**Date**: 2025-12-31
**Status**: Completed Research
**Research Area**: R6 - Frontend State Management Approach
**Specification**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Executive Summary

For Phase II, **React Context API combined with client-side state hooks is the recommended approach** for managing authentication and todo list state in Next.js App Router. This strategy:

- Keeps authentication state global and simple via Context Provider
- Uses local component state with Server Actions for todo operations
- Leverages React's `useActionState` and `startTransition` for optimistic updates
- Integrates seamlessly with Next.js App Router patterns
- Avoids unnecessary library dependencies while supporting excellent UX

**Alternative approaches (React Query, SWR, Zustand) are discussed but not required for Phase II scope.**

---

## Decision Framework

### Decision Criteria (from plan.md R6)

✅ **Must be simple** - No complex state management libraries unless needed
✅ **Must handle authentication state globally** - Single source of truth across app
✅ **Must support optimistic UI updates** - Better user experience for todo operations
✅ **Must integrate with Next.js App Router patterns** - Not legacy Pages Router

---

## Research Findings

### R6.1: React Context API for Authentication State

#### Overview

React Context API is the built-in React mechanism for passing data through the component tree without manual prop drilling. Combined with `useReducer` for complex state, it provides a lightweight solution for global authentication state.

#### Key Findings

**Advantages:**
- ✅ **Built-in**: No additional dependencies required
- ✅ **Simple for auth**: Perfect use case - auth state rarely changes, only on login/logout
- ✅ **App Router compatible**: Works seamlessly with server components and client components
- ✅ **Memoization support**: `useMemo` and `useCallback` prevent unnecessary re-renders

**Disadvantages:**
- ❌ **Context rerenders**: All consumers rerender when context changes (mitigated via memoization)
- ❌ **Verbose for complex state**: useReducer adds boilerplate for complex scenarios
- ❌ **No built-in caching**: Each context read is synchronous (acceptable for auth)

#### Implementation Pattern

```typescript
// lib/auth-context.tsx
'use client'

import { createContext, useContext, useCallback, useMemo } from 'react'

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check session on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (response.ok) {
      const data = await response.json()
      setUser(data.user)
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

#### Performance Optimization

When using Context for auth state, prevent unnecessary rerenders:

```typescript
// ✅ GOOD: Split auth state from user data
const AuthContext = createContext<{ user: User | null }>()
const AuthDispatchContext = createContext<AuthDispatch>()

// ✅ GOOD: Memoize context value
const value = useMemo(() => ({ user }), [user])

// ✅ GOOD: Use useCallback for functions
const login = useCallback(async (...) => { ... }, [])
```

---

### R6.2: Client State vs Server State Management

#### Overview

Next.js App Router introduces a critical distinction:
- **Server State**: Data from backend (todos from database)
- **Client State**: UI-only state (which todo is being edited, loading flags)

#### Key Findings

**Best Practice Pattern for Phase II:**

| State Type | Data | Tool | Pattern |
|-----------|------|------|---------|
| **Server State** | Todos from API | Server Actions + local state | Fetch in component, store in local state |
| **Client State** | UI state (editing, loading) | useState + useActionState | Component-level state |
| **Auth State** | Current user | Context API | Global Context Provider |

#### Todos List State Example

**NOT recommended** (over-engineered for Phase II):
```typescript
// ❌ Too complex - uses React Query
import { useQuery } from '@tanstack/react-query'

const { data: todos } = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/api/todos').then(r => r.json())
})
```

**Recommended** (simple and effective):
```typescript
// ✅ Simple - matches Next.js patterns
'use client'
import { useEffect, useState } from 'react'

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    try {
      const res = await fetch('/api/todos')
      const data = await res.json()
      setTodos(data.todos)
    } finally {
      setLoading(false)
    }
  }

  // Component renders here
}
```

#### Decision: No React Query for Phase II

**React Query/TanStack Query** is powerful but adds complexity:
- 📦 **Additional dependency** (+~40KB gzipped)
- 🏗️ **Learning curve**: Query keys, invalidation patterns
- ⏰ **Overkill for Phase II scope**: Only 1 todo list, no complex caching needs

**Use React Query if:**
- ✅ Multiple data sources (todos, projects, shared todos)
- ✅ Complex caching strategies needed
- ✅ Background refetching required
- ✅ Offline support needed

**Phase II uses simple state** - can upgrade to React Query in Phase III if needed

---

### R6.3: Optimistic Updates Implementation

#### Overview

Optimistic updates improve UX by immediately reflecting changes in the UI while the server processes the request.

#### Architecture

**Next.js App Router approach** (2025 best practice):

```
User Action
    ↓
[1] Update local state immediately (optimistic)
    ↓
[2] Call Server Action or API
    ↓
[3] If success: state already updated ✓
    ↓
[4] If error: revert state + show error
```

#### Implementation Pattern: Complete Example

```typescript
// lib/actions.ts (Server Actions)
'use server'

import { revalidatePath } from 'next/cache'

export async function createTodoAction(title: string) {
  const user = await verifySession()

  // Validation
  if (!title.trim() || title.length > 500) {
    return { error: 'Invalid title' }
  }

  // Create in database
  const newTodo = await db.todo.create({
    data: {
      title: title.trim(),
      userId: user.id,
      isCompleted: false,
    },
  })

  // Revalidate cache
  revalidatePath('/todos')

  return { success: true, todo: newTodo }
}

export async function updateTodoAction(id: string, updates: Partial<Todo>) {
  const user = await verifySession()

  // Verify ownership
  const todo = await db.todo.findUnique({ where: { id } })
  if (todo?.userId !== user.id) {
    return { error: 'Not authorized' }
  }

  // Update in database
  const updated = await db.todo.update({
    where: { id },
    data: updates,
  })

  revalidatePath('/todos')
  return { success: true, todo: updated }
}

export async function deleteTodoAction(id: string) {
  const user = await verifySession()

  // Verify ownership
  const todo = await db.todo.findUnique({ where: { id } })
  if (todo?.userId !== user.id) {
    return { error: 'Not authorized' }
  }

  // Delete from database
  await db.todo.delete({ where: { id } })

  revalidatePath('/todos')
  return { success: true }
}
```

```typescript
// components/TodoList.tsx (Client Component with optimistic updates)
'use client'

import { useState, useActionState, useTransition } from 'react'
import {
  createTodoAction,
  updateTodoAction,
  deleteTodoAction,
} from '@/lib/actions'

interface Todo {
  id: string
  title: string
  isCompleted: boolean
}

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  // Local state for optimistic updates
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [isPending, startTransition] = useTransition()

  // Create todo with optimistic update
  const handleAddTodo = async (title: string) => {
    // [1] Optimistic update - add todo locally immediately
    const optimisticTodo: Todo = {
      id: `temp-${Date.now()}`, // Temporary ID
      title,
      isCompleted: false,
    }
    setTodos((prev) => [...prev, optimisticTodo])

    // [2] Call server action
    startTransition(async () => {
      const result = await createTodoAction(title)

      if (result.success) {
        // [3] Replace temporary todo with server response
        setTodos((prev) =>
          prev.map((t) =>
            t.id === optimisticTodo.id ? result.todo : t
          )
        )
      } else {
        // [4] Revert optimistic update on error
        setTodos((prev) =>
          prev.filter((t) => t.id !== optimisticTodo.id)
        )
        alert(`Error: ${result.error}`)
      }
    })
  }

  // Update todo with optimistic update
  const handleToggleTodo = (todoId: string, newState: boolean) => {
    // [1] Optimistic update
    setTodos((prev) =>
      prev.map((t) =>
        t.id === todoId ? { ...t, isCompleted: newState } : t
      )
    )

    // [2] Call server action
    startTransition(async () => {
      const result = await updateTodoAction(todoId, {
        isCompleted: newState,
      })

      if (!result.success) {
        // [4] Revert on error
        setTodos((prev) =>
          prev.map((t) =>
            t.id === todoId
              ? { ...t, isCompleted: !newState }
              : t
          )
        )
        alert(`Error: ${result.error}`)
      }
    })
  }

  // Delete todo with optimistic update
  const handleDeleteTodo = (todoId: string) => {
    // [1] Optimistic update - remove immediately
    const deleted = todos.find((t) => t.id === todoId)
    setTodos((prev) => prev.filter((t) => t.id !== todoId))

    // [2] Call server action
    startTransition(async () => {
      const result = await deleteTodoAction(todoId)

      if (!result.success) {
        // [4] Revert on error
        if (deleted) {
          setTodos((prev) => [...prev, deleted])
        }
        alert(`Error: ${result.error}`)
      }
    })
  }

  return (
    <div>
      <TodoForm onAdd={handleAddTodo} disabled={isPending} />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{
            opacity: todo.id.startsWith('temp-') ? 0.5 : 1,
            textDecoration: todo.isCompleted ? 'line-through' : 'none',
          }}>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={(e) => handleToggleTodo(todo.id, e.target.checked)}
              disabled={isPending}
            />
            <span>{todo.title}</span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              disabled={isPending}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

#### Key Optimistic Update Concepts

**Temporary IDs:**
```typescript
// Use temp ID while waiting for server
const tempId = `temp-${Date.now()}-${Math.random()}`
// Replace with server ID when response arrives
```

**State Reverting:**
```typescript
// Always prepare to revert if error occurs
const previousTodos = todos
setTodos(newTodos)

// If API call fails, restore
if (!success) {
  setTodos(previousTodos)
}
```

**Disabled UI during pending:**
```typescript
const [isPending, startTransition] = useTransition()

<button disabled={isPending}>
  {isPending ? 'Saving...' : 'Save'}
</button>
```

---

### R6.4: State Persistence Strategies

#### Overview

State persistence ensures user state survives page refreshes and session reopening.

#### Strategy 1: Server-Side Session (RECOMMENDED for Phase II)

**How it works:**
- Backend stores session in secure HTTP-only cookie
- Frontend doesn't need to persist anything
- Session automatically sent with every API request
- Browser automatically manages cookie lifecycle

**Advantages:**
- ✅ **Secure**: Cannot be accessed by JavaScript
- ✅ **Simple**: No client-side persistence code needed
- ✅ **Automatic**: Browser handles cookie lifecycle
- ✅ **Follows Next.js pattern**: Recommended by Next.js docs

**Implementation:**
```typescript
// Backend (FastAPI) - set HTTP-only cookie on signin
@app.post('/api/auth/signin')
async def signin(email: str, password: str):
    user = authenticate(email, password)
    session_token = create_session(user.id)

    response = JSONResponse({'user': user})
    response.set_cookie(
        'session',
        session_token,
        httponly=True,  # Cannot be accessed by JavaScript
        secure=True,    # HTTPS only
        samesite='Lax', # CSRF protection
        max_age=7*24*60*60  # 7 days
    )
    return response

# Frontend - no persistence code needed!
// lib/actions.ts
export async function checkAuth() {
  const response = await fetch('/api/auth/me', {
    credentials: 'include' // Include cookies automatically
  })
  return response.ok
}
```

#### Strategy 2: localStorage + Hydration Check (Alternative)

**Use only if token-based auth required.**

```typescript
// Only for JWT tokens, not recommended for Phase II
useEffect(() => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    validateToken(token).then(setUser)
  }
}, [])
```

**Disadvantages for Phase II:**
- ❌ More complex
- ❌ Token vulnerability (XSS)
- ❌ Manual refresh logic needed

#### Recommendation: HTTP-Only Cookies

**Phase II uses HTTP-only cookies** because:
1. ✅ Better Auth supports this out-of-the-box
2. ✅ More secure (JavaScript cannot access)
3. ✅ Simpler (no client-side persistence code)
4. ✅ Follows Next.js best practices

---

### R6.5: Comparison of State Management Libraries

#### React Context API (SELECTED)

| Aspect | Rating | Notes |
|--------|--------|-------|
| Setup Complexity | ⭐⭐ | Simple - built-in |
| Bundle Size | ⭐⭐⭐⭐⭐ | 0 bytes (built-in) |
| Performance | ⭐⭐⭐⭐ | Good with memoization |
| Caching | ❌ | No automatic caching |
| DevTools | ⭐⭐ | Limited debugging |
| Learning Curve | ⭐⭐ | Well-known React API |

**Best for Phase II**: Auth state, simple global state

---

#### React Query / TanStack Query

| Aspect | Rating | Notes |
|--------|--------|-------|
| Setup Complexity | ⭐⭐⭐ | Requires configuration |
| Bundle Size | ⭐⭐ | ~40KB gzipped |
| Performance | ⭐⭐⭐⭐⭐ | Excellent caching |
| Caching | ⭐⭐⭐⭐⭐ | Built-in, sophisticated |
| DevTools | ⭐⭐⭐⭐⭐ | Excellent debugging |
| Learning Curve | ⭐⭐⭐ | Query keys, invalidation patterns |

**When to use**: Multiple data sources, complex caching, background refetching

**Phase II verdict**: ⏸️ **Too much for scope** - add in Phase III if needed

**Example (Phase III upgrade path):**
```typescript
// Phase III: React Query for complex scenarios
const { data: todos } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 5 * 60 * 1000, // Cache 5 minutes
})
```

---

#### SWR (Stale-While-Revalidate)

| Aspect | Rating | Notes |
|--------|--------|-------|
| Setup Complexity | ⭐⭐ | Simple configuration |
| Bundle Size | ⭐⭐⭐ | ~15KB gzipped |
| Performance | ⭐⭐⭐⭐ | Good caching |
| Caching | ⭐⭐⭐⭐ | Good revalidation patterns |
| DevTools | ⭐⭐⭐ | Good debugging |
| Learning Curve | ⭐⭐ | Simple API |

**When to use**: When you want caching with minimal setup

**Phase II verdict**: ⏸️ **Lighter than React Query** - could work, but still unnecessary complexity

**Example:**
```typescript
import useSWR from 'swr'

const { data: todos } = useSWR('/api/todos', fetcher)
```

---

#### Zustand

| Aspect | Rating | Notes |
|--------|--------|-------|
| Setup Complexity | ⭐⭐⭐ | Store boilerplate |
| Bundle Size | ⭐⭐⭐⭐ | ~2.5KB gzipped |
| Performance | ⭐⭐⭐⭐⭐ | Minimal rerenders |
| Caching | ❌ | No automatic caching |
| DevTools | ⭐⭐⭐⭐ | Good debugging |
| Learning Curve | ⭐⭐ | Simple API |

**When to use**: Complex client state (non-server data)

**Phase II verdict**: ❌ **Not needed** - Context handles auth, useState handles UI state

**Example (if used):**
```typescript
import { create } from 'zustand'

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

---

## Final Recommendation

### Phase II Architecture

```
┌─────────────────────────────────────────┐
│  Next.js App Router Frontend            │
├─────────────────────────────────────────┤
│                                         │
│  Global Auth State                      │
│  ├─ React Context API                   │
│  ├─ useAuth() hook                      │
│  └─ AuthProvider wrapper                │
│                                         │
│  Todo List State                        │
│  ├─ useState (local state)              │
│  ├─ Server Actions (mutations)          │
│  └─ useActionState (pending states)     │
│                                         │
│  Session Persistence                    │
│  └─ HTTP-only cookies (automatic)       │
│                                         │
└─────────────────────────────────────────┘
         ↓ (fetch with credentials)
┌─────────────────────────────────────────┐
│  FastAPI Backend                        │
│  ├─ Better Auth integration             │
│  ├─ Session validation middleware       │
│  └─ Todo CRUD endpoints                 │
└─────────────────────────────────────────┘
```

### Stack Decision

| Layer | Technology | Why |
|-------|-----------|-----|
| **Auth State** | React Context API | Simple, global, built-in |
| **Todo State** | useState + Server Actions | Matches Next.js patterns |
| **Optimistic Updates** | useActionState + startTransition | React 19 best practice |
| **Session** | HTTP-only cookies | Secure, automatic |
| **Caching** | None (Phase II) | Not needed for scope |
| **Persistence** | Backend sessions | Secure, simple |

### Migration Path

```
Phase II (Current)
├─ React Context for auth
├─ useState for todos
└─ Server Actions for mutations

        ↓ (if Phase III needs complex caching)

Phase III (Optional upgrade)
├─ React Query for todos caching
├─ Optimistic updates via React Query
└─ Background refetching
```

---

## Code Examples

### Example 1: Auth Context Setup

```typescript
// app/providers.tsx
'use client'

import { AuthProvider } from '@/lib/auth-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
```

```typescript
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### Example 2: Protected Route Pattern

```typescript
// app/todos/page.tsx
'use client'

import { useAuth } from '@/lib/auth-context'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import TodoList from '@/components/TodoList'

export default function TodosPage() {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      redirect('/signin')
    }
  }, [user, isLoading])

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>My Todos</h1>
      <TodoList />
    </div>
  )
}
```

### Example 3: Optimistic Todo Operations

```typescript
// components/TodoItem.tsx
'use client'

import { useTransition } from 'react'
import { updateTodoAction, deleteTodoAction } from '@/lib/actions'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    onUpdate(todo.id, { isCompleted: !todo.isCompleted })

    startTransition(async () => {
      const result = await updateTodoAction(todo.id, {
        isCompleted: !todo.isCompleted,
      })

      if (!result.success) {
        // Revert on error
        onUpdate(todo.id, { isCompleted: todo.isCompleted })
        alert(result.error)
      }
    })
  }

  const handleDelete = () => {
    onDelete(todo.id)

    startTransition(async () => {
      const result = await deleteTodoAction(todo.id)

      if (!result.success) {
        // Revert on error
        onDelete(todo.id) // Re-add
        alert(result.error)
      }
    })
  }

  return (
    <li style={{ opacity: isPending ? 0.5 : 1 }}>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={handleToggle}
        disabled={isPending}
      />
      <span style={{
        textDecoration: todo.isCompleted ? 'line-through' : 'none',
      }}>
        {todo.title}
      </span>
      <button onClick={handleDelete} disabled={isPending}>
        Delete
      </button>
    </li>
  )
}
```

---

## References

### Official Documentation

- [React Context API - react.dev](https://react.dev/reference/react/useContext)
- [Next.js App Router Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [Server Actions and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [useActionState Hook - react.dev](https://react.dev/reference/react/useActionState)

### Related Libraries (Reference Only)

- [TanStack Query (React Query)](https://tanstack.com/query/latest)
- [SWR by Vercel](https://swr.vercel.app/)
- [Zustand](https://github.com/pmndrs/zustand)

### Key Architectural Patterns

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application/routing)

---

## Decision Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Auth State** | React Context API | Simple, global, zero dependencies |
| **Todo State** | useState + Server Actions | Matches Next.js App Router patterns |
| **Optimistic Updates** | useActionState + startTransition | React 19 best practice, automatic pending state |
| **Session Persistence** | HTTP-only cookies | Secure, automatic, no client-side code needed |
| **Query Library** | None (Phase II) | Adds complexity for single data source; upgrade path exists for Phase III |
| **State Library** | None | Context handles auth; useState handles UI state |

**Complexity**: ✅ **Low** - Uses built-in React APIs, minimal dependencies
**Global Auth**: ✅ **Supported** - AuthProvider + useAuth() hook
**Optimistic Updates**: ✅ **Supported** - useActionState + local state synchronization
**App Router Integration**: ✅ **Perfect** - Designed for Next.js patterns

---

## Implementation Checklist (for tasks.md)

- [ ] Create `lib/auth-context.tsx` with AuthProvider and useAuth() hook
- [ ] Implement session check in AuthProvider useEffect
- [ ] Create `lib/actions.ts` with Server Actions for auth operations
- [ ] Set up HTTP-only cookie configuration in backend
- [ ] Create protected route wrapper component
- [ ] Implement todo optimistic update pattern in TodoItem component
- [ ] Add useActionState pattern for loading states
- [ ] Set up error handling and rollback logic
- [ ] Test session persistence across page refreshes
- [ ] Verify CORS configuration for credentials

---

**Research Completed**: 2025-12-31
**Status**: ✅ Ready for Phase 1 Design Artifacts
**Next Step**: Generate data-model.md and API contracts
