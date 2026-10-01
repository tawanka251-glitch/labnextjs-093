import { changePassword } from '@/lib/userService'

function getSessionUserId(request: Request) {
    const cookie = request.headers.get('cookie') || ''
    const match = cookie.match(/session=([^;]+)/)
    return match ? match[1] : undefined
}

export async function POST(request: Request) {
    try {
        const sessionUserId = getSessionUserId(request)
        const body = await request.json()

        await changePassword(sessionUserId, body)
        return Response.json({ ok: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' })
    } catch (err: any) {
        if (err.status === 403) {
            return Response.json({ error: err.message }, { status: 403 })
        }
        return Response.json({ error: err.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' }, { status: 400 })
    }
}