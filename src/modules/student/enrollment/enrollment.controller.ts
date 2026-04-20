import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/chatchAsync";
import { EnrollmentService } from "./enrollment.service";
import sendResponse from "../../../shared/sendResponse";

const enrollInCourse = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const studentId = req.user?.id as string;
    const result = await EnrollmentService.enrollInCourse(studentId, courseId as string);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Enrolled successfully",
        data: result,
    });
});


const getEnrolledCourses = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user?.id as string;
    const result = await EnrollmentService.getEnrolledCourses(studentId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Enrolled courses retrieved successfully",
        data: result,
    });
});

const getCourseLearningDetails = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const studentId = req.user?.id as string;
    const result = await EnrollmentService.getCourseLearningDetails(studentId, courseId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course learning details retrieved successfully",
        data: result,
    });
});

export const EnrollmentController = {
    enrollInCourse,
    getEnrolledCourses,
    getCourseLearningDetails,
};
