import { z } from "zod";
import { QuestionOption } from "../../../generated/prisma/client";

const createQuizZodSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        timeLimitMinutes: z.number().int().positive().optional(),
        passingScore: z.number().int().min(0).max(100).default(50),
        maxAttempts: z.number().int().positive().optional(),
    }),
});

const updateQuizZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        timeLimitMinutes: z.number().int().positive().optional(),
        passingScore: z.number().int().min(0).max(100).optional(),
        maxAttempts: z.number().int().positive().optional(),
    }),
});

const createQuestionZodSchema = z.object({
    body: z.object({
        questionText: z.string().min(1, "Question text is required"),
        optionA: z.string().min(1, "Option A is required"),
        optionB: z.string().min(1, "Option B is required"),
        optionC: z.string().min(1, "Option C is required"),
        optionD: z.string().min(1, "Option D is required"),
        correctOption: z.nativeEnum(QuestionOption),
        orderIndex: z.number().int().nonnegative().default(0),
    }),
});

const updateQuestionZodSchema = z.object({
    body: z.object({
        questionText: z.string().optional(),
        optionA: z.string().optional(),
        optionB: z.string().optional(),
        optionC: z.string().optional(),
        optionD: z.string().optional(),
        correctOption: z.nativeEnum(QuestionOption).optional(),
        orderIndex: z.number().int().nonnegative().optional(),
    }),
});

export const QuizValidation = {
    createQuizZodSchema,
    updateQuizZodSchema,
    createQuestionZodSchema,
    updateQuestionZodSchema,
};
