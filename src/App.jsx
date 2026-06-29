import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import TodoForm from './components/TodoForm'
import FilterBar from './components/FilterBar'
import TodoList from './components/TodoList'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useReminders, requestNotificationPermission } from './hooks/useReminders'
import { createId, filterTodos, sortTodos } from './utils/todoHelpers'

const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  category: 'all',
  priority: 'all',
  sortBy: 'created',
}

function getInitialTheme() {
  const stored = window.localStorage.getItem('todo-theme')
  if (stored) return JSON.parse(stored)
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [todos, setTodos] = useLocalStorage('todos', [])
  const [theme, setTheme] = useLocalStorage('todo-theme', getInitialTheme())
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  // ใช้ธีมกับ root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // ขอสิทธิ์แจ้งเตือนครั้งแรก
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  // เปิดระบบแจ้งเตือนตาม due date
  useReminders(todos)

  const addTodo = (data) => {
    setTodos((prev) => [
      { id: createId(), done: false, createdAt: new Date().toISOString(), ...data },
      ...prev,
    ])
  }

  const toggleTodo = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id))

  const updateTodo = (id, data) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)))

  const clearCompleted = () => setTodos((prev) => prev.filter((t) => !t.done))

  const visibleTodos = useMemo(
    () => sortTodos(filterTodos(todos, filters), filters.sortBy),
    [todos, filters],
  )

  const remaining = todos.filter((t) => !t.done).length
  const completedCount = todos.length - remaining

  return (
    <div className="app">
      <Header
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        remaining={remaining}
      />
      <TodoForm onAdd={addTodo} />
      <FilterBar filters={filters} onChange={setFilters} />
      <TodoList
        todos={visibleTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onUpdate={updateTodo}
      />
      {completedCount > 0 && (
        <footer className="app__footer">
          <span>เสร็จแล้ว {completedCount} งาน</span>
          <button className="btn btn--ghost" onClick={clearCompleted}>
            ล้างงานที่เสร็จแล้ว
          </button>
        </footer>
      )}
    </div>
  )
}
