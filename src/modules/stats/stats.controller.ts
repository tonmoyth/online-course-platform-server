import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/chatchAsync";
import { StatsService } from "./stats.service";
import sendResponse from "../../shared/sendResponse";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    console.log(user, "test");
    const result = await StatsService.getDashboardStats(user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Dashboard stats retrieved successfully",
        data: result,
    });
});

export const StatsController = {
    getDashboardStats,
};
