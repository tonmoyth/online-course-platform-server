import { Router } from "express";
import chackAuth from "../../../middlewares/checkAuth";
import validateRequest from "../../../middlewares/validateRequest";
import { AdminCourseValidation } from "./course.validation";
import { AdminCourseController } from "./course.controller";

const router = Router();

router.get(
    "/",
    chackAuth("ADMIN", "SUPER ADMIN"),
    AdminCourseController.getAllCourses,
);

router.patch(
    "/:id/approve",
    chackAuth("ADMIN", "SUPER ADMIN"),
    AdminCourseController.approveCourse,
);

router.patch(
    "/:id/reject",
    chackAuth("ADMIN", "SUPER ADMIN"),
    validateRequest(AdminCourseValidation.rejectCourseZodSchema),
    AdminCourseController.rejectCourse,
);

router.patch(
    "/:id/unpublish",
    chackAuth("ADMIN", "SUPER ADMIN"),
    AdminCourseController.unpublishCourse,
);

router.delete(
    "/:id",
    chackAuth("ADMIN", "SUPER ADMIN"),
    AdminCourseController.softDeleteCourse,
);

export const AdminCourseRoutes = router;
