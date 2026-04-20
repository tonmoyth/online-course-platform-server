import { z } from "zod";

const rejectCourseZodSchema = z.object({
    body: z.object({
        remark: z.string().min(1, "Remark is required for rejection"),
    }),
});

export const AdminCourseValidation = {
    rejectCourseZodSchema,
};
