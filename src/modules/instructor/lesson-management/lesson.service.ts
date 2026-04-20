import { prisma } from "../../../lib/prisma";
import AppError from "../../../errors/appError";
import httpStatus from "http-status";
import { QueryBuilder } from "../../../utils/quearyBuilder";

const createLesson = async (courseId: string, instructorId: string, payload: any) => {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    if (course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to add lessons to this course");
    }

    if (course.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot add lessons to a deleted course");
    }

    // Auto-increment orderIndex if not provided
    if (payload.orderIndex === undefined) {
        const lastLesson = await prisma.lesson.findFirst({
            where: { courseId, isDeleted: false },
            orderBy: { orderIndex: "desc" },
        });
        payload.orderIndex = lastLesson ? lastLesson.orderIndex + 1 : 0;
    }

    const result = await prisma.lesson.create({
        data: {
            ...payload,
            courseId,
        },
    });

    return result;
};

const getLessonsByCourse = async (courseId: string, instructorId: string, query: Record<string, any>) => {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    if (course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to access these lessons");
    }

    const lessonQuery = new QueryBuilder(prisma.lesson, query, {
        searchableFields: ["title"],
        filterableFields: ["isFreePreview"],
    })
        .search()
        .filter()
        .paginate()
        .sort()
        .where({
            courseId,
            isDeleted: false,
        });

    const result = await lessonQuery.execute();
    return result;
};

const updateLesson = async (id: string, instructorId: string, payload: any) => {
    const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: { course: true },
    });

    if (!lesson) {
        throw new AppError(httpStatus.NOT_FOUND, "Lesson not found");
    }

    if (lesson.course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to update this lesson");
    }

    if (lesson.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot update a deleted lesson");
    }

    const result = await prisma.lesson.update({
        where: { id },
        data: payload,
    });

    return result;
};

const deleteLesson = async (id: string, instructorId: string) => {
    const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: { course: true },
    });

    if (!lesson) {
        throw new AppError(httpStatus.NOT_FOUND, "Lesson not found");
    }

    if (lesson.course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to delete this lesson");
    }

    if (lesson.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Lesson is already deleted");
    }

    const result = await prisma.lesson.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    return result;
};

const reorderLessons = async (courseId: string, instructorId: string, lessons: { id: string, orderIndex: number }[]) => {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    if (course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to reorder lessons in this course");
    }

    // Verify all lessons belong to the course
    const lessonIds = lessons.map(l => l.id);
    const existingLessons = await prisma.lesson.findMany({
        where: {
            id: { in: lessonIds },
            courseId,
            isDeleted: false,
        },
    });

    if (existingLessons.length !== lessonIds.length) {
        throw new AppError(httpStatus.BAD_REQUEST, "One or more lessons do not belong to this course or are deleted");
    }

    // Transactional bulk update
    const result = await prisma.$transaction(
        lessons.map((lesson) =>
            prisma.lesson.update({
                where: { id: lesson.id },
                data: { orderIndex: lesson.orderIndex },
            })
        )
    );

    return result;
};

export const LessonService = {
    createLesson,
    getLessonsByCourse,
    updateLesson,
    deleteLesson,
    reorderLessons,
};
