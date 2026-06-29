import { useState } from 'react'
import { isOverdue } from '../utils/todoHelpers'

const THAI_MONTHS = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
const DAY_NAMES = ['อา','จ','อ','พ','พฤ','ศ','ส']
const MAX_VISIBLE = 3

function toDateStr(d) {
  return d.toISOString().slice(0, 10)
}

function todayStr() {
  return toDateStr(new Date())
}

export default function CalendarView({ todos, onToggle }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const todosByDay = {}
  todos.forEach((t) => {
    if (!t.dueDate) return
    const key = t.dueDate.slice(0, 10)
    if (!todosByDay[key]) todosByDay[key] = []
    todosByDay[key].push(t)
  })

  const today = todayStr()
  const cells = []

  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, dateStr, tasks: todosByDay[dateStr] || [] })
  }

  return (
    <div className="calendar">
      <div className="calendar__nav">
        <button className="btn btn--icon" onClick={prevMonth} title="เดือนก่อน">◀</button>
        <span className="calendar__title">
          {THAI_MONTHS[month]} {year + 543}
        </span>
        <button className="btn btn--icon" onClick={nextMonth} title="เดือนถัดไป">▶</button>
      </div>

      <div className="calendar__grid">
        {DAY_NAMES.map((d) => (
          <div key={d} className="calendar__day-header">{d}</div>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <div key={`e-${i}`} className="calendar__cell calendar__cell--empty" />
          const isToday = cell.dateStr === today
          const doneTasks = cell.tasks.filter(t => t.done)
          const visible = cell.tasks.slice(0, MAX_VISIBLE)
          const extra = cell.tasks.length - MAX_VISIBLE
          return (
            <div key={cell.dateStr} className={`calendar__cell ${isToday ? 'calendar__cell--today' : ''}`}>
              <span className="calendar__day-num">{cell.day}</span>
              {doneTasks.length > 0 && doneTasks.length === cell.tasks.length && (
                <span className="calendar__done-dot" title="ทำครบทุกงานวันนี้">✓</span>
              )}
              <div className="calendar__tasks">
                {visible.map((t) => (
                  <button
                    key={t.id}
                    className={`calendar__task-chip calendar__task-chip--${t.priority} ${t.done ? 'is-done' : ''} ${isOverdue(t) ? 'is-overdue-chip' : ''}`}
                    onClick={() => onToggle(t.id)}
                    title={t.title}
                  >
                    {t.done ? '✓ ' : ''}{t.title}
                  </button>
                ))}
                {extra > 0 && (
                  <span className="calendar__extra">+{extra} อื่นๆ</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
