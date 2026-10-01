import { getMessageById, editMessage, removeMessage } from '@/lib/messageService'

// ฟังก์ชันดึง sessionUserId จาก Cookie [source: 2]
function getSessionUserId(request: Request) {
    const cookie = request.headers.get('cookie') || ''
    const match = cookie.match(/session=([^;]+)/)
    return match ? match[1] : undefined
}

// GET: ดึงข้อมูลข้อความตาม ID [source: 1]
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const message = await getMessageById(id) // [source: 1]
    if (!message) {
        return Response.json({ error: 'ไม่พบข้อความนี้' }, { status: 404 })
    }
    return Response.json({ message })
}

// PATCH: แก้ไขข้อความ พร้อมตรวจ Authorization [source: 2]
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const sessionUserId = getSessionUserId(request)
        const updates = await request.json()
        const updated = await editMessage(id, updates, sessionUserId)

        if (!updated) {
            return Response.json({ error: 'ไม่พบข้อความนี้' }, { status: 404 })
        }
        return Response.json({ ok: true, item: updated })
    } catch (err: any) {
        if (err.status === 403) {
            return Response.json({ error: err.message }, { status: 403 })
        }
        return Response.json({ error: err.message || 'เกิดข้อผิดพลาด' }, { status: 400 })
    }
}

// DELETE: ลบข้อความ พร้อมตรวจ Authorization [source: 2]
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const sessionUserId = getSessionUserId(request)
        const deleted = await removeMessage(id, sessionUserId)

        if (!deleted) {
            return Response.json({ error: 'ไม่พบข้อความนี้' }, { status: 404 })
        }
        return Response.json({ ok: true }, { status: 200 })
    } catch (err: any) {
        if (err.status === 403) {
            return Response.json({ error: err.message }, { status: 403 })
        }
        return Response.json({ error: err.message || 'เกิดข้อผิดพลาด' }, { status: 500 })
    }
}