import { prisma } from "../../../lib/prisma";
import AppError from "../../../errors/appError";
import httpStatus from "http-status";

const updateCourseProgress = async (tx: any, studentId: string, courseId: string) => {
    // Get total lessons in course (excluding deleted)
    const totalLessons = await tx.lesson.count({
        where: {
            courseId,
            isDeleted: false,
        },
    });

    if (totalLessons === 0) return 0;

    // Get completed lessons count for this student
    const completedLessons = await tx.lessonCompletion.count({
        where: {
            studentId,
            lesson: {
                courseId,
            },
        },
    });

    const progressPercent = Math.floor((completedLessons / totalLessons) * 100);

    // Update Enrollment
    await tx.enrollment.update({
        where: {
            studentId_courseId: {
                studentId,
                courseId,
            },
        },
        data: {
            progressPercent,
        },
    });

    return progressPercent;
};

const markAsCompleted = async (studentId: string, lessonId: string) => {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
    });

    if (!lesson || lesson.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "Lesson not found");
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId,
                courseId: lesson.courseId,
            },
        },
    });

    if (!enrollment) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not enrolled in this course");
    }

    // Prevent duplicate completion
    const existingCompletion = await prisma.lessonCompletion.findUnique({
        where: {
            studentId_lessonId: {
                studentId,
                lessonId,
            },
        },
    });

    if (existingCompletion) {
        throw new AppError(httpStatus.CONFLICT, "Lesson already marked as completed");
    }

    const result = await prisma.$transaction(async (tx) => {
        // Create completion
        await tx.lessonCompletion.create({
            data: {
                studentId,
                lessonId,
            },
        });

        // Update progress
        const progressPercent = await updateCourseProgress(tx, studentId, lesson.courseId);

        return {
            lessonId,
            progressPercent,
        };
    });

    return result;
};

const unmarkAsCompleted = async (studentId: string, lessonId: string) => {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
    });

    if (!lesson) {
        throw new AppError(httpStatus.NOT_FOUND, "Lesson not found");
    }

    // Check if completion record exists
    const completion = await prisma.lessonCompletion.findUnique({
        where: {
            studentId_lessonId: {
                studentId,
                lessonId,
            },
        },
    });

    if (!completion) {
        throw new AppError(httpStatus.NOT_FOUND, "Completion record not found");
    }

    const result = await prisma.$transaction(async (tx) => {
        // Remove completion
        await tx.lessonCompletion.delete({
            where: {
                studentId_lessonId: {
                    studentId,
                    lessonId,
                },
            },
        });

        // Update progress
        const progressPercent = await updateCourseProgress(tx, studentId, lesson.courseId);

        return {
            lessonId,
            progressPercent,
        };
    });

    return result;
};

export const LessonCompletionService = {
    markAsCompleted,
    unmarkAsCompleted,
};
