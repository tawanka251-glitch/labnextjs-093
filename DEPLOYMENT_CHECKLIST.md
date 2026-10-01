# Workshop Week 12: Team Deployment Readiness

## 1. Deployment Readiness Checklist (5 ข้อ)

- [x] **1. Environment Variables Check**: ตรวจสอบว่าตั้งค่า `DATABASE_URL` (Pooled Connection จาก Neon) บน Vercel Dashboard ครบทั้ง 3 Scopes (Production, Preview, Development) แล้วเรียบร้อย
- [x] **2. Preview Deployment Testing**: ต้องทำการเปิด Pull Request (PR) เพื่อทดสอบฟังก์ชัน CRUD (สร้าง/อ่าน/แก้ไข/ลบ) บน Vercel Preview Link ให้ผ่านครบถ้วนก่อนตัดสินใจ Merge เข้า branch `main`
- [x] **3. Rollback Protocol & Authorization**: ตกลงบทบาทในทีมให้ชัดเจนว่าใครมีสิทธิ์กด **Instant Rollback** บน Vercel Deployments เมื่อ Production เกิดเหตุขัดข้อง
- [x] **4. Database Schema Migration Sync**: สั่งรัน Migration (`npx prisma migrate dev` / `npx prisma migrate deploy`) ทุกครั้งที่มีการแก้ไข `prisma/schema.prisma` เพื่อให้ตารางบน Neon PostgreSQL ตรงกับโค้ดล่าสุด
- [x] **5. Team Communication & Review**: มีการทำ Code Review และแจ้งสมาชิกในทีมก่อนที่จะทำการ Merge PR ขนาดใหญ่ หรือกด Rollback เสมอ

---

## 2. สรุปความพร้อมของโปรเจกต์ `my-blog` (Deployment Summary)

> โปรเจกต์ **my-blog** มีความพร้อมสำหรับการนำไปพัฒนาต่อเป็นฐานของ **Final Project** เนื่องจากได้รับการติดตั้งสถาปัตยกรรมแบบ 3 ชั้น (Controller → Service → Model) ร่วมกับ Prisma ORM และ PostgreSQL Database จริงบน Neon Cloud มีระบบความปลอดภัย (Password Hashing ด้วย bcrypt, XSS Sanitization ด้วย sanitize-html และ Input Validation ด้วย Zod) และมีกระบวนการ Deploy แบบอัตโนมัติผ่าน Vercel CI/CD ที่ช่วยลดความเสี่ยงจากการ Deploy พังด้วยระบบ Preview Deployment & Instant Rollback
