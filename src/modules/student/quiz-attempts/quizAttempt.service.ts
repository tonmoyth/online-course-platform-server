import { prisma } from "../../../lib/prisma";
import { QuizAttemptsStatus } from "../../../generated/prisma/client";
import AppError from "../../../errors/appError";
import httpStatus from "http-status";

const startAttempt = async (studentId: string, quizId: string) => {
    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: { course: true },
    });

    if (!quiz) {
        throw new AppError(httpStatus.NOT_FOUND, "Quiz not found");
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            studentId_courseId: {
                studentId,
                courseId: quiz.courseId,
            },
        },
    });

    if (!enrollment) {
        throw new AppError(httpStatus.FORBIDDEN, "You must be enrolled in the course to take this quiz");
    }

    // Check max attempts
    if (quiz.maxAttempts) {
        const attemptCount = await prisma.quizAttempt.count({
            where: {
                studentId,
                quizId,
            },
        });

        if (attemptCount >= quiz.maxAttempts) {
            throw new AppError(httpStatus.CONFLICT, "You have reached the maximum number of attempts for this quiz");
        }
    }

    // Create new attempt
    const result = await prisma.quizAttempt.create({
        data: {
            studentId,
            quizId,
            status: QuizAttemptsStatus.IN_PROGRESS,
            startedAt: new Date(),
        },
    });

    return result;
};

const getQuizQuestions = async (studentId: string, quizId: string) => {
    // Verify active attempt
    const activeAttempt = await prisma.quizAttempt.findFirst({
        where: {
            studentId,
            quizId,
            status: QuizAttemptsStatus.IN_PROGRESS,
        },
    });

    if (!activeAttempt) {
        throw new AppError(httpStatus.BAD_REQUEST, "No active attempt found for this quiz. Please start an attempt first.");
    }

    const questions = await prisma.question.findMany({
        where: { quizId },
        select: {
            id: true,
            questionText: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            orderIndex: true,
        },
        orderBy: { orderIndex: "asc" },
    });

    return questions;
};

const submitAttempt = async (studentId: string, quizId: string, payload: { answers: any[] }) => {
    const activeAttempt = await prisma.quizAttempt.findFirst({
        where: {
            studentId,
            quizId,
            status: QuizAttemptsStatus.IN_PROGRESS,
        },
        include: {
            quiz: {
                include: {
                    questions: true,
                },
            },
        },
    });

    if (!activeAttempt) {
        throw new AppError(httpStatus.NOT_FOUND, "No active attempt found for this quiz");
    }

    // Timer logic
    if (activeAttempt.quiz.timeLimitMinutes) {
        const now = new Date();
        const expirationTime = new Date(activeAttempt.startedAt.getTime() + activeAttempt.quiz.timeLimitMinutes * 60000);
        
        if (now > expirationTime) {
            // Auto-submit or reject based on policy. Here we mark as AUTO_SUBMITTED but still calculate score if answers provided.
            // If answers provided after deadline, we might want to flag it.
        }
    }

    const quizQuestions = activeAttempt.quiz.questions;
    let correctCount = 0;
    const answerRecords: any[] = [];

    for (const submittedAnswer of payload.answers) {
        const question = quizQuestions.find((q) => q.id === submittedAnswer.questionId);
        if (question) {
            const isCorrect = question.correctOption === submittedAnswer.selectedOption;
            if (isCorrect) correctCount++;

            answerRecords.push({
                attemptId: activeAttempt.id,
                questionId: question.id,
                selectedOption: submittedAnswer.selectedOption,
                isCorrect,
            });
        }
    }

    const totalQuestions = quizQuestions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const isPassed = score >= activeAttempt.quiz.passingScore;

    // Transaction to save answers and update attempt
    const result = await prisma.$transaction(async (tx) => {
        await tx.attemptAnswer.createMany({
            data: answerRecords,
        });

        const updatedAttempt = await tx.quizAttempt.update({
            where: { id: activeAttempt.id },
            data: {
                score,
                isPassed,
                status: QuizAttemptsStatus.SUBMITTED,
                submittedAt: new Date(),
            },
        });

        return updatedAttempt;
    });

    return result;
};

const getAttemptResult = async (studentId: string, attemptId: string) => {
    const attempt = await prisma.quizAttempt.findUnique({
        where: { id: attemptId },
        include: {
            quiz: {
                include: {
                    questions: true,
                },
            },
            answers: {
                include: {
                    question: true,
                },
            },
        },
    });

    if (!attempt) {
        throw new AppError(httpStatus.NOT_FOUND, "Attempt not found");
    }

    if (attempt.studentId !== studentId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to view this attempt result");
    }

    return attempt;
};

const getAttemptHistory = async (studentId: string, quizId: string) => {
    const result = await prisma.quizAttempt.findMany({
        where: {
            studentId,
            quizId,
        },
        orderBy: { startedAt: "desc" },
    });

    return result;
};

export const QuizAttemptService = {
    startAttempt,
    getQuizQuestions,
    submitAttempt,
    getAttemptResult,
    getAttemptHistory,
};
