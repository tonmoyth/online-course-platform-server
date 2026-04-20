import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { InstructorCourseRoutes } from "../modules/instructor/course-management/course.route";

const router = Router();

router.use('/auth', authRoutes)

// admin routes
router.use('/admin', AdminRoutes)

// instructor routes
router.use('/instructor/courses', InstructorCourseRoutes)

export default router;