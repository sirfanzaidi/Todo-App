/**
 * TypeScript type definitions for User and Todo entities
 */

export interface User {
  id: string
  full_name: string
  email: string
  created_at: string
}

export type TodoStatus = 'pending' | 'completed' | 'incomplete'

export interface Todo {
  id: string
  title: string
  status: TodoStatus
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  session?: {
    token?: string
    expires_at?: string
  }
}

export interface TodosResponse {
  todos: Todo[]
}

export interface TodoResponse {
  todo: Todo
}

export interface ErrorResponse {
  detail: string
}
