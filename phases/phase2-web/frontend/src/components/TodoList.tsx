import type { Todo } from '@/types'
import TodoItem from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onUpdate: (id: string, updates: { title?: string; is_completed?: boolean }) => void
  onDelete: (id: string) => void
}

export default function TodoList({ todos, onUpdate, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>✨</div>
        <p style={{
          fontSize: '20px',
          marginBottom: '12px',
          background: 'linear-gradient(135deg, #667eea 0%, #ec4899 50%, #22d3ee 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '600',
        }}>
          No todos yet!
        </p>
        <p style={{ color: '#9ca3af', fontSize: '16px' }}>
          Add your first todo to get started
        </p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  )
}
