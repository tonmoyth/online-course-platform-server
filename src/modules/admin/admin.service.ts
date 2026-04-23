import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/appError";
import { PermissionModules } from "../../generated/prisma/client";
import { QueryBuilder } from "../../utils/quearyBuilder";
import { userFilterableFields, userSearchableFields } from "./admin.constant";

interface IPermission {
    module: PermissionModules;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

interface IRolePayload {
    name: string;
    description?: string;
    permissions?: IPermission[];
}

// User Approval System
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

// Role & Permission Management
const createRole = async (payload: IRolePayload) => {
    const { name, description, permissions } = payload;

    const existingRole = await prisma.role.findFirst({
        where: { name },
    });

    if (existingRole) {
        throw new AppError(httpStatus.CONFLICT, "Role with this name already exists");
    }

    const result = await prisma.$transaction(async (tx) => {
        const newRole = await tx.role.create({
            data: {
                name,
                description,
                rolePermissions: {
                    create: permissions ? permissions.map(perm => ({
                        permission: {
                            create: {
                                modules: perm.module,
                                canView: perm.canView,
                                canCreate: perm.canCreate,
                                canEdit: perm.canEdit,
                                canDelete: perm.canDelete,
                            }
                        }
                    })) : []
                }
            },
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });

        return newRole;
    }, {
        timeout: 10000, // Increase timeout just in case it's a slow DB connection
    });

    return result;
};

const updateRole = async (id: string, payload: Partial<IRolePayload>) => {
    const { name, description, permissions } = payload;

    const role = await prisma.role.findUnique({
        where: { id },
        include: {
            rolePermissions: {
                include: {
                    permission: true,
                },
            },
        },
    });

    if (!role) {
        throw new AppError(httpStatus.NOT_FOUND, "Role not found");
    }

    if (role.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot update a deleted role");
    }

    if (name && name !== role.name) {
        const existingRole = await prisma.role.findFirst({
            where: { name },
        });

        if (existingRole && existingRole.id !== id) {
            throw new AppError(httpStatus.CONFLICT, "Role with this name already exists");
        }
    }

    const result = await prisma.$transaction(async (tx) => {
        await tx.role.update({
            where: { id },
            data: {
                name,
                description,
            },
        });

        if (permissions && permissions.length > 0) {
            for (const perm of permissions) {
                const existingRolePermission = role.rolePermissions.find(
                    (rp) => rp.permission.modules === perm.module
                );

                if (existingRolePermission) {
                    await tx.permission.update({
                        where: { id: existingRolePermission.permissionId },
                        data: {
                            canView: perm.canView,
                            canCreate: perm.canCreate,
                            canEdit: perm.canEdit,
                            canDelete: perm.canDelete,
                        },
                    });
                } else {
                    const newPermission = await tx.permission.create({
                        data: {
                            modules: perm.module,
                            canView: perm.canView,
                            canCreate: perm.canCreate,
                            canEdit: perm.canEdit,
                            canDelete: perm.canDelete,
                        },
                    });

                    await tx.rolePermission.create({
                        data: {
                            roleId: id,
                            permissionId: newPermission.id,
                        },
                    });
                }
            }
        }

        return await tx.role.findUnique({
            where: { id },
            include: {
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    });

    return result;
};

const deleteRole = async (id: string) => {
    const role = await prisma.role.findUnique({
        where: { id },
    });

    if (!role) {
        throw new AppError(httpStatus.NOT_FOUND, "Role not found");
    }

    if (role.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Role is already deleted");
    }

    const result = await prisma.role.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    return result;
};

const getAllRoles = async () => {
    const result = await prisma.role.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            description: true,
        },
    });

    return result;
};

// User Management
const assignRole = async (userId: string, roleId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot assign role to a deleted user");
    }

    const role = await prisma.role.findUnique({
        where: { id: roleId },
    });

    if (!role) {
        throw new AppError(httpStatus.NOT_FOUND, "Role not found");
    }

    const result = await prisma.user.update({
        where: { id: userId },
        data: {
            roleId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            roleId: true,
            status: true,
        },
    });

    return result;
};

const updateUser = async (userId: string, payload: any) => {
    const { name, email, roleId, status } = payload;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot update a deleted user");
    }

    // Security: Protect Super Admin
    if (user.isSuperAdmin) {
        if (roleId && roleId !== user.roleId) {
            throw new AppError(httpStatus.FORBIDDEN, "Cannot change role of a Super Admin");
        }
        if (status && status !== user.status) {
            throw new AppError(httpStatus.FORBIDDEN, "Cannot change status of a Super Admin");
        }
    }

    // Handle email uniqueness
    if (email && email !== user.email) {
        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });
        if (existingEmail) {
            throw new AppError(httpStatus.CONFLICT, "Email already exists");
        }
    }

    // Validate role if provided
    if (roleId) {
        const role = await prisma.role.findUnique({
            where: { id: roleId },
        });
        if (!role) {
            throw new AppError(httpStatus.NOT_FOUND, "Role not found");
        }
    }

    const result = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            email,
            roleId,
            status,
        },
        select: {
            id: true,
            name: true,
            email: true,
            roleId: true,
            status: true,
        },
    });

    return result;
};

const getAllUsers = async (query: Record<string, any>) => {
    const userQuery = new QueryBuilder(prisma.user, query, {
        searchableFields: userSearchableFields,
        filterableFields: userFilterableFields,
    })
        .search()
        .filter()
        .paginate()
        .sort()
        .where({ isDeleted: false })
        .include({ role: { select: { id: true, name: true } } });

    const result = await userQuery.execute();
    return result;
};

export const AdminService = {
    approveUser,
    rejectUser,
    createRole,
    updateRole,
    deleteRole,
    assignRole,
    updateUser,
    getAllUsers,
    getAllRoles,
};
