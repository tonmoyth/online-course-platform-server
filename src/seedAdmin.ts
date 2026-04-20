import status from "http-status";

import { auth } from "./lib/auth";
import { prisma } from "./lib/prisma";
import AppError from "./errors/appError";

const createAdmin = async () => {
    try {
        // Check if super admin already exists
        const existingSuperAdmin = await prisma.user.findFirst({
            where: {
                email: "tonmoynht1930@gmail.com",
            },
        });

        if (existingSuperAdmin) {
            throw new AppError(status.CONFLICT, "Super admin already exists");
        }

        // Create user with better-auth
        await auth.api.signUpEmail({
            body: {
                name: "Nurislam hasan Tonmoy",
                email: "tonmoynht1930@gmail.com",
                password: "[PASSWORD]",
                roleId: "8c08d424-d314-4918-a7f0-68ed7edd2010",
                isSuperAdmin: true,
                status: "ACTIVE",
                isDeleted: false,
            },
        });

        console.log("Super admin created successfully");
    } catch (error) {
        console.error("Error creating super admin:", error);
    }
};

// Run the seed function
createAdmin();