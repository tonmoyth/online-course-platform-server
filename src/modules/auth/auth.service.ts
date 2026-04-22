import { prisma } from '../../lib/prisma';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { auth } from '../../lib/auth';
import { tokenUtils } from '../../utils/token';

const register = async (payload: any) => {
    const { name, email, password, role } = payload;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    
    if (existingUser) {
        throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
    }

    // 2. Find the Role ID based on role string (e.g. "STUDENT" or "INSTRUCTOR")
    const roleRecord = await prisma.role.findFirst({
        where: { name: role }
    });
    
    if (!roleRecord) {
        throw new AppError(httpStatus.BAD_REQUEST, `Role '${role}' not found in the system`);
    }

    // 3. Create user using Better Auth
    const signUpResult = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            roleId: roleRecord.id,
            status: 'PENDING',
        }
    });

    return signUpResult.user;
};

const login = async (payload: any) => {
    const { email, password } = payload;

    // 1. Find user by email
    const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true }
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // 2. Check user status
    if (user.status === 'PENDING') {
        throw new AppError(httpStatus.FORBIDDEN, "Account is not active. Please wait for admin approval.");
    }

    if (user.status === 'REJECTED' || user.status === 'SUSPENDED') {
        throw new AppError(httpStatus.FORBIDDEN, `Your account has been ${user.status.toLowerCase()}.`);
    }

    // 3. Verify password and create Better Auth session
    const signInResult = await auth.api.signInEmail({
        body: {
            email,
            password,
        },
    });

    if (!signInResult) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    const { user: authUser, token } = signInResult;

    // 4. Generate custom JWT tokens
    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role?.name,
    };

    const accessToken = tokenUtils.getToken(jwtPayload);
    const refreshToken = tokenUtils.getRefreshToken(jwtPayload);

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role?.name,
            status: user.status,
        },
        accessToken,
        refreshToken,
        sessionToken: token,
    };
};

const getCurrentUser = async (userId: string) => {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
            image: true,
            createdAt: true,
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    return user;
};

const logout = async (headers: any) => {
    try {
        await auth.api.signOut({
            headers
        });
    } catch (error) {
        // Ignore if signout fails, we still want to clear cookies
    }
    return null;
};

export const AuthService = {
    register,
    login,
    getCurrentUser,
    logout,
};
