import { prisma } from "../../../lib/prisma";
import { CourseStatus } from "../../../generated/prisma/client";
import { QueryBuilder } from "../../../utils/quearyBuilder";
import { courseFilterableFields, courseSearchableFields } from "./course.constant";
import AppError from "../../../errors/appError";
import httpStatus from "http-status";

const getAllCourses = async (query: Record<string, any>) => {
    const courseQuery = new QueryBuilder(prisma.course, query, {
        searchableFields: courseSearchableFields,
        filterableFields: courseFilterableFields,
    })
        .search()
        .filter()
        .paginate()
        .sort()
        .where({
            status: CourseStatus.PUBLISHED,
            isDeleted: false,
        })
        .include({
            instructor: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },


        });

    const result = await courseQuery.execute();
    return result;
};

const getSingleCourse = async (id: string) => {
    const result = await prisma.course.findUnique({
        where: {
            id,
            status: CourseStatus.PUBLISHED,
            isDeleted: false,
        },
        include: {
            instructor: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
            lessons: {
                where: {
                    isDeleted: false,
                },
                orderBy: {
                    orderIndex: "asc",
                },
            },
        },
    });

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    // If course is PAID, do not return lessons for public discovery
    if (result.priceType === "PAID") {
        (result as any).lessons = [];
    }

    return result;
};

export const CourseDiscoveryService = {
    getAllCourses,
    getSingleCourse,
};
