import { getCourseById, editCourse, removeCourse } from '@/lib/courseService';
import { withErrorHandling } from '@/lib/withErrorHandling';

export const GET = withErrorHandling(async (request: Request, { params }: { params: { id: string } }) => {
    const course = await getCourseById(params.id);
    return Response.json({ course });
});

export const PATCH = withErrorHandling(async (request: Request, { params }: { params: { id: string } }) => {
    const updates = await request.json();
    const updated = await editCourse(params.id, updates);
    return Response.json({ ok: true, item: updated });
});

export const DELETE = withErrorHandling(async (request: Request, { params }: { params: { id: string } }) => {
    await removeCourse(params.id);
    return Response.json({ ok: true }, { status: 200 });
});