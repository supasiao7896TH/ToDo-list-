// ค่าคงที่สำหรับความสำคัญและหมวดหมู่
export const PRIORITIES = [
  { value: 'high', label: 'สูง' },
  { value: 'medium', label: 'กลาง' },
  { value: 'low', label: 'ต่ำ' },
]

export const CATEGORIES = ['งาน', 'ส่วนตัว', 'ช้อปปิ้ง', 'อื่นๆ']

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

// สร้าง id แบบไม่ซ้ำ
export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// แปลงวันที่เป็นรูปแบบไทยอ่านง่าย
export function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// งานเลยกำหนด = มี dueDate, ยังไม่เสร็จ และเวลาผ่านไปแล้ว
export function isOverdue(todo) {
  if (!todo.dueDate || todo.done) return false
  return new Date(todo.dueDate).getTime() < Date.now()
}

// กรอง + ค้นหา ตามเงื่อนไขที่เลือก
export function filterTodos(todos, { search, status, category, priority }) {
  return todos.filter((t) => {
    if (search) {
      const q = search.trim().toLowerCase()
      if (q && !t.title.toLowerCase().includes(q)) return false
    }
    if (status === 'active' && t.done) return false
    if (status === 'completed' && !t.done) return false
    if (category !== 'all' && t.category !== category) return false
    if (priority !== 'all' && t.priority !== priority) return false
    return true
  })
}

// เรียงลำดับรายการ
export function sortTodos(todos, sortBy) {
  const list = [...todos]
  switch (sortBy) {
    case 'dueDate':
      return list.sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      })
    case 'priority':
      return list.sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
      )
    case 'created':
    default:
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}
