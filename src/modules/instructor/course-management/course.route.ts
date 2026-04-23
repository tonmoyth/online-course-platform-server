import { Router } from "express";
import chackAuth from "../../../middlewares/checkAuth";
import validateRequest from "../../../middlewares/validateRequest";
import { CourseValidation } from "./course.validation";
import { CourseController } from "./course.controller";

const router = Router();

router.post(
    "/",
    chackAuth("INSTRUCTOR"),
    validateRequest(CourseValidation.createCourseZodSchema),
    CourseController.createCourse,
);

router.get(
    "/",
    chackAuth("INSTRUCTOR"),
    CourseController.getMyCourses,
);

router.get(
    "/drafts",
    chackAuth("INSTRUCTOR"),
    CourseController.getMyDraftCourses,
);

router.get(
    "/:id/students",
    chackAuth("INSTRUCTOR"),
    CourseController.getEnrolledStudents,
);

router.patch(
    "/:id",
    chackAuth("INSTRUCTOR"),
    validateRequest(CourseValidation.updateCourseZodSchema),
    CourseController.updateCourse,
);

router.patch(
    "/:id/submit",
    chackAuth("INSTRUCTOR"),
    CourseController.submitCourse,
);

router.delete(
    "/:id",
    chackAuth("INSTRUCTOR"),
    CourseController.deleteCourse,
);

export const InstructorCourseRoutes = router;
