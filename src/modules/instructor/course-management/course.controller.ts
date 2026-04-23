import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/chatchAsync";
import { CourseService } from "./course.service";
import sendResponse from "../../../shared/sendResponse";

const createCourse = catchAsync(async (req: Request, res: Response) => {
    const instructorId = req.user?.id as string;
    const result = await CourseService.createCourse(instructorId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Course created successfully",
        data: result,
    });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user?.id as string;
    const result = await CourseService.updateCourse(id as string, instructorId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course updated successfully",
        data: result,
    });
});

const submitCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user?.id as string;
    const result = await CourseService.submitCourse(id as string, instructorId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course submitted for review successfully",
        data: result,
    });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user?.id as string;
    const result = await CourseService.deleteCourse(id as string, instructorId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course deleted successfully",
        data: result,
    });
});

const getMyCourses = catchAsync(async (req: Request, res: Response) => {
    const instructorId = req.user?.id as string;
    const result = await CourseService.getMyCourses(instructorId, req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Courses retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getMyDraftCourses = catchAsync(async (req: Request, res: Response) => {
    const instructorId = req.user?.id as string;
    const result = await CourseService.getMyDraftCourses(instructorId, req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Draft courses retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getEnrolledStudents = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const instructorId = req.user?.id as string;
    const result = await CourseService.getEnrolledStudents(id as string, instructorId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Enrolled students retrieved successfully",
        data: result,
    });
});

export const CourseController = {
    createCourse,
    updateCourse,
    submitCourse,
    deleteCourse,
    getMyCourses,
    getMyDraftCourses,
    getEnrolledStudents,
};
