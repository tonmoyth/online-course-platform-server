import { Router } from "express";
import chackAuth from "../../../middlewares/checkAuth";
import validateRequest from "../../../middlewares/validateRequest";
import { EnrollmentValidation } from "./enrollment.validation";
import { EnrollmentController } from "./enrollment.controller";

const router = Router();

router.post(
    "/courses/:courseId/enroll",
    chackAuth("STUDENT"),
    validateRequest(EnrollmentValidation.enrollInCourseZodSchema),
    EnrollmentController.enrollInCourse,
);

router.get(
    "/enrollments",
    chackAuth("STUDENT"),
    EnrollmentController.getEnrolledCourses,
);

router.get(
    "/courses/:courseId",
    chackAuth("STUDENT"),
    EnrollmentController.getCourseLearningDetails,
);

router.post(
    "/lessons/:lessonId/complete",
    chackAuth("STUDENT"),
    validateRequest(EnrollmentValidation.completeLessonZodSchema),
    EnrollmentController.completeLesson,
);

export const EnrollmentRoutes = router;
