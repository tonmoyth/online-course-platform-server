import { Request, Response } from 'express';
import { catchAsync } from '../../shared/chatchAsync';
import { AuthService } from './auth.service';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import { tokenUtils } from '../../utils/token';

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

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    const { user, accessToken, refreshToken, sessionToken } = result;

    // Set cookies
    tokenUtils.setTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSession(res, sessionToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Login successful",
        data: {
            user
        }
    });
});

export const AuthController = {
    register,
    login
};
