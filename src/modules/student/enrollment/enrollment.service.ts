import { prisma } from "../../../lib/prisma";
import { CourseStatus } from "../../../generated/prisma/client";
import AppError from "../../../errors/appError";
import httpStatus from "http-status";

const enrollInCourse = async (studentId: string, courseId: string) => {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    if (course.status !== CourseStatus.PUBLISHED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot enroll in a non-published course");
    }

    if (course.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot enroll in a deleted course");
    }

    // Check for existing enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId,
                courseId,
            },
        },
    });

    if (existingEnrollment) {
        throw new AppError(httpStatus.CONFLICT, "You are already enrolled in this course");
    }

    // Create enrollment
    const result = await prisma.enrollment.create({
        data: {
            studentId,
            courseId,
            status: "active",
            progressPercent: 0,
        },
    });

    return result;
};


const getEnrolledCourses = async (studentId: string) => {
    const result = await prisma.enrollment.findMany({
        where: { studentId },
        include: {
            course: {
                include: {
                    instructor: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: { enrolledAt: "desc" },
    });

    return result;
};

const getCourseLearningDetails = async (studentId: string, courseId: string) => {
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId,
                courseId,
            },
        },
        include: {
            course: {
                include: {
                    instructor: {
                        select: {
                            name: true,
                        },
                    },
                    lessons: {
                        where: { isDeleted: false },
                        orderBy: { orderIndex: "asc" },
                        include: {
                            completions: {
                                where: { studentId },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!enrollment) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not enrolled in this course");
    }

    // Format lessons to include isCompleted flag
    const lessons = enrollment.course.lessons.map((lesson) => {
        const { completions, ...lessonData } = lesson;
        return {
            ...lessonData,
            isCompleted: completions.length > 0,
        };
    });

    return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        instructor: enrollment.course.instructor,
        progressPercent: enrollment.progressPercent,
        lessons,
    };
};

export const EnrollmentService = {
    enrollInCourse,
    getEnrolledCourses,
    getCourseLearningDetails,
};
