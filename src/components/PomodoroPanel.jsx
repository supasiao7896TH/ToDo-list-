const SIZE = 120
const STROKE = 8
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

const PHASE_COLORS = {
  work: 'var(--primary)',
  'short-break': 'var(--low)',
  'long-break': '#06b6d4',
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function PomodoroPanel({
  phase,
  phaseLabel,
  secondsLeft,
  totalSeconds,
  isRunning,
  sessionsDone,
  activeTaskTitle,
  onPause,
  onResume,
  onStop,
}) {
  if (phase === 'idle') return null

  const progress = secondsLeft / totalSeconds
  const dashOffset = CIRC * (1 - progress)
  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const color = PHASE_COLORS[phase] ?? 'var(--primary)'

  return (
    <div className={`pomodoro-panel ${isRunning ? 'is-ticking' : ''}`}>
      <div className="pomodoro-panel__header">
        <span className="pomodoro-panel__phase">{phaseLabel}</span>
        {sessionsDone > 0 && (
          <span className="pomodoro-panel__sessions">🍅 × {sessionsDone}</span>
        )}
      </div>

      {activeTaskTitle && (
        <p className="pomodoro-panel__task" title={activeTaskTitle}>
          {activeTaskTitle}
        </p>
      )}

      <div className="pomodoro-ring">
        <svg width={SIZE} height={SIZE}>
          {/* track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="var(--border)"
            strokeWidth={STROKE}
          />
          {/* progress */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.8s linear' }}
          />
        </svg>
        <span className="pomodoro-ring__time" style={{ color }}>
          {pad(mins)}:{pad(secs)}
        </span>
      </div>

      <div className="pomodoro-panel__actions">
        {isRunning ? (
          <button className="btn btn--primary" onClick={onPause}>⏸ หยุดชั่วคราว</button>
        ) : (
          <button className="btn btn--primary" onClick={onResume}>▶ ต่อเลย</button>
        )}
        <button className="btn" onClick={onStop}>⏹ หยุด</button>
      </div>
    </div>
  )
}
