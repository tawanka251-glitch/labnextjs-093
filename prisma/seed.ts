import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // --- Lab 10: Task 1.2 Seed Admin User ที่ Hash รหัสผ่านแล้ว ---
  const hashed = await bcrypt.hash('1234', 10)
  await prisma.user.upsert({
    where: { email: 'admin@tsu.ac.th' },
    update: {},
    create: {
      email: 'admin@tsu.ac.th',
      password: hashed,
    },
  })

  // --- Lab 9: Seed Messages ข้อมูลเริ่มต้น ---
  await prisma.message.createMany({
    data: [
      { name: 'Alice', email: 'a@tsu.ac.th', message: 'สวัสดี 1' },
      { name: 'Bob', email: 'b@tsu.ac.th', message: 'Hello 2' },
    ],
    skipDuplicates: true,
  })

  // --- Workshop Week 9: Seed Courses ข้อมูลรายวิชา ---
  await prisma.course.createMany({
    data: [
      {
        code: 'CS101',
        name: 'Computer Programming I',
        credits: 3,
        instructor: 'ผศ.ดร. สมชาย ใจดี',
        description: 'ศึกษาพื้นฐานการเขียนโปรแกรม โครงสร้างการควบคุม ฟังก์ชัน อาร์เรย์',
        topics: ['Variables & Data Types', 'Control Structures', 'Functions', 'Arrays'],
      },
      {
        code: 'CS202',
        name: 'Data Structures & Algorithms',
        credits: 3,
        instructor: 'อ.ดร. สุภาพร วิทยากุล',
        description: 'ศึกษาโครงสร้างข้อมูลพื้นฐาน Stack, Queue, Tree และ Sorting Algorithms',
        topics: ['Big-O Analysis', 'Stack & Queue', 'Binary Search Tree', 'Sorting'],
      },
      {
        code: 'CS303',
        name: 'Web Development Technology',
        credits: 3,
        instructor: 'อ.วิชัย พัฒนซอฟต์',
        description: 'ศึกษาเทคโนโลยีเว็บ React, Next.js App Router และ REST API',
        topics: ['HTML/CSS & Tailwind', 'JavaScript/TypeScript', 'Next.js App Router', 'APIs'],
      },
    ],
    skipDuplicates: true,
  })

  // --- Workshop: Seed Comments ข้อมูลความคิดเห็น ---
  await prisma.comment.createMany({
    data: [
      {
        postId: 'post-1',
        author: 'สมชาย',
        content: 'บทความนี้มีประโยชน์มากครับ!',
      },
      {
        postId: 'post-1',
        author: 'สมหญิง',
        content: 'ขอบคุณสำหรับความรู้เรื่อง Prisma ครับ',
      },
      {
        postId: 'post-2',
        author: 'วิชัย',
        content: 'กำลังศึกษา Next.js อยู่พอดีเลยครับ',
      },
    ],
    skipDuplicates: true,
  })
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })