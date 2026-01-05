'use client'

import { useState, FormEvent } from 'react'

interface AuthFormProps {
  mode: 'signup' | 'signin'
  onSubmit: (email: string, password: string, fullName: string, retypePassword: string) => Promise<void>
  loading?: boolean
  error?: string
}

export default function AuthForm({
  mode,
  onSubmit,
  loading = false,
  error,
}: AuthFormProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [validationError, setValidationError] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setValidationError('')

    // Client-side validation
    if (mode === 'signup') {
      if (!fullName.trim()) {
        setValidationError('Full Name is required')
        return
      }
    }

    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address')
      return
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters')
      return
    }

    if (password.length > 72) {
      setValidationError('Password cannot exceed 72 characters')
      return
    }

    if (mode === 'signup') {
      if (password !== retypePassword) {
        setValidationError('Passwords do not match')
        return
      }
    }

    await onSubmit(email, password, fullName, retypePassword)
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 20px',
    fontSize: '16px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: '#e0e6ed',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500' as const,
    color: '#9ca3af',
    letterSpacing: '0.02em',
  }

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '450px',
      margin: '0 auto',
      padding: '32px',
      borderRadius: '24px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '32px',
        fontSize: '28px',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #667eea 0%, #ec4899 50%, #22d3ee 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.02em',
      }}>
        {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
      </h2>

      {(error || validationError) && (
        <div
          style={{
            padding: '14px 18px',
            marginBottom: '24px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#fca5a5',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            fontSize: '14px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {error || validationError}
        </div>
      )}

      {mode === 'signup' && (
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="fullName" style={labelStyle}>
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
            placeholder="John Doe"
            style={inputStyle}
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
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="email" style={labelStyle}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          placeholder="you@example.com"
          style={inputStyle}
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
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="password" style={labelStyle}>
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          disabled={loading}
          placeholder="••••••••"
          style={inputStyle}
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
        {password.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <small style={{
              color: password.length < 8 ? '#fca5a5' : '#6ee7b7',
              fontSize: '13px',
            }}>
              {password.length < 8 ? '❌ Need 8+ characters' : '✅ Password length OK'}
            </small>
            <small style={{ color: '#6b7280', fontSize: '13px' }}>{password.length} chars</small>
          </div>
        )}
      </div>

      {mode === 'signup' && (
        <div style={{ marginBottom: '28px' }}>
          <label htmlFor="retypePassword" style={labelStyle}>
            Confirm Password
          </label>
          <input
            type="password"
            id="retypePassword"
            name="retypePassword"
            autoComplete="new-password"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            required
            minLength={8}
            disabled={loading}
            placeholder="••••••••"
            style={inputStyle}
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
          {retypePassword.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <small style={{
                color: password === retypePassword ? '#6ee7b7' : '#fca5a5',
                fontSize: '13px',
              }}>
                {password === retypePassword ? '✅ Passwords match' : '❌ Passwords do not match'}
              </small>
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px 28px',
          fontSize: '16px',
          fontWeight: '600',
          background: loading
            ? 'rgba(255, 255, 255, 0.1)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: loading ? '#6b7280' : 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(99, 102, 241, 0.4)',
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(99, 102, 241, 0.6), 0 0 40px rgba(99, 102, 241, 0.3)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)'
            e.currentTarget.style.transform = 'translateY(0)'
          }
        }}
      >
        {loading ? 'Loading...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
      </button>
    </form>
  )
}
