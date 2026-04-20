import { z } from "zod";
import { QuestionOption } from "../../../generated/prisma/client";

const startAttemptZodSchema = z.object({
    params: z.object({
        quizId: z.string(),
    }),
});

const submitAttemptZodSchema = z.object({
    params: z.object({
        quizId: z.string(),
    }),
    body: z.object({
        answers: z.array(
            z.object({
                questionId: z.string(),
                selectedOption: z.nativeEnum(QuestionOption),
            })
        ).min(1, "At least one answer is required"),
    }),
});

export const QuizAttemptValidation = {
    startAttemptZodSchema,
    submitAttemptZodSchema,
};
