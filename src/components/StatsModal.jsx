import { useEffect } from 'react'
import { computeStats, completionsByDay, byCategory, byPriority, computeStreak } from '../utils/statsHelpers'

export default function StatsModal({ todos, onClose }) {
  const stats = computeStats(todos)
  const days = completionsByDay(todos)
  const categories = byCategory(todos)
  const priorities = byPriority(todos)
  const streak = computeStreak(todos)
  const maxDayCount = Math.max(...days.map((d) => d.count), 1)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="stats-modal-overlay" onClick={onClose}>
      <div className="stats-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="สถิติงาน">
        <div className="stats-modal__header">
          <h2>📊 สถิติ</h2>
          <button className="btn btn--icon" onClick={onClose} aria-label="ปิด">✕</button>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <span className="stat-card__value">{stats.total}</span>
            <span className="stat-card__label">งานทั้งหมด</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{stats.done}</span>
            <span className="stat-card__label">เสร็จแล้ว</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{stats.rate}%</span>
            <span className="stat-card__label">อัตราสำเร็จ</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">🍅 {stats.totalPomodoros}</span>
            <span className="stat-card__label">Pomodoro รวม</span>
          </div>
        </div>

        <div className="stats-streak">
          🔥 <strong>{streak}</strong> วัน Streak ต่อเนื่อง
        </div>

        <section>
          <h3 className="stats-section-title">7 วันล่าสุด</h3>
          <div className="stats-bar-chart">
            {days.map((d) => (
              <div key={d.date} className="stats-bar-col">
                <span className="stats-bar-count">{d.count > 0 ? d.count : ''}</span>
                <div
                  className="stats-bar-fill"
                  style={{ height: `${(d.count / maxDayCount) * 100}%` }}
                />
                <span className="stats-bar-label">{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="stats-section-title">หมวดหมู่</h3>
          <div className="stats-rows">
            {categories.map((c) => (
              <div key={c.name} className="stats-row">
                <span className="stats-row__label">{c.name}</span>
                <div className="stats-row__bar">
                  <div
                    className="stats-row__fill"
                    style={{ width: c.total === 0 ? '0%' : `${(c.done / c.total) * 100}%` }}
                  />
                </div>
                <span className="stats-row__pct">
                  {c.total === 0 ? '-' : `${c.done}/${c.total}`}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="stats-section-title">ความสำคัญ</h3>
          <div className="stats-rows">
            {priorities.map((p) => (
              <div key={p.name} className="stats-row">
                <span className="stats-row__label">{p.name}</span>
                <div className="stats-row__bar">
                  <div
                    className="stats-row__fill"
                    style={{ width: p.total === 0 ? '0%' : `${(p.done / p.total) * 100}%` }}
                  />
                </div>
                <span className="stats-row__pct">
                  {p.total === 0 ? '-' : `${p.done}/${p.total}`}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
