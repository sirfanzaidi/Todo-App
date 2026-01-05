/**
 * Chat service for managing conversation ID persistence and API interactions.
 */

const CONVERSATION_ID_KEY = 'current_conversation_id'

/**
 * Store conversation ID in localStorage
 */
export function saveConversationId(conversationId: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONVERSATION_ID_KEY, conversationId.toString())
  }
}

/**
 * Retrieve conversation ID from localStorage
 */
export function getConversationId(): number | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(CONVERSATION_ID_KEY)
    return stored ? parseInt(stored, 10) : null
  }
  return null
}

/**
 * Clear conversation ID from localStorage (start new conversation)
 */
export function clearConversationId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CONVERSATION_ID_KEY)
  }
}

/**
 * Chat API client functions
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ChatMessage {
  conversation_id: number | null
  message: string
}

export interface ChatResponse {
  conversation_id: number
  message_id: number
  response: string
  tool_calls: any[] | null
  timestamp: string
}

/**
 * Send a chat message to the API
 */
export async function sendChatMessage(
  userId: string,
  message: string,
  conversationId: number | null = null
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/api/${userId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
    body: JSON.stringify({
      conversation_id: conversationId,
      message,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || `HTTP error ${response.status}`)
  }

  return response.json()
}

/**
 * Fetch conversation history
 */
export async function getConversationHistory(
  userId: string,
  conversationId: number
): Promise<any[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/${userId}/conversations/${conversationId}/messages`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch conversation history: ${response.status}`)
  }

  const data = await response.json()
  return data.messages || []
}
