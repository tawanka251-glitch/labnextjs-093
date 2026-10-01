import { createComment, listComments } from '@/lib/commentService'
import { withErrorHandling } from '@/lib/withErrorHandling'

// READ ALL: GET /api/comments หรือ /api/comments?postId=123
export async function GET(request: Request) {
  const url = new URL(request.url)
  const postId = url.searchParams.get('postId') ?? undefined
  const comments = await listComments(postId)
  return Response.json({ comments })
}

// CREATE: POST /api/comments
export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json()
  const saved = await createComment(body)
  return Response.json({ ok: true, item: saved }, { status: 201 })
})