import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/chatchAsync";
import { CourseDiscoveryService } from "./course.service";
import sendResponse from "../../../shared/sendResponse";

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
    const result = await CourseDiscoveryService.getAllCourses(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Courses retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CourseDiscoveryService.getSingleCourse(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course retrieved successfully",
        data: result,
    });
});

export const CourseDiscoveryController = {
    getAllCourses,
    getSingleCourse,
};
