import { editComment, getCommentById, removeComment } from '@/lib/commentService'
import { withErrorHandling } from '@/lib/withErrorHandling'

// READ ONE: GET /api/comments/[id]
export const GET = withErrorHandling(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const comment = await getCommentById(id)
    return Response.json({ comment })
  }
)

// UPDATE: PATCH /api/comments/[id]
export const PATCH = withErrorHandling(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const body = await request.json()
    const updated = await editComment(id, body)
    return Response.json({ ok: true, item: updated })
  }
)

// DELETE: DELETE /api/comments/[id]
export const DELETE = withErrorHandling(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    await removeComment(id)
    return Response.json({ ok: true, message: 'ลบความคิดเห็นสำเร็จ' })
  }
)