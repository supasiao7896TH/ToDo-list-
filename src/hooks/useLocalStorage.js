import { useState, useEffect } from 'react'

// sync state กับ localStorage โดยอัตโนมัติ
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // เพิกเฉยถ้าเขียนไม่ได้ (เช่น โหมดส่วนตัว)
    }
  }, [key, value])

  return [value, setValue]
}
