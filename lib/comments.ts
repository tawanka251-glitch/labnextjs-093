import { prisma } from './prisma'

export interface Comment {
  id: string
  postId: string
  author: string
  content: string
  createdAt: Date
}

// CREATE
export async function addComment(data: { postId: string; author: string; content: string }) {
  return prisma.comment.create({
    data,
  })
}

// READ ALL (รองรับการกรองด้วย postId)
export async function getComments(postId?: string) {
  return prisma.comment.findMany({
    where: postId ? { postId } : undefined,
    orderBy: { createdAt: 'desc' },
  })
}

// READ ONE
export async function getCommentById(id: string) {
  return prisma.comment.findUnique({
    where: { id },
  })
}

// UPDATE
export async function updateComment(id: string, updates: { content?: string }) {
  return prisma.comment.update({
    where: { id },
    data: updates,
  })
}

// DELETE
export async function deleteComment(id: string) {
  return prisma.comment.delete({
    where: { id },
  })
}

// REACTION (Workshop Week 11)
export async function reactToComment(id: string, type: 'like' | 'heart') {
  return prisma.comment.update({
    where: { id },
    data: {
      likes: type === 'like' ? { increment: 1 } : undefined,
      hearts: type === 'heart' ? { increment: 1 } : undefined,
    },
  })
}
