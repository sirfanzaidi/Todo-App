'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/Toast'
import {
  sendChatMessage,
  getConversationId,
  saveConversationId,
  clearConversationId,
  getConversationHistory,
} from '@/services/chatService'

interface Message {
  role: 'user' | 'assistant'
  content: string
  id?: number
}

export default function ChatWidget() {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load conversation history on mount
  useEffect(() => {
    if (user) {
      const storedConvId = getConversationId()
      if (storedConvId) {
        setConversationId(storedConvId)
        loadHistory(storedConvId)
      }
    }
  }, [user])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const loadHistory = async (convId: number) => {
    if (!user) return
    try {
      const history = await getConversationHistory(user.id, convId)
      const formattedMessages = history.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        id: msg.id,
      }))
      setMessages(formattedMessages)
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !user || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      const response = await sendChatMessage(user.id, userMessage, conversationId)
      if (!conversationId) {
        setConversationId(response.conversation_id)
        saveConversationId(response.conversation_id)
      }
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.response, id: response.message_id },
      ])
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to send', 'error')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    clearConversationId()
    setConversationId(null)
    setMessages([])
    showToast('New chat started', 'success')
  }

  if (!user) return null

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: 'Inter, sans-serif' }}>
      {/* Toggle Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          fontSize: '24px',
        }}
      >
        {isOpen ? '✕' : '✨'}
      </button>

      {/* Widget Window */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '0',
            width: '380px',
            height: '500px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'white' }}>AI Assistant</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Powered by GPT-4</p>
            </div>
            <button
              onClick={handleNewChat}
              style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#e2e8f0', cursor: 'pointer' }}
            >
              New Chat
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '40px', color: '#64748b' }}>
                <p>Hello! How can I help you manage your tasks today?</p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  background: m.role === 'user' ? '#6366f1' : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  {m.content}
                </div>
              ))
            )}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div className="dot" style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%' }}></div>
                  <div className="dot" style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%' }}></div>
                  <div className="dot" style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} style={{ padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me something..."
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{
                  background: '#6366f1',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 15px',
                  color: 'white',
                  cursor: 'pointer',
                  opacity: (isLoading || !input.trim()) ? 0.5 : 1
                }}
              >
                ➔
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .dot { animation: bounce 1.4s infinite ease-in-out both; }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
