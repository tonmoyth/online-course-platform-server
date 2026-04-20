import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { InstructorCourseRoutes } from "../modules/instructor/course-management/course.route";
import { InstructorLessonRoutes } from "../modules/instructor/lesson-management/lesson.route";
import { InstructorQuizRoutes } from "../modules/instructor/quiz-management/quiz.route";
import { CourseDiscoveryRoutes } from "../modules/student/course-discovery/course.route";
import { EnrollmentRoutes } from "../modules/student/enrollment/enrollment.route";
import { StudentQuizAttemptRoutes } from "../modules/student/quiz-attempts/quizAttempt.route";

const router = Router();

router.use('/auth', authRoutes)

// admin routes
router.use('/admin', AdminRoutes)

// instructor routes
router.use('/instructor/courses', InstructorCourseRoutes)
router.use('/instructor', InstructorLessonRoutes)
router.use('/instructor', InstructorQuizRoutes)

// student routes
router.use('/courses', CourseDiscoveryRoutes)
router.use('/student', EnrollmentRoutes)
router.use('/student', StudentQuizAttemptRoutes)

export default router;