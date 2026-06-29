import { PRIORITIES, CATEGORIES } from '../utils/todoHelpers'

export default function FilterBar({ filters, onChange }) {
  const set = (field) => (e) => onChange({ ...filters, [field]: e.target.value })

  return (
    <div className="filter-bar">
      <input
        type="search"
        placeholder="🔍 ค้นหางาน..."
        value={filters.search}
        onChange={set('search')}
        className="filter-bar__search"
      />
      <select value={filters.status} onChange={set('status')}>
        <option value="all">ทั้งหมด</option>
        <option value="active">ยังไม่เสร็จ</option>
        <option value="completed">เสร็จแล้ว</option>
      </select>
      <select value={filters.category} onChange={set('category')}>
        <option value="all">ทุกหมวด</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select value={filters.priority} onChange={set('priority')}>
        <option value="all">ทุกความสำคัญ</option>
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
      <select value={filters.sortBy} onChange={set('sortBy')}>
        <option value="created">เรียง: ล่าสุด</option>
        <option value="dueDate">เรียง: กำหนดส่ง</option>
        <option value="priority">เรียง: ความสำคัญ</option>
      </select>
    </div>
  )
}
