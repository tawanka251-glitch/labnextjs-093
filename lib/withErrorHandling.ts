type Handler = (req: Request, ctx: any) => Promise<Response>;

export function withErrorHandling(handler: Handler): Handler {
    return async (req, ctx) => {
        try {
            return await handler(req, ctx);
        } catch (err) {
            console.error('API Error:', err);

            // อ่าน status จาก Custom Error (ถ้าไม่มีให้ใช้ 500)
            const status = (err as any).status ?? 500;

            // ส่งข้อความ Error ที่เกิดขึ้นจริงกลับไปแทนข้อความคงที่
            return Response.json(
                { error: (err as Error).message },
                { status }
            );
        }
    };
}