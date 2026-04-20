import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/chatchAsync";
import { LessonCompletionService } from "./lessonCompletion.service";
import sendResponse from "../../../shared/sendResponse";

const markAsCompleted = catchAsync(async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const studentId = req.user?.id as string;
    const result = await LessonCompletionService.markAsCompleted(studentId, lessonId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Lesson marked as completed",
        data: result,
    });
});

const unmarkAsCompleted = catchAsync(async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const studentId = req.user?.id as string;
    const result = await LessonCompletionService.unmarkAsCompleted(studentId, lessonId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Lesson unmarked as completed",
        data: result,
    });
});

export const LessonCompletionController = {
    markAsCompleted,
    unmarkAsCompleted,
};
