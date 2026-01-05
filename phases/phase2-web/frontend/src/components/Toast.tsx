'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7)
    const newToast: Toast = { id, message, type }

    setToasts((prev) => [...prev, newToast])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const getToastColor = (type: ToastType): string => {
    switch (type) {
      case 'success':
        return '#28a745'
      case 'error':
        return '#dc3545'
      case 'info':
        return '#007bff'
      default:
        return '#6c757d'
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              minWidth: '250px',
              maxWidth: '400px',
              padding: '12px 16px',
              backgroundColor: getToastColor(toast.type),
              color: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                marginLeft: '10px',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '0 5px',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Toast animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  )
}
