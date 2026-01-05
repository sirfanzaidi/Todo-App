'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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

export default function ChatPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { showToast } = useToast()

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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
      console.error('Failed to load conversation history:', error)
      showToast('Failed to load conversation history', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || !user || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message to UI immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      const response = await sendChatMessage(user.id, userMessage, conversationId)

      // Save conversation ID if this is a new conversation
      if (!conversationId) {
        setConversationId(response.conversation_id)
        saveConversationId(response.conversation_id)
      }

      // Add assistant response to UI
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.response,
          id: response.message_id,
        },
      ])
    } catch (error) {
      console.error('Chat error:', error)
      showToast(
        error instanceof Error ? error.message : 'Failed to send message',
        'error'
      )
      // Remove the optimistically added user message on error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConversation = () => {
    clearConversationId()
    setConversationId(null)
    setMessages([])
    setInput('')
    showToast('Started new conversation', 'success')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AI Todo Assistant</h1>
              <p className="text-gray-600 mt-1">
                Manage your tasks using natural language
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleNewConversation}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                New Chat
              </button>
              <button
                onClick={() => router.push('/todos')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                View Tasks
              </button>
            </div>
          </div>
          {conversationId && (
            <p className="text-sm text-gray-500 mt-2">
              Conversation ID: {conversationId}
            </p>
          )}
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-md flex flex-col" style={{ height: 'calc(100vh - 280px)' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-12">
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm mt-2">
                  Try: "Add a task to buy groceries" or "What tasks do I have?"
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </p>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <p className="text-sm font-medium mb-1">Assistant</p>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message... (e.g., 'Add a task to buy groceries')"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
                maxLength={2000}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Phase III AI Todo Assistant - Manage your tasks naturally.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
