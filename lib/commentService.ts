import { Prisma } from '@prisma/client'
import * as CommentModel from './comments'
import { cleanRichText } from './sanitize'

// Create + Validation + XSS Sanitization
export async function createComment(data: { postId: string; author: string; content: string }) {
  if (!data.postId || !data.author || !data.content || data.content.trim() === '') {
    const error: any = new Error('ข้อมูลไม่ครบ หรือเนื้อหาความคิดเห็นเป็นค่าว่าง')
    error.status = 400
    throw error
  }
  // XSS Prevention: กรองโค้ดอันตราย เช่น <script> ออกก่อนบันทึกเข้า DB
  const safeContent = cleanRichText(data.content)
  return await CommentModel.addComment({ ...data, content: safeContent })
}

// Read All (สามารถกรองตาม postId ได้)
export async function listComments(postId?: string) {
  return await CommentModel.getComments(postId)
}

// Read One
export async function getCommentById(id: string) {
  const comment = await CommentModel.getCommentById(id)
  if (!comment) {
    const error: any = new Error('ไม่พบความคิดเห็นนี้')
    error.status = 404
    throw error
  }
  return comment
}

// Update + Validation & Error Handling (P2025) + XSS Sanitization
export async function editComment(id: string, updates: Partial<{ content: string }>) {
  if (updates.content !== undefined && updates.content.trim() === '') {
    const error: any = new Error('ข้อความห้ามเป็นค่าว่าง')
    error.status = 400
    throw error
  }

  const safeUpdates = updates.content !== undefined 
    ? { ...updates, content: cleanRichText(updates.content) }
    : updates

  try {
    return await CommentModel.updateComment(id, safeUpdates)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      const error: any = new Error('ไม่พบความคิดเห็นนี้')
      error.status = 404
      throw error
    }
    throw err
  }
}

// Delete + Error Handling (P2025)
export async function removeComment(id: string) {
  try {
    await CommentModel.deleteComment(id)
    return true
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      const error: any = new Error('ไม่พบความคิดเห็นนี้')
      error.status = 404
      throw error
    }
    throw err
  }
}

// Reaction + Error Handling (P2025) (Workshop Week 11)
export async function reactComment(id: string, type: 'like' | 'heart') {
  try {
    return await CommentModel.reactToComment(id, type)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      const error: any = new Error('ไม่พบความคิดเห็นนี้')
      error.status = 404
      throw error
    }
    throw err
  }
}
