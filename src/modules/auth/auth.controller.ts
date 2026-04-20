import { Request, Response } from 'express';
import { catchAsync } from '../../shared/chatchAsync';
import { AuthService } from './auth.service';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';

const register = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Registration successful. Please wait for admin approval.",
        data: {
            id: result.id,
            name: result.name,
            role: result.roleId,
            email: result.email,
        }
    });
});

export const AuthController = {
    register
};
