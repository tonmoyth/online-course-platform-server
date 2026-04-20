import { prisma } from "../../../lib/prisma";
import AppError from "../../../errors/appError";
import httpStatus from "http-status";
import { QueryBuilder } from "../../../utils/quearyBuilder";
import { courseFilterableFields, courseSearchableFields } from "../admin.constant";
import { CourseStatus } from "../../../generated/prisma/client";

const getAllCourses = async (query: Record<string, any>) => {
    const courseQuery = new QueryBuilder(
        prisma.course,
        query,
        {
            searchableFields: courseSearchableFields,
            filterableFields: courseFilterableFields
        }
    )
        .search()
        .filter()
        .paginate()
        .sort()
        .include({
            instructor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    enrollments: true,
                },
            },
        });

    const result = await courseQuery.execute();

    return result;
};

const approveCourse = async (id: string) => {
    const course = await prisma.course.findUnique({
        where: { id, isDeleted: false },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    if (course.status !== CourseStatus.PENDING) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Course cannot be approved from ${course.status} status`
        );
    }

    const result = await prisma.course.update({
        where: { id },
        data: {
            status: CourseStatus.PUBLISHED,
        },
    });

    return result;
};

const rejectCourse = async (id: string, payload: { remark: string }) => {
    const course = await prisma.course.findUnique({
        where: { id, isDeleted: false },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    if (course.status !== CourseStatus.PENDING) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Course cannot be rejected from ${course.status} status`
        );
    }

    const result = await prisma.course.update({
        where: { id },
        data: {
            status: CourseStatus.REJECTED,
        },
    });

    return result;
};

const unpublishCourse = async (id: string) => {
    const course = await prisma.course.findUnique({
        where: { id, isDeleted: false },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    const result = await prisma.course.update({
        where: { id },
        data: {
            status: CourseStatus.DRAFT,
        },
    });

    return result;
};

const softDeleteCourse = async (id: string) => {
    const course = await prisma.course.findUnique({
        where: { id, isDeleted: false },
        include: {
            _count: {
                select: {
                    enrollments: true,
                },
            },
        },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    if (course._count.enrollments > 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Cannot delete course with active enrollments"
        );
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

export const AdminCourseService = {
    getAllCourses,
    approveCourse,
    rejectCourse,
    unpublishCourse,
    softDeleteCourse,
};
