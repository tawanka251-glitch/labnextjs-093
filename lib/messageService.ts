import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { messageSchema } from './schemas'
import { ForbiddenError } from './errors'
import * as MessageModel from './messages'

// Task 4.2 — แทนที่การเช็ค if ทีละฟิลด์ด้วย Zod Validation Schema[cite: 2]
export async function createMessage(raw: unknown) {
  let data
  try {
    data = messageSchema.parse(raw)
  } catch (err) {
    if (err instanceof ZodError) {
      throw new Error(err.issues[0].message)
    }
    throw err
  }

  try {
    return await MessageModel.addMessage(data)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new Error('อีเมลนี้ถูกใช้แล้ว')
    }
    throw err
  }
}

// Task 4.3 — เพิ่มการตรวจ Authorization (เช็ค authorId) ก่อนอนุญาตให้แก้ไข[cite: 2]
export async function editMessage(id: string, updates: unknown, sessionUserId?: string) {
  const existingMessage = await MessageModel.getMessageById(id)
  if (!existingMessage) {
    return null
  }

  // ตรวจสอบว่าเป็นเจ้าของข้อความหรือไม่[cite: 2]
  if (existingMessage.authorId && existingMessage.authorId !== sessionUserId) {
    throw new ForbiddenError('คุณไม่มีสิทธิ์แก้ไขข้อความนี้')
  }

  try {
    // ใช้ Partial Validation จาก Zod Schema สำหรับการ Update[cite: 2]
    const validatedData = messageSchema.partial().parse(updates)
    return await MessageModel.updateMessage(id, validatedData as { message: string })
  } catch (err) {
    if (err instanceof ZodError) {
      throw new Error(err.issues[0].message)
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return null
    }
    throw err
  }
}

export async function listMessages(search?: string) {
  const all = await MessageModel.getMessages()
  if (!search) return all
  return all.filter(
    (m) => m.name.includes(search) || m.message.includes(search) || (m.tag && m.tag.includes(search))
  )
}


export async function getMessageById(id: string) {
  return await MessageModel.getMessageById(id)
}

// เพิ่ม Authorization Check ก่อนลบข้อความ[cite: 2]
export async function removeMessage(id: string, sessionUserId?: string) {
  const existingMessage = await MessageModel.getMessageById(id)
  if (!existingMessage) {
    return null
  }

  if (existingMessage.authorId && existingMessage.authorId !== sessionUserId) {
    throw new ForbiddenError('คุณไม่มีสิทธิ์ลบข้อความนี้')
  }

  try {
    return await MessageModel.deleteMessage(id)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return null
    }
    throw err
  }
}