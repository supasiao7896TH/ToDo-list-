import { CATEGORIES, PRIORITIES } from './todoHelpers'

export function computeStats(todos) {
  const total = todos.length
  const done = todos.filter((t) => t.done).length
  const rate = total === 0 ? 0 : Math.round((done / total) * 100)
  const totalPomodoros = todos.reduce((s, t) => s + (t.pomodoroCount ?? 0), 0)
  return { total, done, rate, totalPomodoros }
}

export function completionsByDay(todos, days = 7) {
  const DAY_LABELS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
  const result = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const count = todos.filter((t) => t.completedAt && t.completedAt.slice(0, 10) === dateStr).length
    result.push({ label: DAY_LABELS[d.getDay()], date: dateStr, count })
  }
  return result
}

export function byCategory(todos) {
  return CATEGORIES.map((name) => {
    const group = todos.filter((t) => t.category === name)
    return { name, total: group.length, done: group.filter((t) => t.done).length }
  })
}

export function byPriority(todos) {
  return PRIORITIES.map(({ value, label }) => {
    const group = todos.filter((t) => t.priority === value)
    return { name: label, total: group.length, done: group.filter((t) => t.done).length }
  })
}

export function computeStreak(todos) {
  const completedDays = new Set(
    todos.filter((t) => t.completedAt).map((t) => t.completedAt.slice(0, 10))
  )
  let streak = 0
  const today = new Date()
  for (let i = 0; ; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    if (completedDays.has(d.toISOString().slice(0, 10))) {
      streak++
    } else {
      break
    }
  }
  return streak
}
