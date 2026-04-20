import { prisma } from "../../../lib/prisma";
import AppError from "../../../errors/appError";
import httpStatus from "http-status";

const createQuiz = async (courseId: string, instructorId: string, payload: any) => {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
    });

    if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, "Course not found");
    }

    if (course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to add a quiz to this course");
    }

    if (course.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot add a quiz to a deleted course");
    }

    const result = await prisma.quiz.create({
        data: {
            ...payload,
            courseId,
        },
    });

    return result;
};

const addQuestion = async (quizId: string, instructorId: string, payload: any) => {
    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: { course: true },
    });

    if (!quiz) {
        throw new AppError(httpStatus.NOT_FOUND, "Quiz not found");
    }

    if (quiz.course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to add questions to this quiz");
    }

    const result = await prisma.question.create({
        data: {
            ...payload,
            quizId,
        },
    });

    return result;
};

const updateQuestion = async (id: string, instructorId: string, payload: any) => {
    const question = await prisma.question.findUnique({
        where: { id },
        include: { quiz: { include: { course: true } } },
    });

    if (!question) {
        throw new AppError(httpStatus.NOT_FOUND, "Question not found");
    }

    if (question.quiz.course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to update this question");
    }

    const result = await prisma.question.update({
        where: { id },
        data: payload,
    });

    return result;
};

const deleteQuestion = async (id: string, instructorId: string) => {
    const question = await prisma.question.findUnique({
        where: { id },
        include: { quiz: { include: { course: true } } },
    });

    if (!question) {
        throw new AppError(httpStatus.NOT_FOUND, "Question not found");
    }

    if (question.quiz.course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to delete this question");
    }

    const result = await prisma.question.delete({
        where: { id },
    });

    return result;
};

const getQuizDetails = async (quizId: string, instructorId: string) => {
    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: { 
            course: true,
            questions: {
                orderBy: { orderIndex: "asc" }
            }
        },
    });

    if (!quiz) {
        throw new AppError(httpStatus.NOT_FOUND, "Quiz not found");
    }

    if (quiz.course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to view this quiz");
    }

    return quiz;
};

const getQuizAttempts = async (quizId: string, instructorId: string) => {
    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: { course: true },
    });

    if (!quiz) {
        throw new AppError(httpStatus.NOT_FOUND, "Quiz not found");
    }

    if (quiz.course.instructorId !== instructorId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to view attempts for this quiz");
    }

    const result = await prisma.quizAttempt.findMany({
        where: { quizId },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        },
        orderBy: { startedAt: "desc" }
    });

    return result;
};

export const QuizService = {
    createQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    getQuizDetails,
    getQuizAttempts,
};
