/**
 * TypeScript type definitions for User and Todo entities
 */

export interface User {
  id: string
  full_name: string
  email: string
  created_at: string
}

export interface Todo {
  id: string
  title: string
  is_completed: boolean
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
