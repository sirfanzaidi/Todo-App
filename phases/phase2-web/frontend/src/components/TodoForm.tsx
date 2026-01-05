'use client'

import { useState, FormEvent } from 'react'

interface TodoFormProps {
  onSubmit: (title: string) => Promise<void>
  loading?: boolean
}

export default function TodoForm({ onSubmit, loading = false }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!title.trim()) {
      setError('Title cannot be empty')
      return
    }

    if (title.length > 500) {
      setError('Title must be 500 characters or less')
      return
    }

    try {
      await onSubmit(title.trim())
      setTitle('') // Clear input on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginBottom: '32px', width: '100%' }}
    >
      {error && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            fontSize: '14px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={loading}
          maxLength={500}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '14px 20px',
            fontSize: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            color: '#e0e6ed',
            outline: 'none',
            transition: 'all 0.3s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'
            e.currentTarget.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.2)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          style={{
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '600',
            background: loading || !title.trim()
              ? 'rgba(255, 255, 255, 0.1)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: loading || !title.trim() ? '#6b7280' : 'white',
            border: 'none',
            borderRadius: '14px',
            cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
            boxShadow: loading || !title.trim()
              ? 'none'
              : '0 4px 20px rgba(99, 102, 241, 0.4)',
          }}
          onMouseEnter={(e) => {
            if (!loading && title.trim()) {
              e.currentTarget.style.boxShadow = '0 6px 30px rgba(99, 102, 241, 0.6), 0 0 40px rgba(99, 102, 241, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && title.trim()) {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)'
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          {loading ? 'Adding...' : 'Add Todo'}
        </button>
      </div>

      {title.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          paddingLeft: '4px',
        }}>
          <small style={{
            color: title.length > 490 ? '#fca5a5' : '#6b7280',
            fontSize: '13px',
          }}>
            {title.length > 490 ? `⚠️ Almost full: ${title.length}/500` : `${title.length}/500 characters`}
          </small>
          {title.length > 500 && (
            <small style={{ color: '#ef4444', fontSize: '13px' }}>❌ Too long!</small>
          )}
        </div>
      )}
    </form>
  )
}
