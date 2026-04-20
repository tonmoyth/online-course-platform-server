import { z } from "zod";

const markAsCompletedZodSchema = z.object({
    params: z.object({
        lessonId: z.string(),
    }),
});

export const LessonCompletionValidation = {
    markAsCompletedZodSchema,
};
