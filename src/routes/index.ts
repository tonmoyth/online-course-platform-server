import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { RoleRoutes } from "../modules/admin/roles/role.route";
import { AdminRoutes } from "../modules/admin/admin.route";

const router = Router();

router.use('/auth', authRoutes)

// admin routes
router.use('/admin', AdminRoutes)
router.use('/admin/roles', RoleRoutes)

export default router;