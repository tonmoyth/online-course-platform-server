import { Router } from "express";
import chackAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = Router();

// User Management
router.get(
    "/users",
    chackAuth("ADMIN", "SUPER ADMIN"),
    AdminController.getAllUsers,
);

router.patch(
    "/users/:id/approve",
    chackAuth("SUPER ADMIN"),
    AdminController.approveUser,
);

router.patch(
    "/users/:id/reject",
    chackAuth("SUPER ADMIN"),
    validateRequest(AdminValidation.rejectUserZodSchema),
    AdminController.rejectUser,
);

// Role & Permission Management
router.get(
    "/roles",
    AdminController.getAllRoles,
);

router.post(
    "/roles",
    chackAuth("ADMIN", "SUPER ADMIN"),
    validateRequest(AdminValidation.createRoleZodSchema),
    AdminController.createRole,
);

router.patch(
    "/roles/:id",
    chackAuth("ADMIN", "SUPER ADMIN"),
    validateRequest(AdminValidation.updateRoleZodSchema),
    AdminController.updateRole,
);

router.delete(
    "/roles/:id",
    chackAuth("ADMIN", "SUPER ADMIN"),
    AdminController.deleteRole,
);

// User Management
router.patch(
    "/users/:id/assign-role",
    chackAuth("ADMIN", "SUPER ADMIN"),
    validateRequest(AdminValidation.assignRoleZodSchema),
    AdminController.assignRole,
);

router.patch(
    "/users/:id",
    chackAuth("ADMIN", "SUPER ADMIN"),
    validateRequest(AdminValidation.updateUserZodSchema),
    AdminController.updateUser,
);

export const AdminRoutes = router;
