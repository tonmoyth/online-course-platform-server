import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/chatchAsync";
import { AdminCourseService } from "./course.service";
import sendResponse from "../../../shared/sendResponse";

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminCourseService.getAllCourses(req.query);
    console.log("data", result.data);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All courses retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const approveCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminCourseService.approveCourse(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course approved successfully",
        data: result,
    });
});

const rejectCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminCourseService.rejectCourse(id as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course rejected successfully",
        data: result,
    });
});

const unpublishCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminCourseService.unpublishCourse(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course unpublished successfully",
        data: result,
    });
});

const softDeleteCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminCourseService.softDeleteCourse(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course deleted successfully",
        data: result,
    });
});

export const AdminCourseController = {
    getAllCourses,
    approveCourse,
    rejectCourse,
    unpublishCourse,
    softDeleteCourse,
};
