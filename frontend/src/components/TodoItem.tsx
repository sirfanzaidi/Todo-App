'use client'

import { useState } from 'react'
import type { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, updates: { title?: string; is_completed?: boolean }) => void
  onDelete: (id: string) => void
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)

  const handleToggle = () => {
    onUpdate(todo.id, { is_completed: !todo.is_completed })
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

  return (
    <li
      style={{
        padding: '16px 20px',
        marginBottom: '12px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: todo.is_completed ? 0.6 : 1,
        filter: todo.is_completed ? 'blur(0.5px)' : 'none',
        position: 'relative' as const,
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
          {/* Custom Checkbox */}
          <label style={{ position: 'relative' as const, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={todo.is_completed}
              onChange={handleToggle}
              style={{
                position: 'absolute' as const,
                opacity: 0,
                cursor: 'pointer',
              }}
            />
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '8px',
                border: todo.is_completed
                  ? '2px solid #22d3ee'
                  : '2px solid rgba(255, 255, 255, 0.3)',
                background: todo.is_completed
                  ? 'linear-gradient(135deg, #667eea 0%, #22d3ee 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: todo.is_completed
                  ? '0 0 20px rgba(34, 211, 238, 0.5), inset 0 0 10px rgba(34, 211, 238, 0.2)'
                  : 'none',
              }}
            >
              {todo.is_completed && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </label>

          <span
            style={{
              flex: 1,
              textDecoration: todo.is_completed ? 'line-through' : 'none',
              color: todo.is_completed ? '#9ca3af' : '#e0e6ed',
              fontSize: '16px',
              fontWeight: '400',
              letterSpacing: '0.01em',
            }}
          >
            {todo.title}
          </span>

          <button
            onClick={handleEdit}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.3)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(236, 72, 153, 0.5), 0 0 30px rgba(236, 72, 153, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.3)'
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
