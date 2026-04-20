import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/chatchAsync";
import { AdminService } from "./admin.service";
import sendResponse from "../../shared/sendResponse";

// User Approval System
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

// Role & Permission Management
const createRole = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.createRole(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Role created successfully",
        data: result,
    });
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.updateRole(id as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Role updated successfully",
        data: result,
    });
});

const deleteRole = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.deleteRole(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Role deleted successfully",
        data: result,
    });
});

// User Management
const assignRole = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { roleId } = req.body;
    const result = await AdminService.assignRole(id as string, roleId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Role assigned successfully",
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.updateUser(id as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});

export const AdminController = {
    approveUser,
    rejectUser,
    createRole,
    updateRole,
    deleteRole,
    assignRole,
    updateUser,
};
