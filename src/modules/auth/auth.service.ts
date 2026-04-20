import { prisma } from '../../lib/prisma';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

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

    // 3. Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create user inside a transaction to ensure both User and Account records are created
    const newUser = await prisma.$transaction(async (tx) => {
        const userId = crypto.randomUUID();

        // Create the User record
        const user = await tx.user.create({
            data: {
                id: userId,
                name,
                email,
                roleId: roleRecord.id,
                status: 'PENDING',
                emailVerified: false,
            }
        });

        // Create Account record for Better Auth credentials
        await tx.account.create({
            data: {
                id: crypto.randomUUID(),
                accountId: email, // Usually email is used as accountId for credentials
                providerId: 'credential',
                userId: user.id,
                password: hashedPassword,
            }
        });

        return user;
    });

    return newUser;
};

export const AuthService = {
    register
};
