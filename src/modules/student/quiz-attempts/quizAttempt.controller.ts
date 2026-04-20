import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/chatchAsync";
import { QuizAttemptService } from "./quizAttempt.service";
import sendResponse from "../../../shared/sendResponse";

const startAttempt = catchAsync(async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const studentId = req.user?.id as string;
    const result = await QuizAttemptService.startAttempt(studentId, quizId as string);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Quiz attempt started successfully",
        data: result,
    });
});

const getQuizQuestions = catchAsync(async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const studentId = req.user?.id as string;
    const result = await QuizAttemptService.getQuizQuestions(studentId, quizId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Quiz questions retrieved successfully",
        data: result,
    });
});

const submitAttempt = catchAsync(async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const studentId = req.user?.id as string;
    const result = await QuizAttemptService.submitAttempt(studentId, quizId as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Quiz submitted successfully",
        data: result,
    });
});

const getAttemptResult = catchAsync(async (req: Request, res: Response) => {
    const { attemptId } = req.params;
    const studentId = req.user?.id as string;
    const result = await QuizAttemptService.getAttemptResult(studentId, attemptId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Quiz attempt result retrieved successfully",
        data: result,
    });
});

const getAttemptHistory = catchAsync(async (req: Request, res: Response) => {
    const { quizId } = req.params;
    const studentId = req.user?.id as string;
    const result = await QuizAttemptService.getAttemptHistory(studentId, quizId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Quiz attempt history retrieved successfully",
        data: result,
    });
});

export const QuizAttemptController = {
    startAttempt,
    getQuizQuestions,
    submitAttempt,
    getAttemptResult,
    getAttemptHistory,
};
