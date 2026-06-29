import { useState } from 'react'
import { PRIORITIES, CATEGORIES } from '../utils/todoHelpers'

const EMPTY = { title: '', dueDate: '', category: CATEGORIES[0], priority: 'medium' }

export default function TodoForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY)

  const handleSubmit = (e) => {
    e.preventDefault()
    const title = form.title.trim()
    if (!title) return
    onAdd({ ...form, title })
    setForm(EMPTY)
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-form__title"
        type="text"
        placeholder="มีอะไรต้องทำบ้าง?"
        value={form.title}
        onChange={update('title')}
        aria-label="ชื่องาน"
      />
      <div className="todo-form__row">
        <label className="field">
          <span>กำหนดส่ง</span>
          <input type="datetime-local" value={form.dueDate} onChange={update('dueDate')} />
        </label>
        <label className="field">
          <span>หมวดหมู่</span>
          <select value={form.category} onChange={update('category')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>ความสำคัญ</span>
          <select value={form.priority} onChange={update('priority')}>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn btn--primary">เพิ่มงาน</button>
      </div>
    </form>
  )
}
