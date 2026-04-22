import { Request, Response } from 'express';
import { catchAsync } from '../../shared/chatchAsync';
import { AuthService } from './auth.service';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import { tokenUtils } from '../../utils/token';
import { cookieUtil } from '../../utils/cookie';

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
            user,
            accessToken,
            refreshToken,
            sessionToken
        }
    });
});

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await AuthService.getCurrentUser(userId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    await AuthService.logout(req.headers);

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    } as any;

    cookieUtil.clearCookie(res, "accessToken", cookieOptions);
    cookieUtil.clearCookie(res, "refreshToken", cookieOptions);
    cookieUtil.clearCookie(res, "sessionToken", cookieOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logout successful",
        data: null,
    });
});

export const AuthController = {
    register,
    login,
    getCurrentUser,
    logout,
};
