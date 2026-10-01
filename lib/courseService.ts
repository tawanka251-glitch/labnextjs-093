import * as CourseModel from './courses';
import { ValidationError, NotFoundError } from './errors';
import { Prisma } from '@prisma/client';

export async function listCourses(search?: string) {
    const all = await CourseModel.getCourses();
    if (!search) return all;
    return all.filter(
        (c) =>
            c.code.toLowerCase().includes(search.toLowerCase()) ||
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.instructor.toLowerCase().includes(search.toLowerCase())
    );
}

export async function getCourseById(id: string) {
    const course = await CourseModel.getCourseById(id);
    if (!course) {
        throw new NotFoundError('ไม่พบรายวิชานี้ในระบบ');
    }
    return course;
}

export async function createCourse(data: {
    code: string;
    name: string;
    credits: number;
    instructor: string;
    description: string;
    topics: string[];
}) {
    if (!data.code || data.code.trim() === '') {
        throw new ValidationError('รหัสวิชาห้ามเป็นค่าว่าง');
    }
    if (!data.name || data.name.trim() === '') {
        throw new ValidationError('ชื่อวิชาห้ามเป็นค่าว่าง');
    }
    if (data.credits === undefined || data.credits <= 0) {
        throw new ValidationError('หน่วยกิตต้องมากกว่า 0');
    }

    try {
        return await CourseModel.addCourse({
            code: data.code,
            name: data.name,
            credits: data.credits,
            instructor: data.instructor || '',
            description: data.description || '',
            topics: data.topics || [],
        });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new ValidationError('รหัสวิชานี้ถูกใช้ในระบบแล้ว');
        }
        throw err;
    }
}

export async function editCourse(
    id: string,
    updates: Partial<{
        code: string;
        name: string;
        credits: number;
        instructor: string;
        description: string;
        topics: string[];
    }>
) {
    if (updates.code !== undefined && updates.code.trim() === '') {
        throw new ValidationError('รหัสวิชาห้ามเป็นค่าว่าง');
    }
    if (updates.name !== undefined && updates.name.trim() === '') {
        throw new ValidationError('ชื่อวิชาห้ามเป็นค่าว่าง');
    }
    if (updates.credits !== undefined && updates.credits <= 0) {
        throw new ValidationError('หน่วยกิตต้องมากกว่า 0');
    }

    try {
        return await CourseModel.updateCourse(id, updates);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('ไม่พบรายวิชานี้ในระบบ');
        }
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new ValidationError('รหัสวิชานี้ถูกใช้ในระบบแล้ว');
        }
        throw err;
    }
}

export async function removeCourse(id: string) {
    try {
        return await CourseModel.deleteCourse(id);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('ไม่พบรายวิชานี้ในระบบ');
        }
        throw err;
    }
}