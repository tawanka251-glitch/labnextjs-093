import { createMessage, listMessages } from '@/lib/messageService'

// GET: ให้ Dashboard ดึงข้อมูลข้อความทั้งหมด [source: 1]
export async function GET() {
    try {
        const messages = await listMessages()
        return Response.json({ messages })
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 })
    }
}

// POST: รับข้อมูลจาก ContactForm บันทึกลง Prisma DB [source: 1, 2]
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const item = await createMessage(body)
        return Response.json({ ok: true, item }, { status: 201 })
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 })
    }
}