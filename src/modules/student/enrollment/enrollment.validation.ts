import { z } from "zod";

const enrollInCourseZodSchema = z.object({
    params: z.object({
        courseId: z.string(),
    }),
});

const completeLessonZodSchema = z.object({
    params: z.object({
        lessonId: z.string(),
    }),
});

export const EnrollmentValidation = {
    enrollInCourseZodSchema,
    completeLessonZodSchema,
};
