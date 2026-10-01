import { listCourses, createCourse } from '@/lib/courseService';
import { withErrorHandling } from '@/lib/withErrorHandling';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || undefined;
    const courses = await listCourses(search);
    return Response.json({ courses });
}

export const POST = withErrorHandling(async (request: Request) => {
    const body = await request.json();
    const saved = await createCourse(body);
    return Response.json({ ok: true, item: saved }, { status: 201 });
});