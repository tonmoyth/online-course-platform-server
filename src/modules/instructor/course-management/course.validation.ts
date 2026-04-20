import { z } from "zod";
import { CourseDifficulty, PriceType } from "../../../generated/prisma/client";

const createCourseZodSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        category: z.string().optional(),
        thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
        difficulty: z.nativeEnum(CourseDifficulty).default(CourseDifficulty.Beginner),
        priceType: z.nativeEnum(PriceType).default(PriceType.FREE),
        price: z.number().nonnegative().optional(),
    }).refine((data) => {
        if (data.priceType === PriceType.PAID && (data.price === undefined || data.price <= 0)) {
            return false;
        }
        return true;
    }, {
        message: "Price is required and must be greater than 0 for PAID courses",
        path: ["price"],
    }).refine((data) => {
        if (data.priceType === PriceType.FREE && data.price !== undefined && data.price !== 0) {
            return false;
        }
        return true;
    }, {
        message: "Price must be 0 or omitted for FREE courses",
        path: ["price"],
    }),
});

const updateCourseZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
        difficulty: z.nativeEnum(CourseDifficulty).optional(),
        priceType: z.nativeEnum(PriceType).optional(),
        price: z.number().nonnegative().optional(),
    }).refine((data) => {
        // Only validate if priceType or price is provided
        if (data.priceType === PriceType.PAID && data.price !== undefined && data.price <= 0) {
            return false;
        }
        return true;
    }, {
        message: "Price must be greater than 0 for PAID courses",
        path: ["price"],
    }),
});

export const CourseValidation = {
    createCourseZodSchema,
    updateCourseZodSchema,
};
