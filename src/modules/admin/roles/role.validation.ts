import { z } from 'zod';

const createRoleValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Role name cannot be empty'),
        description: z.string().optional(),
    }),
});

const updateRoleValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Role name cannot be empty').optional(),
        description: z.string().optional(),
    }),
});

export const RoleValidations = {
    createRoleValidationSchema,
    updateRoleValidationSchema,
};
