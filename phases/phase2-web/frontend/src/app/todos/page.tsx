'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getTodos, createTodo, updateTodo, deleteTodo, SessionExpiredError } from '@/lib/api'
import { useToast } from '@/components/Toast'
import TodoForm from '@/components/TodoForm'
import TodoList from '@/components/TodoList'
import type { Todo, TodoStatus } from '@/types'

export default function TodosPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, logout } = useAuth()
  const { showToast } = useToast()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) router.push('/')
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) fetchTodos()
  }, [user])

  const fetchTodos = async () => {
    setLoading(true)
    try {
      const response: any = await getTodos()
      setTodos(response.todos || [])
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        showToast('Session expired.', 'error')
        logout()
        router.push('/')
      }
      showToast('System Load Failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (title: string) => {
    try {
      const response: any = await createTodo(title)
      setTodos((prev) => [response.todo, ...prev])
    } catch (err) {
      showToast('Creation failed', 'error')
      throw err
    }
  }

  const handleUpdate = async (id: string, updates: { title?: string; status?: TodoStatus }) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    try {
      await updateTodo(id, updates)
    } catch (err) {
      fetchTodos() 
    }
  }

  const handleDelete = async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
    try {
      await deleteTodo(id)
    } catch (err) {
      fetchTodos()
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black tracking-[0.4em] text-cyan-400 uppercase italic">Synchronizing Node...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white selection:bg-cyan-500/30 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:30px_30px]"></div>

      {/* --- NAVIGATION (Synced to -10% Landing Scale) --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e27]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="text-xl font-black tracking-tighter uppercase">
              TRANSCEND<span className="text-cyan-400">.</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            <span className="text-[9px] font-bold text-gray-500 tracking-[0.3em] uppercase hidden md:block">
              {user?.email}
            </span>
          </div>
          <button 
            onClick={() => { logout(); router.push('/'); }}
            className="px-5 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all border border-white/10 hover:border-red-500/30"
          >
            Terminate Session
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT (Tightened Container) --- */}
      <main className="relative pt-28 pb-20 max-w-2xl mx-auto px-6">
        
        <header className="mb-10">
          <div className="inline-block px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.3em]">Status: Operational</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase leading-none">
            CENTRAL <span className="gradient-text">COMMAND.</span>
          </h1>
          <p className="text-gray-500 text-[9px] font-bold tracking-[0.5em] uppercase italic opacity-60">
            System Node Alpha // v1.0.4
          </p>
        </header>

        {/* Action Layer (TodoForm needs to be compact inside its own code) */}
        <div className="mb-12">
          <TodoForm onSubmit={handleCreate} />
        </div>

        {/* Task List Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1 mb-6">
            <h3 className="text-[10px] font-black tracking-[0.4em] text-cyan-400/40 uppercase">Active Directives</h3>
            <div className="h-[1px] flex-1 mx-6 bg-white/5" />
            <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/10" />
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/30" />
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            </div>
          </div>
          
          {/* TodoList needs its internal text reduced to ~13px or 14px */}
          <div className="rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]">
            <TodoList 
              todos={todos} 
              onUpdate={handleUpdate} 
              onDelete={handleDelete} 
            />
          </div>
        </section>
      </main>

      <footer className="py-10 text-center opacity-20">
        <p className="text-[8px] font-bold tracking-[1em] text-gray-500 uppercase">
          SECURE PROTOCOL ACTIVE
        </p>
      </footer>
    </div>
  )
}