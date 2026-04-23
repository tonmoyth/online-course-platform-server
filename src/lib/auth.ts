import { prisma } from "./prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { envVeriables } from "../config/envConfig";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    baseURL: envVeriables.FRONTEND_URL,
    trustedOrigins: [envVeriables.FRONTEND_URL!],
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
    },
    emailAndPassword: {
        enabled: true,
    },

    session: {
        expiresIn: 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
        cookieCache: {
            enabled: true,
            maxAge: 24 * 60 * 60,
        },
    },

    advanced: {
        cookies: {
            session_token: {
                name: "session_token", // Force this exact name
                attributes: {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    partitioned: true,
                },
            },
            state: {
                name: "session_token", // Force this exact name
                attributes: {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    partitioned: true,
                },
            },
        },
    },

    //   plugins: [oAuthProxy()],
});