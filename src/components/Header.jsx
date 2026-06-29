export default function Header({ theme, onToggleTheme, onShowStats, remaining }) {
  return (
    <header className="header">
      <div>
        <h1>✅ รายการสิ่งที่ต้องทำ</h1>
        <p className="subtitle">
          {remaining > 0 ? `เหลืออีก ${remaining} งานที่ยังไม่เสร็จ` : 'เคลียร์งานหมดแล้ว! 🎉'}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          className="theme-toggle"
          onClick={onShowStats}
          title="ดูสถิติ"
          aria-label="ดูสถิติ"
        >
          📊
        </button>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title="สลับธีมสว่าง/มืด"
          aria-label="สลับธีม"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
