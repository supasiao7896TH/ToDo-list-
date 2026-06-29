import { useState } from 'react'
import { PRIORITIES, CATEGORIES, formatDate, isOverdue } from '../utils/todoHelpers'

export default function TodoItem({ todo, onToggle, onDelete, onUpdate, onStartPomodoro, isActivePomodoro }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo)

  const overdue = isOverdue(todo)
  const priorityLabel = PRIORITIES.find((p) => p.value === todo.priority)?.label

  const saveEdit = () => {
    const title = draft.title.trim()
    if (!title) return
    onUpdate(todo.id, { ...draft, title })
    setEditing(false)
  }

  const updateDraft = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }))

  if (editing) {
    return (
      <li className="todo-item todo-item--editing">
        <div className="todo-form__row">
          <input
            className="todo-form__title"
            type="text"
            value={draft.title}
            onChange={updateDraft('title')}
            aria-label="แก้ไขชื่องาน"
          />
          <input type="datetime-local" value={draft.dueDate || ''} onChange={updateDraft('dueDate')} />
          <select value={draft.category} onChange={updateDraft('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={draft.priority} onChange={updateDraft('priority')}>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <button className="btn btn--primary" onClick={saveEdit}>บันทึก</button>
          <button className="btn" onClick={() => { setDraft(todo); setEditing(false) }}>ยกเลิก</button>
        </div>
      </li>
    )
  }

  return (
    <li className={`todo-item ${todo.done ? 'is-done' : ''} ${overdue ? 'is-overdue' : ''} ${isActivePomodoro ? 'is-pomodoro-active' : ''}`}>
      <input
        type="checkbox"
        className="todo-item__check"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label="ทำเครื่องหมายว่าเสร็จ"
      />
      <div className="todo-item__body">
        <span className="todo-item__title">{todo.title}</span>
        <div className="todo-item__meta">
          <span className={`badge badge--${todo.priority}`}>{priorityLabel}</span>
          <span className="badge badge--category">{todo.category}</span>
          {todo.dueDate && (
            <span className={`badge badge--due ${overdue ? 'badge--overdue' : ''}`}>
              📅 {formatDate(todo.dueDate)}{overdue ? ' (เลยกำหนด)' : ''}
            </span>
          )}
          {todo.pomodoroCount > 0 && (
            <span className="badge badge--pomodoro" title={`${todo.pomodoroCount} Pomodoro session`}>
              🍅 {todo.pomodoroCount}
            </span>
          )}
        </div>
      </div>
      <div className="todo-item__actions">
        <button
          className={`btn btn--icon ${isActivePomodoro ? 'btn--pomodoro-active' : ''}`}
          onClick={() => onStartPomodoro(todo.id, todo.title)}
          title={isActivePomodoro ? 'กำลังโฟกัสอยู่' : 'เริ่ม Pomodoro'}
        >
          🍅
        </button>
        <button className="btn btn--icon" onClick={() => { setDraft(todo); setEditing(true) }} title="แก้ไข">✏️</button>
        <button className="btn btn--icon" onClick={() => onDelete(todo.id)} title="ลบ">🗑️</button>
      </div>
    </li>
  )
}
