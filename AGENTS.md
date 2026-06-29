# AGENTS.md

แนวทางสำหรับ AI coding agent ที่ทำงานกับ repo นี้ (รองรับ Claude Code, Cursor,
และเครื่องมืออื่นที่อ่าน `AGENTS.md`) อ่าน `context.md` ประกอบเพื่อเข้าใจภาพรวม

## สแต็กและขอบเขต
- React 18 + Vite 5, JavaScript (ESM, ไฟล์ `.jsx`) — **ไม่มี TypeScript, ไม่มี backend**
- ข้อมูลทั้งหมดอยู่ใน `localStorage` ฝั่ง client เท่านั้น
- UI เป็นภาษาไทย — ข้อความที่ผู้ใช้เห็นให้เขียนเป็นภาษาไทย

## คำสั่งสำคัญ
```bash
npm install      # ติดตั้ง dependencies (ครั้งแรก)
npm run dev      # รัน dev server ที่ http://localhost:5173
npm run build    # ต้องผ่านก่อน commit เสมอ
```
**ก่อน commit ทุกครั้ง:** รัน `npm run build` ให้ผ่าน (ยังไม่มี test/linter ในโปรเจกต์)

## สไตล์โค้ด
- Functional components + React hooks เท่านั้น (ไม่ใช้ class component)
- ตั้งชื่อ component เป็น PascalCase, ไฟล์ตรงกับชื่อ component
- ใช้ named export สำหรับ hooks/utils, default export สำหรับ components
- คอมเมนต์สั้นๆ เป็นภาษาไทยตามสไตล์ที่มีอยู่
- **CSS:** ใช้ CSS variables (design tokens) ใน `src/index.css` เท่านั้น
  อย่า hardcode สี — ทุกสีต้องมาจากตัวแปร เพื่อให้ dark mode ทำงานถูก
- ไม่เพิ่ม dependency ใหม่โดยไม่จำเป็น (เป้าหมายคือ lightweight)

## รูปแบบ/แพตเทิร์นที่ต้องรักษา
- **State หลักอยู่ที่ `src/App.jsx`** แล้วส่งผ่าน props ลงไป — อย่ากระจาย global state
- การอ่าน/เขียนข้อมูลถาวรให้ผ่าน hook `useLocalStorage` เสมอ
- logic เกี่ยวกับ filter/sort/format วันที่/ค่าคงที่ อยู่ที่ `src/utils/todoHelpers.js`
  — เพิ่ม/แก้ที่นี่ อย่าเขียนซ้ำใน component
- หมวดหมู่และระดับความสำคัญมาจาก `CATEGORIES` / `PRIORITIES` ใน `todoHelpers.js`
  — แก้ที่เดียวแล้ว dropdown ทุกที่จะอัปเดตตาม
- ความสำคัญใช้ค่า `'high' | 'medium' | 'low'` (label ภาษาไทยแยกใน `PRIORITIES`)
- การแจ้งเตือนทั้งหมดอยู่ใน `useReminders` — กันการยิงซ้ำด้วย `notifiedRef`

## โครงสร้างข้อมูล Todo
ดูใน `context.md` — เมื่อเพิ่ม field ใหม่ ต้องอัปเดต: `TodoForm`, `TodoItem`
(โหมดแก้ไข), และ default object ใน `App.addTodo`

## Git
- พัฒนาบน branch `claude/todo-list-app-ogfomh`
- เขียน commit message ให้ชัดเจน อธิบายว่าทำอะไร
- **อย่าเปิด Pull Request เว้นแต่ผู้ใช้สั่ง** (เจ้าของจัดการ PR เอง)

## สิ่งที่ควรระวัง
- งานที่เลยกำหนด (`isOverdue`) นับเฉพาะงานที่ **ยังไม่เสร็จ** และมี `dueDate`
- ฟอร์แมตวันที่ใช้ locale `th-TH` (แสดงเป็น พ.ศ.) — ใช้ `formatDate` ที่มีอยู่
- Notification API ต้องขอ permission — จัดการแล้วใน `requestNotificationPermission`
