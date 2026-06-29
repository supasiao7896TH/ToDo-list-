# ✅ ToDo List App

แอปจัดการรายการสิ่งที่ต้องทำ (ToDo list) สร้างด้วย **React + Vite**
เก็บข้อมูลในเครื่องผู้ใช้ผ่าน `localStorage` — ไม่ต้องมี backend

## ฟีเจอร์
- **CRUD พื้นฐาน** — เพิ่ม / แก้ไข (inline) / ลบ / ติ๊กว่าเสร็จ
- **กำหนดวันครบ + แจ้งเตือน** — ตั้ง due date และแจ้งเตือนผ่าน Browser Notification
  ล่วงหน้า 30 นาที (และเมื่อเลยกำหนด งานจะถูกไฮไลต์สีแดง)
- **หมวดหมู่ / ความสำคัญ** — จัดกลุ่มงาน (งาน, ส่วนตัว, ช้อปปิ้ง, อื่นๆ)
  และตั้งระดับความสำคัญ (สูง / กลาง / ต่ำ) พร้อม badge สี
- **ค้นหา / กรอง / เรียงลำดับ** — ตามสถานะ, หมวด, ความสำคัญ, วันครบกำหนด
- **Dark mode** — สลับธีมสว่าง/มืด เคารพค่าระบบ และจำค่าไว้
- **บันทึกอัตโนมัติ** — ข้อมูลคงอยู่หลังรีเฟรชหน้าด้วย `localStorage`
- **PWA** — ติดตั้งลงเครื่อง/มือถือได้ (Add to Home Screen) และใช้งานได้แบบ **ออฟไลน์** (service worker + manifest ผ่าน `vite-plugin-pwa`)

## เริ่มต้นใช้งาน
```bash
npm install
npm run dev      # เปิด dev server
npm run build    # build สำหรับ production
npm run preview  # ดูตัวอย่าง production build
```

## โครงสร้าง
```
src/
  App.jsx              # state หลักและ layout
  components/          # Header, TodoForm, FilterBar, TodoList, TodoItem
  hooks/               # useLocalStorage, useReminders
  utils/todoHelpers.js # filter, sort, format วันที่, ค่าคงที่
  index.css            # design tokens + ธีม light/dark
```
