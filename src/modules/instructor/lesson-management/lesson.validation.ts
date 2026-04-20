import { z } from "zod";

const createLessonZodSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        content: z.string().optional(),
        videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
        fileUrl: z.string().url("Invalid file URL").optional().or(z.literal("")),
        orderIndex: z.number().int().nonnegative().optional(),
        isFreePreview: z.boolean().default(false),
    }),
});

const updateLessonZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
        fileUrl: z.string().url("Invalid file URL").optional().or(z.literal("")),
        orderIndex: z.number().int().nonnegative().optional(),
        isFreePreview: z.boolean().optional(),
    }),
});

const reorderLessonsZodSchema = z.object({
    body: z.object({
        lessons: z.array(
            z.object({
                id: z.string().min(1, "Lesson ID is required"),
                orderIndex: z.number().int().nonnegative(),
            })
        ).min(1, "At least one lesson is required for reordering"),
    }),
});

export const LessonValidation = {
    createLessonZodSchema,
    updateLessonZodSchema,
    reorderLessonsZodSchema,
};
