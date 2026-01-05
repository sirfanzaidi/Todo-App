'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  SessionExpiredError,
} from '@/lib/api'
import { useToast } from '@/components/Toast'
import TodoForm from '@/components/TodoForm'
import TodoList from '@/components/TodoList'
import type { Todo } from '@/types'

export default function TodosPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, logout } = useAuth()
  const { showToast } = useToast()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Handle session expiration
  const handleSessionExpired = () => {
    showToast('Session expired. Please sign in again.', 'error')
    logout()
    router.push('/signin')
  }

  // Auth protection - redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
    }
  }, [user, authLoading, router])

  // Fetch todos on mount
  useEffect(() => {
    if (user) {
      fetchTodos()
    }
  }, [user])

  const fetchTodos = async () => {
    setLoading(true)
    setError('')

    try {
      const response: any = await getTodos()
      setTodos(response.todos || [])
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        handleSessionExpired()
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to load todos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (title: string) => {
    const tempId = `temp-${Date.now()}`
    const optimisticTodo: Todo = {
      id: tempId,
      title,
      is_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Optimistic update - add immediately
    setTodos((prev) => [optimisticTodo, ...prev])
    setError('')

    try {
      const response: any = await createTodo(title)
      // Replace temp todo with server response
      setTodos((prev) =>
        prev.map((t) => (t.id === tempId ? response.todo : t))
      )
    } catch (err) {
      // Revert on error
      setTodos((prev) => prev.filter((t) => t.id !== tempId))

      if (err instanceof SessionExpiredError) {
        handleSessionExpired()
        throw err
      }

      setError(err instanceof Error ? err.message : 'Failed to create todo')
      throw err // Re-throw so TodoForm can show error
    }
  }

  const handleUpdate = async (
    id: string,
    updates: { title?: string; status?: string }
  ) => {
    // Optimistic update
    const previousTodos = todos
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )

    try {
      await updateTodo(id, updates)
    } catch (err) {
      // Revert on error
      setTodos(previousTodos)

      if (err instanceof SessionExpiredError) {
        handleSessionExpired()
        return
      }

      setError(err instanceof Error ? err.message : 'Failed to update todo')
    }
  }

  const handleDelete = async (id: string) => {
    // Optimistic update
    const previousTodos = todos
    setTodos((prev) => prev.filter((t) => t.id !== id))

    try {
      await deleteTodo(id)
    } catch (err) {
      // Revert on error
      setTodos(previousTodos)

      if (err instanceof SessionExpiredError) {
        handleSessionExpired()
        return
      }

      setError(err instanceof Error ? err.message : 'Failed to delete todo')
    }
  }

  const handleSignout = async () => {
    await logout()
    router.push('/signin')
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 20px',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTop: '3px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{
            color: '#9ca3af',
            fontSize: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #ec4899 50%, #22d3ee 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Loading...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return null
  }

  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '900px',
        margin: '0 auto',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        <div>
          <h1 style={{
            margin: 0,
            marginBottom: '8px',
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #ec4899 50%, #22d3ee 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}>
            My Todos
          </h1>
          <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
            {user.email}
          </p>
        </div>
        <button
          onClick={handleSignout}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#e0e6ed',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            padding: '16px 20px',
            marginBottom: '24px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {error}
        </div>
      )}

      {/* Add todo form */}
      <TodoForm onSubmit={handleCreate} />

      {/* Todo list */}
      <TodoList todos={todos} onUpdate={handleUpdate} onDelete={handleDelete} />

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          div {
            padding: 20px 15px;
          }
          h1 {
            font-size: 28px !important;
          }
        }

        @media (max-width: 480px) {
          div {
            padding: 15px 10px;
          }
          h1 {
            font-size: 24px !important;
          }
        }
      `}</style>
    </div>
  )
}
