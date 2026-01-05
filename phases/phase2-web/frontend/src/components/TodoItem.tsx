'use client'

import { useState } from 'react'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, updates: { title?: string; status?: string }) => void
  onDelete: (id: string) => void
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)

  const handleMarkComplete = () => {
    onUpdate(todo.id, { status: 'completed' })
  }

  const handleMarkIncomplete = () => {
    onUpdate(todo.id, { status: 'incomplete' })
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditTitle(todo.title)
  }

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      onUpdate(todo.id, { title: editTitle.trim() })
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditTitle(todo.title)
  }

  const handleDelete = () => {
    onDelete(todo.id)
  }

  // Get status styling
  const getStatusStyle = () => {
    switch (todo.status) {
      case 'completed':
        return {
          background: 'rgba(34, 211, 238, 0.1)',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          opacity: 0.8,
        }
      case 'incomplete':
        return {
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          opacity: 0.8,
        }
      default:
        return {
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          opacity: 1,
        }
    }
  }

  const getStatusIcon = () => {
    switch (todo.status) {
      case 'completed':
        return (
          <span style={{
            padding: '4px 12px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 0 15px rgba(34, 211, 238, 0.4)',
          }}>
            ✅ Completed
          </span>
        )
      case 'incomplete':
        return (
          <span style={{
            padding: '4px 12px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)',
          }}>
            ❌ Incomplete
          </span>
        )
      default:
        return (
          <span style={{
            padding: '4px 12px',
            borderRadius: '8px',
            background: 'rgba(156, 163, 175, 0.2)',
            color: '#9ca3af',
            fontSize: '12px',
            fontWeight: '600',
            border: '1px solid rgba(156, 163, 175, 0.3)',
          }}>
            ⏳ Pending
          </span>
        )
    }
  }

  const statusStyle = getStatusStyle()

  return (
    <li
      style={{
        padding: '16px 20px',
        marginBottom: '12px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative' as const,
        ...statusStyle,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 12px 48px 0 rgba(99, 102, 241, 0.2), 0 0 20px rgba(99, 102, 241, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}
    >
      {!isEditing ? (
        <>
          {/* Status Badge */}
          {getStatusIcon()}

          {/* Title */}
          <span
            style={{
              flex: 1,
              textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
              color: todo.status === 'incomplete' ? '#fca5a5' : todo.status === 'completed' ? '#67e8f9' : '#e0e6ed',
              fontSize: '16px',
              fontWeight: '400',
              letterSpacing: '0.01em',
            }}
          >
            {todo.title}
          </span>

          {/* Action Buttons */}
          {todo.status !== 'completed' && (
            <button
              onClick={handleMarkComplete}
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: '500',
                background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 10px rgba(34, 211, 238, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(34, 211, 238, 0.5)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(34, 211, 238, 0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              ✓ Complete
            </button>
          )}

          {todo.status !== 'incomplete' && (
            <button
              onClick={handleMarkIncomplete}
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: '500',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(239, 68, 68, 0.5)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(239, 68, 68, 0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              ✗ Incomplete
            </button>
          )}

          <button
            onClick={handleEdit}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: '500',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.5)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(99, 102, 241, 0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: '500',
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 10px rgba(236, 72, 153, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(236, 72, 153, 0.5)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(236, 72, 153, 0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Delete
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '16px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.5)',
              borderRadius: '10px',
              color: '#e0e6ed',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)'
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.8)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'
            }}
            autoFocus
          />

          <button
            onClick={handleSaveEdit}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              background: 'linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(34, 211, 238, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(34, 211, 238, 0.5), 0 0 30px rgba(34, 211, 238, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(34, 211, 238, 0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Save
          </button>

          <button
            onClick={handleCancelEdit}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#9ca3af',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
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
            Cancel
          </button>
        </>
      )}
    </li>
  )
}
