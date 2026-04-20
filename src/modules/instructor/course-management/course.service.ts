import { prisma } from "../../../lib/prisma";
import AppError from "../../../errors/appError";
import httpStatus from "http-status";
import { CourseStatus } from "../../../generated/prisma/client";
import { QueryBuilder } from "../../../utils/quearyBuilder";

const createCourse = async (instructorId: string, payload: any) => {
    const result = await prisma.course.create({
        data: {
            ...payload,
            instructorId,
            status: CourseStatus.DRAFT,
        },
    });

    return result;
};

const updateCourse = async (id: string, instructorId: string, payload: any) => {
    const course = await prisma.course.findUnique({
        where: { id },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    if (course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to update this course");
    }

    if (course.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot update a deleted course");
    }

    if (course.status === CourseStatus.PUBLISHED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot update a published course");
    }

    const result = await prisma.course.update({
        where: { id },
        data: payload,
    });

    return result;
};

const submitCourse = async (id: string, instructorId: string) => {
    const course = await prisma.course.findUnique({
        where: { id },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    if (course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to submit this course");
    }

    if (course.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot submit a deleted course");
    }

    if (course.status !== CourseStatus.DRAFT) {
        throw new AppError(httpStatus.CONFLICT, `Course is already in ${course.status} status`);
    }

    const result = await prisma.course.update({
        where: { id },
        data: {
            status: CourseStatus.PENDING,
        },
    });

    return result;
};

const deleteCourse = async (id: string, instructorId: string) => {
    const course = await prisma.course.findUnique({
        where: { id },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    if (course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to delete this course");
    }

    if (course.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Course is already deleted");
    }

    const result = await prisma.course.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    return result;
};

const getMyCourses = async (instructorId: string, query: Record<string, any>) => {
    const courseQuery = new QueryBuilder(prisma.course, query, {
        searchableFields: ["title", "category"],
        filterableFields: ["status", "difficulty", "priceType"],
    })
        .search()
        .filter()
        .paginate()
        .sort()
        .where({ 
            instructorId,
            isDeleted: false 
        });

    const result = await courseQuery.execute();
    return result;
};

const getEnrolledStudents = async (id: string, instructorId: string) => {
    const course = await prisma.course.findUnique({
        where: { id },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    if (course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to view students of this course");
    }

    const result = await prisma.enrollment.findMany({
        where: {
            courseId: id,
        },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    // Format the response to return student info directly
    return result.map((enrollment) => ({
        ...enrollment.student,
        enrollmentDate: enrollment.enrolledAt,
        status: enrollment.status,
    }));
};

export const CourseService = {
    createCourse,
    updateCourse,
    submitCourse,
    deleteCourse,
    getMyCourses,
    getEnrolledStudents,
};
