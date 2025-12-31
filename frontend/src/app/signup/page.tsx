'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthForm from '@/components/AuthForm'
import { useAuth } from '@/lib/auth-context'

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (email: string, password: string, fullName: string, retypePassword: string) => {
    setLoading(true)
    setError('')

    try {
      await signup(email, password, fullName, retypePassword)
      router.push('/todos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        padding: '60px 20px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <AuthForm
          mode="signup"
          onSubmit={handleSignup}
          loading={loading}
          error={error}
        />

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '15px',
          color: '#9ca3af',
        }}>
          Already have an account?{' '}
          <Link href="/signin" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
