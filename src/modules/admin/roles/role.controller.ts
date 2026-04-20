import { Request, Response } from 'express';
import { catchAsync } from '../../../shared/chatchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RoleService } from './role.service';

const createRole = catchAsync(async (req: Request, res: Response) => {
    const role = await RoleService.createRole(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Role created successfully',
        data: role,
    });
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const role = await RoleService.updateRole(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Role updated successfully',
        data: role,
    });
});

const deleteRole = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const role = await RoleService.deleteRole(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Role deleted successfully',
        data: role,
    });
});

export const RoleController = {
    createRole,
    updateRole,
    deleteRole,
};
