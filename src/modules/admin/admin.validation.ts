import { z } from "zod";
import { PermissionModules, UsersStatus } from "../../generated/prisma/client";

const permissionSchema = z.object({
    module: z.nativeEnum(PermissionModules),
    canView: z.boolean().default(false),
    canCreate: z.boolean().default(false),
    canEdit: z.boolean().default(false),
    canDelete: z.boolean().default(false),
});

const createRoleZodSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Role name is required"),
        description: z.string().optional(),
        permissions: z.array(permissionSchema).optional(),
    }),
});

const updateRoleZodSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        permissions: z.array(permissionSchema).optional(),
    }),
});

const rejectUserZodSchema = z.object({
    body: z.object({
        remark: z.string().min(1, "Remark is required"),
    }),
});

const assignRoleZodSchema = z.object({
    body: z.object({
        roleId: z.string().min(1, "Role ID is required"),
    }),
});

const updateUserZodSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().email("Invalid email format").optional(),
        roleId: z.string().optional(),
        status: z.nativeEnum(UsersStatus).optional(),
    }),
});

export const AdminValidation = {
    createRoleZodSchema,
    updateRoleZodSchema,
    rejectUserZodSchema,
    assignRoleZodSchema,
    updateUserZodSchema,
};
