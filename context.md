# Context — ToDo List App

เอกสารสรุปบริบทของโปรเจกต์ สำหรับให้คนหรือ AI agent เข้าใจภาพรวมได้เร็ว

## ภาพรวม
แอปจัดการรายการสิ่งที่ต้องทำ (ToDo list) แบบ Single Page Application
- **Frontend:** React 18 + Vite 5 (ไม่มี backend)
- **Persistence:** เก็บข้อมูลทั้งหมดในเบราว์เซอร์ผ่าน `localStorage`
- **ภาษา UI:** ไทย
- **สถานะ:** ใช้งานได้สมบูรณ์ (build ผ่าน, ทดสอบบน Chromium แล้ว)

## ฟีเจอร์หลัก
| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| CRUD | เพิ่ม / แก้ไขแบบ inline / ลบ / ติ๊กว่าเสร็จ |
| Due date + แจ้งเตือน | ตั้งวันครบกำหนด, แจ้งเตือนผ่าน Browser Notification ล่วงหน้า 30 นาที, ไฮไลต์งานที่เลยกำหนด |
| หมวดหมู่ + ความสำคัญ | หมวด: งาน/ส่วนตัว/ช้อปปิ้ง/อื่นๆ — ความสำคัญ: สูง/กลาง/ต่ำ พร้อม badge สี |
| ค้นหา/กรอง/เรียง | กรองตามสถานะ, หมวด, ความสำคัญ; เรียงตามล่าสุด/วันครบ/ความสำคัญ |
| Dark mode | สลับธีมสว่าง/มืด, เคารพ `prefers-color-scheme`, จดจำค่าไว้ |

## โครงสร้างไฟล์
```
index.html              # entry HTML, lang="th"
vite.config.js          # ตั้งค่า Vite + plugin React
package.json            # scripts: dev / build / preview
src/
  main.jsx              # mount React root
  App.jsx               # state หลักทั้งหมด + layout + handlers (add/toggle/delete/update)
  index.css             # design tokens (CSS variables) + ธีม light/dark + ทุก style
  components/
    Header.jsx          # หัวข้อ + ตัวนับงานคงเหลือ + ปุ่มสลับธีม
    TodoForm.jsx        # ฟอร์มเพิ่มงานใหม่
    FilterBar.jsx       # ช่องค้นหา + dropdown กรอง/เรียง
    TodoList.jsx        # render รายการ (หรือ empty state)
    TodoItem.jsx        # 1 งาน: โหมดแสดง + โหมดแก้ไข inline
  hooks/
    useLocalStorage.js  # sync state กับ localStorage อัตโนมัติ
    useReminders.js     # ตรวจ due date เป็นระยะ + ยิง notification + ขอ permission
  utils/
    todoHelpers.js      # createId, formatDate, isOverdue, filterTodos, sortTodos + ค่าคงที่
```

## โครงสร้างข้อมูล (Todo object)
```js
{
  id: string,          // createId() — timestamp + random
  title: string,
  done: boolean,
  dueDate: string,     // ISO/datetime-local string หรือ '' ถ้าไม่ตั้ง
  category: string,    // หนึ่งใน CATEGORIES
  priority: string,    // 'high' | 'medium' | 'low'
  createdAt: string,   // ISO timestamp
}
```

## localStorage keys
- `todos` — array ของ todo objects
- `todo-theme` — `'light'` หรือ `'dark'`

## คำสั่งที่ใช้บ่อย
```bash
npm install      # ติดตั้ง dependencies
npm run dev      # dev server (http://localhost:5173)
npm run build    # build production ลง dist/
npm run preview  # ดูตัวอย่าง production build
```

## Git
- พัฒนาบน branch: `claude/todo-list-app-ogfomh`
