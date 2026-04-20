import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/chatchAsync";
import { AdminService } from "./admin.service";
import sendResponse from "../../shared/sendResponse";

const approveUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.approveUser(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User approved successfully",
        data: result,
    });
});

const rejectUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { remark } = req.body;
    const result = await AdminService.rejectUser(id as string, remark);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User rejected successfully",
        data: result,
    });
});

export const AdminController = {
    approveUser,
    rejectUser,
};
