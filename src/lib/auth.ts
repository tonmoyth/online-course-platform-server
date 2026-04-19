import { prisma } from "./prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql", // or "mysql", "postgresql", ...etc
    }),
    user: {
        additionalFields: {
            roleId: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                required: false,
                defaultValue: "PENDING"
            },
            isSuperAdmin: {
                type: "boolean",
                required: false,
                defaultValue: false
            },
            isDeleted: {
                type: "boolean",
                required: false,
                defaultValue: false
            },
            deletedAt: {
                type: "date",
                required: false
            }
        }
    }
});