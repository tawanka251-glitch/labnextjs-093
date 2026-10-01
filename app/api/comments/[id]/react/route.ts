import { reactComment } from '@/lib/commentService'
import { withErrorHandling } from '@/lib/withErrorHandling'

// POST /api/comments/[id]/react
export const POST = withErrorHandling(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const body = await request.json()
    const type = body.type === 'heart' ? 'heart' : 'like'

    const updated = await reactComment(id, type)
    return Response.json({ ok: true, item: updated })
  }
)
