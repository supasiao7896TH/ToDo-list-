import { useCallback, useRef, useState } from 'react'
import { requestNotificationPermission } from './useReminders'

const DURATIONS = {
  work: 25 * 60,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
}

const PHASE_LABELS = {
  work: 'กำลังโฟกัส',
  'short-break': 'พักสั้น',
  'long-break': 'พักยาว',
}

// beep สั้นๆ ผ่าน Web Audio API ไม่ต้อง import ไฟล์เสียง
function beep(frequency = 880, duration = 0.3) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = frequency
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {
    // เพิกเฉยถ้า AudioContext ไม่รองรับ
  }
}

function notify(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body })
  }
}

export function usePomodoro(onSessionComplete) {
  const [phase, setPhase] = useState('idle') // 'idle' | 'work' | 'short-break' | 'long-break'
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsDone, setSessionsDone] = useState(0)

  const taskIdRef = useRef(null)
  const taskTitleRef = useRef('')
  const phaseRef = useRef('idle')
  const secondsRef = useRef(DURATIONS.work)
  const sessionsDoneRef = useRef(0)
  const intervalRef = useRef(null)

  const clearTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const transitionTo = useCallback((nextPhase) => {
    clearTick()
    phaseRef.current = nextPhase
    const secs = DURATIONS[nextPhase]
    secondsRef.current = secs
    setPhase(nextPhase)
    setSecondsLeft(secs)
    setIsRunning(false)
  }, [])

  const tick = useCallback(() => {
    secondsRef.current -= 1
    setSecondsLeft(secondsRef.current)

    if (secondsRef.current > 0) return

    // หมดเวลา
    beep()
    clearTick()

    if (phaseRef.current === 'work') {
      const newCount = sessionsDoneRef.current + 1
      sessionsDoneRef.current = newCount
      setSessionsDone(newCount)
      onSessionComplete?.(taskIdRef.current)
      notify('✅ หมดเวลาโฟกัส!', `"${taskTitleRef.current}" — ได้เวลาพักแล้ว 🎉`)

      const nextPhase = newCount % 4 === 0 ? 'long-break' : 'short-break'
      transitionTo(nextPhase)
    } else {
      notify('▶️ หมดเวลาพัก!', `พร้อมโฟกัสต่อกับ "${taskTitleRef.current}" แล้วหรือยัง?`)
      transitionTo('work')
    }
  }, [onSessionComplete, transitionTo])

  const startTick = useCallback(() => {
    clearTick()
    intervalRef.current = setInterval(tick, 1000)
    setIsRunning(true)
  }, [tick])

  const start = useCallback(
    (taskId, taskTitle) => {
      requestNotificationPermission()
      taskIdRef.current = taskId
      taskTitleRef.current = taskTitle || ''
      sessionsDoneRef.current = 0
      setSessionsDone(0)
      phaseRef.current = 'work'
      secondsRef.current = DURATIONS.work
      setPhase('work')
      setSecondsLeft(DURATIONS.work)
      clearTick()
      intervalRef.current = setInterval(tick, 1000)
      setIsRunning(true)
    },
    [tick],
  )

  const pause = useCallback(() => {
    clearTick()
    setIsRunning(false)
  }, [])

  const resume = useCallback(() => {
    startTick()
  }, [startTick])

  const stop = useCallback(() => {
    clearTick()
    taskIdRef.current = null
    taskTitleRef.current = ''
    phaseRef.current = 'idle'
    secondsRef.current = DURATIONS.work
    sessionsDoneRef.current = 0
    setPhase('idle')
    setSecondsLeft(DURATIONS.work)
    setIsRunning(false)
    setSessionsDone(0)
  }, [])

  return {
    phase,
    phaseLabel: PHASE_LABELS[phase] ?? '',
    secondsLeft,
    totalSeconds: DURATIONS[phase] ?? DURATIONS.work,
    isRunning,
    sessionsDone,
    activeTaskId: taskIdRef.current,
    start,
    pause,
    resume,
    stop,
  }
}
