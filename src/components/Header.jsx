export default function Header({ theme, onToggleTheme, remaining }) {
  return (
    <header className="header">
      <div>
        <h1>✅ รายการสิ่งที่ต้องทำ</h1>
        <p className="subtitle">
          {remaining > 0 ? `เหลืออีก ${remaining} งานที่ยังไม่เสร็จ` : 'เคลียร์งานหมดแล้ว! 🎉'}
        </p>
      </div>
      <button
        className="theme-toggle"
        onClick={onToggleTheme}
        title="สลับธีมสว่าง/มืด"
        aria-label="สลับธีม"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  )
}
