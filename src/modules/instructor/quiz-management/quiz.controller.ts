import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/chatchAsync";
import { QuizService } from "./quiz.service";
import sendResponse from "../../../shared/sendResponse";

const createQuiz = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const instructorId = req.user?.id as string;
    const result = await QuizService.createQuiz(courseId as string, instructorId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Quiz created successfully",
        data: result,
    });
});

const addQuestion = catchAsync(async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const instructorId = req.user?.id as string;
    const result = await QuizService.addQuestion(quizId as string, instructorId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Question added successfully",
        data: result,
    });
});

const updateQuestion = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user?.id as string;
    const result = await QuizService.updateQuestion(id as string, instructorId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Question updated successfully",
        data: result,
    });
});

const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user?.id as string;
    await QuizService.deleteQuestion(id as string, instructorId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Question deleted successfully",
        data: null,
    });
});

const getQuizDetails = catchAsync(async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const instructorId = req.user?.id as string;
    const result = await QuizService.getQuizDetails(quizId as string, instructorId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Quiz details retrieved successfully",
        data: result,
    });
});

const getQuizAttempts = catchAsync(async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const instructorId = req.user?.id as string;
    const result = await QuizService.getQuizAttempts(quizId as string, instructorId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Quiz attempts retrieved successfully",
        data: result,
    });
});

export const QuizController = {
    createQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    getQuizDetails,
    getQuizAttempts,
};
