import { prisma } from '../../../lib/prisma';
import AppError from '../../../errors/appError';

const createRole = async (payload: { name: string; description?: string }) => {
    // MySQL handles case-insensitive comparisons by default via collation.
    // Checking if a role with the same name already exists.
    const existingRole = await prisma.role.findFirst({
        where: {
            name: payload.name,
        },
    });

    if (existingRole) {
        throw new AppError(409, 'A role with this name already exists');
    }

    const newRole = await prisma.role.create({
        data: payload,
    });

    return newRole;
};

const updateRole = async (id: string, payload: Partial<{ name: string; description: string }>) => {
    const role = await prisma.role.findUnique({
        where: { id },
    });

    if (!role) {
        throw new AppError(404, 'Role not found');
    }

    if (role.isDeleted) {
        throw new AppError(400, 'Cannot update a deleted role');
    }

    if (payload.name && payload.name !== role.name) {
        const existingRole = await prisma.role.findFirst({
            where: {
                name: payload.name,
            },
        });

        if (existingRole && existingRole.id !== id) {
            throw new AppError(409, 'A role with this name already exists');
        }
    }

    const updatedRole = await prisma.role.update({
        where: { id },
        data: payload,
    });

    return updatedRole;
};

const deleteRole = async (id: string) => {
    const role = await prisma.role.findUnique({
        where: { id },
    });

    if (!role) {
        throw new AppError(404, 'Role not found');
    }

    if (role.isDeleted) {
        throw new AppError(400, 'Role is already deleted');
    }

    const deletedRole = await prisma.role.update({
        where: { id },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    return deletedRole;
};

export const RoleService = {
    createRole,
    updateRole,
    deleteRole,
};
