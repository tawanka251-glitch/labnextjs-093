# รายงานผลการปฏิบัติการ Lab บทที่ 11 - 12
**วิชา:** 0214321 Web Application Design and Development  
**ผู้จัดทำ:** ตะวัน แสงแก้ว | **รหัสนิสิต:** 6720210093  

---

## 📌 ส่วนที่ 1: สรุปผลการทดลอง Lab บทที่ 11 (Version Control, Collaborative Workflow & Code Review)

### 1.1 วัตถุประสงค์และการจำลอง Collaborative Workflow
ได้ทำการฝึกปฏิบัติตามแนวทางการทำงานร่วมกันผ่าน Git & GitHub แบบทีม (Collaborative Workflow) โดยใช้กระบวนการจำลอง 2 บทบาทผ่าน Feature Branch เพื่อเรียนรู้การจัดการ Branch, การแก้ปัญหา Merge Conflict และการทำ Code Review

### 1.2 สรุปการดำเนินงานตาม Task (L0 - L4)
- **Branch Management (L0-L1)**: สร้าง Branch `feature/message-tag` เพื่อเพิ่มฟิลด์ `tag` ใน `Message` model และสร้าง Branch `feature/message-search` เพื่อเพิ่มระบบค้นหาข้อความ
- **Merge Conflict Resolution (L2)**: ทำการจงใจสร้าง Conflict ในไฟล์ `lib/messageService.ts` โดยการแก้ไขฟังก์ชัน `listMessages` ในบรรทัดเดียวกัน แล้วสั่ง `git merge main` ซึ่งเกิดข้อผิดพลาด:
  ```text
  CONFLICT (content): Merge conflict in lib/messageService.ts
  ```
  จากนั้นทำการแก้ไข Conflict Marker (`<<<<<<<`, `=======`, `>>>>>>>`) ด้วยมือ โดยเลือกรวมโค้ดการค้นหาข้อความร่วมกับฟิลด์ `tag` ให้ถูกต้องสมบูรณ์
- **Pull Request & Code Review (L3-L4)**: เปิด Pull Request (PR) บน GitHub และทำการสลับบทบาทตรวจรีวิวโค้ด (Code Review) พร้อมเขียนคอมเมนต์เสนอแนะ และกด Approve เพื่อ Merge เข้าสู่ branch `main`

### 1.3 สรุป Workshop บทที่ 11 (Comment Reaction Feature)
- **ฟีเจอร์ที่พัฒนาเพิ่มเติม**: ต่อยอดระบบความคิดเห็น (Comment Resource) ให้รองรับการกด **Reaction อีโมจิ 👍 (Like) และ ❤️ (Heart)**
- **การปรับปรุงระดับ Database & API**:
  - เพิ่มฟิลด์ `likes Int @default(0)` และ `hearts Int @default(0)` ใน `schema.prisma` พร้อมสั่ง Migrate ลงฐานข้อมูล PostgreSQL
  - เพิ่ม API Endpoint `POST /api/comments/[id]/react` เพื่อรองรับการกด Reaction แบบเรียลไทม์
  - อัปเดตหน้า UI (`/comments`) แสดงปุ่มกดอีโมจิพร้อมตัวเลขนับจำนวน Reaction

---

## 📌 ส่วนที่ 2: สรุปผลการทดลอง Lab บทที่ 12 (Deployment & Vercel)

### 2.1 สรุปการตั้งค่า Environment Variables (L0 - L1)
ทำการตั้งค่าการเชื่อมต่อ Vercel กับ Neon PostgreSQL Database โดยการกำหนด Environment Variable `DATABASE_URL` ใน Vercel Project Settings ครอบคลุมทั้ง 3 Scopes: **Production, Preview, และ Development** เพื่อให้แอปพลิเคชันอ่านค่าฐานข้อมูลบน Cloud ได้อย่างถูกต้อง

### 2.2 การทดสอบผ่าน Preview Deployment & Instant Rollback (L2 - L4)
- **Preview Deployment**: เมื่อทำการ push branch ใหม่และเปิด Pull Request ระบบ Vercel CI/CD จะสร้าง Preview Link ให้อัตโนมัติ เพื่อทดสอบการทำงานของ CRUD ก่อนทำการ Merge เข้า `main`
- **Instant Rollback (เมื่อเกิดเหตุพัง)**: ได้ทดสอบจำลองกรณี Deployment ล้มเหลวโดยการดู Runtime Logs ใน Vercel Dashboard เพื่ออ่านสาเหตุการขัดข้อง และใช้ฟีเจอร์ **Instant Rollback** (*Promote to Production*) ในการสลับเวอร์ชันของแอปพลิเคชันกลับไปยังเวอร์ชันที่สมบูรณ์ก่อนหน้าได้อย่างรวดเร็ว

---

## 📋 2.3 Deployment Readiness Checklist (Workshop Week 12)

| ข้อที่ | รายการตรวจสอบ (Checklist Item) | สถานะ | รายละเอียด |
|---|---|---|---|
| **1** | **Environment Variables Check** | ✅ ผ่าน | ตั้งค่า `DATABASE_URL` (Pooled Connection จาก Neon) บน Vercel ครบทุก Scope แล้ว |
| **2** | **Preview Deployment Testing** | ✅ ผ่าน | ทดสอบฟังก์ชัน CRUD บน Vercel Preview Link ครบถ้วนก่อน Merge เข้า `main` |
| **3** | **Rollback Protocol & Authorization** | ✅ ผ่าน | กำหนดขั้นตอนและผู้มีสิทธิ์กด Instant Rollback บน Vercel เมื่อเกิดเหตุพัง |
| **4** | **Database Schema Migration Sync** | ✅ ผ่าน | สั่งรัน `npx prisma migrate dev` / `deploy` ทุกครั้งที่มีการปรับปรุง Schema |
| **5** | **Team Communication & Review** | ✅ ผ่าน | มีกระบวนการ Code Review และแจ้งทีมล่วงหน้าก่อน Merge PR หรือกด Rollback |

### 2.4 สรุปประเมินความพร้อมของโปรเจกต์ (Deployment Summary)
> โปรเจกต์ **my-blog** มีความพร้อมสำหรับการนำไปพัฒนาต่อเป็นฐานของ **Final Project** เนื่องจากได้รับการติดตั้งสถาปัตยกรรมแบบ 3 ชั้น (Controller → Service → Model) ร่วมกับ Prisma ORM และ PostgreSQL Database จริงบน Neon Cloud มีระบบความปลอดภัย (Password Hashing ด้วย bcrypt, XSS Sanitization ด้วย sanitize-html และ Input Validation ด้วย Zod) และมีกระบวนการ Deploy แบบอัตโนมัติผ่าน Vercel CI/CD ที่ช่วยลดความเสี่ยงจากการ Deploy พังด้วยระบบ Preview Deployment & Instant Rollback
