import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import TodoForm from './components/TodoForm'
import FilterBar from './components/FilterBar'
import TodoList from './components/TodoList'
import CalendarView from './components/CalendarView'
import PomodoroPanel from './components/PomodoroPanel'
import StatsModal from './components/StatsModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useReminders, requestNotificationPermission } from './hooks/useReminders'
import { usePomodoro } from './hooks/usePomodoro'
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
  const [showStats, setShowStats] = useState(false)
  const [viewMode, setViewMode] = useState('list')

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

  // เมื่อ work session จบ → บันทึก pomodoroCount
  const onSessionComplete = useCallback(
    (taskId) => {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, pomodoroCount: (t.pomodoroCount ?? 0) + 1 } : t,
        ),
      )
    },
    [setTodos],
  )

  const pomodoro = usePomodoro(onSessionComplete)

  // หา title ของ task ที่กำลัง active
  const activeTask = todos.find((t) => t.id === pomodoro.activeTaskId)

  const addTodo = (data) => {
    setTodos((prev) => [
      { id: createId(), done: false, createdAt: new Date().toISOString(), pomodoroCount: 0, completedAt: null, ...data },
      ...prev,
    ])
  }

  const toggleTodo = (id) =>
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, completedAt: !t.done ? new Date().toISOString() : null }
          : t
      )
    )

  const deleteTodo = (id) => {
    if (pomodoro.activeTaskId === id) pomodoro.stop()
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

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
        onShowStats={() => setShowStats(true)}
        remaining={remaining}
      />
      <TodoForm onAdd={addTodo} />

      <div className="view-toggle">
        <button
          className={`btn ${viewMode === 'list' ? 'btn--primary' : ''}`}
          onClick={() => setViewMode('list')}
        >
          ☰ รายการ
        </button>
        <button
          className={`btn ${viewMode === 'calendar' ? 'btn--primary' : ''}`}
          onClick={() => setViewMode('calendar')}
        >
          📅 ปฏิทิน
        </button>
      </div>

      {viewMode === 'list' ? (
        <>
          <FilterBar filters={filters} onChange={setFilters} />
          <TodoList
            todos={visibleTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
            onStartPomodoro={pomodoro.start}
            activePomodoroId={pomodoro.activeTaskId}
          />
        </>
      ) : (
        <CalendarView todos={todos} onToggle={toggleTodo} />
      )}

      {completedCount > 0 && viewMode === 'list' && (
        <footer className="app__footer">
          <span>เสร็จแล้ว {completedCount} งาน</span>
          <button className="btn btn--ghost" onClick={clearCompleted}>
            ล้างงานที่เสร็จแล้ว
          </button>
        </footer>
      )}

      <div className="brand-footer">Supasit.A &amp; Claude code 🐾</div>
      <PomodoroPanel
        phase={pomodoro.phase}
        phaseLabel={pomodoro.phaseLabel}
        secondsLeft={pomodoro.secondsLeft}
        totalSeconds={pomodoro.totalSeconds}
        isRunning={pomodoro.isRunning}
        sessionsDone={pomodoro.sessionsDone}
        activeTaskTitle={activeTask?.title}
        onPause={pomodoro.pause}
        onResume={pomodoro.resume}
        onStop={pomodoro.stop}
      />
      {showStats && <StatsModal todos={todos} onClose={() => setShowStats(false)} />}
    </div>
  )
}
