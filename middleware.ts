import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    const sessionValue = sessionCookie?.value?.trim();

    // ถ้าไม่มี session ให้ redirect ไปหน้า login
    if (!sessionValue) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// ปรับให้ดักจับทั้ง /dashboard และ sub-routes ทั้งหมด
export const config = {
    matcher: ['/dashboard', '/dashboard/:path*']
};