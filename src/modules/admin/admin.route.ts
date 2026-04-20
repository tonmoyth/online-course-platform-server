import { Router } from "express";
import chackAuth from "../../middlewares/checkAuth";
import { AdminController } from "./admin.controller";

const router = Router();

router.patch(
    "/users/:id/approve",
    chackAuth("SUPER ADMIN"),
    AdminController.approveUser,
);

router.patch(
    "/users/:id/reject",
    chackAuth("SUPER ADMIN"),
    AdminController.rejectUser,
);

export const AdminRoutes = router;
