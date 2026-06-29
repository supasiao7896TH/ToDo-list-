import { useEffect, useRef } from 'react'

// แจ้งเตือนล่วงหน้า 30 นาทีก่อนถึงกำหนด (และเมื่อเลยกำหนด)
const LEAD_TIME_MS = 30 * 60 * 1000
const CHECK_INTERVAL_MS = 30 * 1000

// ขอสิทธิ์แจ้งเตือนจากเบราว์เซอร์
export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  return Notification.requestPermission()
}

// ตรวจ due date เป็นระยะ แล้วยิง notification เมื่อใกล้/เลยกำหนด
export function useReminders(todos) {
  const notifiedRef = useRef(new Set())

  useEffect(() => {
    if (!('Notification' in window)) return

    const check = () => {
      if (Notification.permission !== 'granted') return
      const now = Date.now()
      for (const todo of todos) {
        if (todo.done || !todo.dueDate) continue
        if (notifiedRef.current.has(todo.id)) continue
        const due = new Date(todo.dueDate).getTime()
        if (Number.isNaN(due)) continue
        if (due - now <= LEAD_TIME_MS) {
          const overdue = due < now
          new Notification(overdue ? '⏰ งานเลยกำหนดแล้ว' : '🔔 ใกล้ถึงกำหนดงาน', {
            body: todo.title,
          })
          notifiedRef.current.add(todo.id)
        }
      }
    }

    check()
    const id = setInterval(check, CHECK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [todos])

  // ล้าง id ที่ถูกลบ/เสร็จแล้วออกจาก set เพื่อไม่ให้บวมและเตือนใหม่ได้ถ้าจำเป็น
  useEffect(() => {
    const activeIds = new Set(
      todos.filter((t) => !t.done && t.dueDate).map((t) => t.id),
    )
    for (const id of notifiedRef.current) {
      if (!activeIds.has(id)) notifiedRef.current.delete(id)
    }
  }, [todos])
}
