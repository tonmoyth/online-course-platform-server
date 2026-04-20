import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/chatchAsync";
import { LessonService } from "./lesson.service";
import sendResponse from "../../../shared/sendResponse";

const createLesson = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const instructorId = req.user?.id as string;
    const result = await LessonService.createLesson(courseId as string, instructorId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Lesson created successfully",
        data: result,
    });
});

const getLessonsByCourse = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const instructorId = req.user?.id as string;
    const result = await LessonService.getLessonsByCourse(courseId as string, instructorId, req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Lessons retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const updateLesson = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user?.id as string;
    const result = await LessonService.updateLesson(id as string, instructorId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Lesson updated successfully",
        data: result,
    });
});

const deleteLesson = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user?.id as string;
    const result = await LessonService.deleteLesson(id as string, instructorId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Lesson deleted successfully",
        data: result,
    });
});

const reorderLessons = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const instructorId = req.user?.id as string;
    const { lessons } = req.body;
    const result = await LessonService.reorderLessons(courseId as string, instructorId, lessons);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Lessons reordered successfully",
        data: result,
    });
});

export const LessonController = {
    createLesson,
    getLessonsByCourse,
    updateLesson,
    deleteLesson,
    reorderLessons,
};
