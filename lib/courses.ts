import { prisma } from './prisma';
import { Course, Prisma } from '@prisma/client';

export type { Course };

export async function getCourses(): Promise<Course[]> {
    return await prisma.course.findMany({
        orderBy: { code: 'asc' },
    });
}

export async function getCourseById(id: string): Promise<Course | null> {
    return await prisma.course.findUnique({
        where: { id },
    });
}

// ใช้ Prisma.CourseCreateInput แทน Omit เพื่อให้ Type ตรงกับ Prisma Schema
export async function addCourse(data: Prisma.CourseCreateInput): Promise<Course> {
    return await prisma.course.create({
        data,
    });
}

export async function updateCourse(id: string, updates: Prisma.CourseUpdateInput): Promise<Course | null> {
    return await prisma.course.update({
        where: { id },
        data: updates,
    });
}

export async function deleteCourse(id: string): Promise<boolean> {
    await prisma.course.delete({
        where: { id },
    });
    return true;
}