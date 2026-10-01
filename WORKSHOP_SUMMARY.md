# Workshop: Database Integration & CRUD Operations (Comment Resource)

## Task W.5 — Layer Mapping

| ชั้น (Layer) | ไฟล์ในโปรเจกต์ | หน้าที่ |
|---|---|---|
| **Controller** | `app/api/comments/route.ts`<br>`app/api/comments/[id]/route.ts` | รับ HTTP Request (GET, POST, PATCH, DELETE) ดึง params/body แล้วเรียกใช้ Service Layer และส่ง Response (JSON/Status Code) กลับไปยัง Client |
| **Service** | `lib/commentService.ts` | ทำหน้าที่เป็น Business Logic / Validation (เช่น เช็คว่าเนื้อหาไม่เป็นค่าว่าง) และดักจับ Prisma Error Code (`P2025` ไม่พบ ID) แปลงให้ตอบ Error/Status ที่เหมาะสม |
| **Model (Prisma)** | `lib/comments.ts` | ทำหน้าที่เป็น Data Access Layer เรียกใช้ `prisma.comment.*` เพื่อโต้ตอบกับ PostgreSQL DB จริง (`create`, `findMany`, `findUnique`, `update`, `delete`) |
| **Schema** | `prisma/schema.prisma` | กำหนดโครงสร้างตาราง `Comment` (Fields, Types, Constraints เช่น `@id @default(cuid())`, `createdAt DateTime @default(now())`) |

---

## Task W.6 — Reflection

### ข้อ 1: อธิบาย Resource ที่เลือกออกแบบ
> **ตอบ:** เลือกรีซอร์ส **Comment (ความคิดเห็น)** ประกอบด้วยฟิลด์:
> - `id` (String `@id @default(cuid())`): รหัสอ้างอิงความคิดเห็นที่ไม่ซ้ำกัน
> - `postId` (String): อ้างอิง ID ของโพสต์ที่คอมเมนต์ไปสังกัดอยู่
> - `author` (String): ชื่อผู้เขียนความคิดเห็น
> - `content` (String): ข้อความความคิดเห็น
> - `createdAt` (DateTime `@default(now())`): เวลาที่บันทึกข้อมูล
> 
> **เหตุผล:** เลือกชนิดข้อมูล `cuid()` สำหรับ `id` เพื่อป้องกันกรณี ID ชนกันเมื่อขยายระบบ และใช้ `@default(now())` สำหรับ `createdAt` เพื่อบันทึกเวลาสร้างแบบอัตโนมัติจากเซิร์ฟเวอร์

### ข้อ 2: จุดที่ต้องตัดสินใจระหว่างออกแบบ
> **ตอบ:** ได้ตัดสินใจเลือกจัดการกับกรณี Update/Delete ข้อความที่ไม่มีอยู่จริงในระบบ โดยในระดับ Service ได้ดักจับ Prisma Error Code `P2025` (Record to update/delete not found) แล้วแปลง Error เป็น HTTP 404 Not Found พร้อมข้อความที่สื่อความหมายชัดเจน เพื่อป้องกันไม่ให้ระบบส่ง Internal Server Error (HTTP 500) ออกไป

### ข้อ 3: เปรียบเทียบกับการใช้ Array ใน Week 8
> **ตอบ:** การเปลี่ยนมาใช้ฐานข้อมูลจริง (PostgreSQL + Prisma) ช่วยให้:
> 1. ข้อมูลคงทนถาวร (Persistence) ไม่สูญหายเมื่อเปิด-ปิด/Restart Dev Server
> 2. รองรับการเรียงลำดับ (`orderBy`), กรองข้อมูล (`where`) และสอบถามข้อมูลปริมาณมากอย่างมีประสิทธิภาพ
> 3. มีระบบ Schema & Type Safety ที่ชัดเจน และสามารถตรวจสอบความถูกต้องของข้อมูล (Data Integrity & Constraints) ได้ตั้งแต่ระดับการบันทึกข้อมูลเข้าฐานข้อมูล
