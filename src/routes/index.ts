import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { InstructorCourseRoutes } from "../modules/instructor/course-management/course.route";
import { InstructorLessonRoutes } from "../modules/instructor/lesson-management/lesson.route";

const router = Router();

router.use('/auth', authRoutes)

// admin routes
router.use('/admin', AdminRoutes)

// instructor routes
router.use('/instructor/courses', InstructorCourseRoutes)
router.use('/instructor', InstructorLessonRoutes)

export default router;