import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { RoleRoutes } from "../modules/admin/roles/role.route";

const router = Router();

router.use('/auth', authRoutes)

// admin routes
router.use('/admin/roles', RoleRoutes)

export default router;