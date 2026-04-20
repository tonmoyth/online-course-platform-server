import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/appError";

const approveUser = async (userId: string) => {
    const isExistUser = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!isExistUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (isExistUser.status !== "PENDING") {
        throw new AppError(
            httpStatus.CONFLICT,
            `User is already ${isExistUser.status.toLowerCase()}`,
        );
    }

    const result = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            status: "ACTIVE"
        },
        select: {
            id: true,
            status: true,
        },
    });

    return result;
};

const rejectUser = async (userId: string, remark: string) => {
    const isExistUser = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!isExistUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (isExistUser.status !== "PENDING") {
        throw new AppError(
            httpStatus.CONFLICT,
            `User is already ${isExistUser.status.toLowerCase()}`,
        );
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
            where: {
                id: userId,
            },
            data: {
                status: "REJECTED",
            },
            select: {
                id: true,
                status: true,
            },
        });

        await tx.userRemark.create({
            data: {
                userId,
                remark,
            },
        });

        return {
            ...updatedUser,
            remark,
        };
    });

    return result;
};

export const AdminService = {
    approveUser,
    rejectUser,
};
