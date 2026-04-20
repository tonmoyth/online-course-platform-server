import { Router } from "express";
import chackAuth from "../../../middlewares/checkAuth";
import validateRequest from "../../../middlewares/validateRequest";
import { LessonValidation } from "./lesson.validation";
import { LessonController } from "./lesson.controller";

const router = Router();

// Routes nested under course
router.post(
    "/courses/:courseId/lessons",
    chackAuth("INSTRUCTOR"),
    validateRequest(LessonValidation.createLessonZodSchema),
    LessonController.createLesson,
);

router.get(
    "/courses/:courseId/lessons",
    chackAuth("INSTRUCTOR"),
    LessonController.getLessonsByCourse,
);

router.patch(
    "/courses/:courseId/lessons/reorder",
    chackAuth("INSTRUCTOR"),
    validateRequest(LessonValidation.reorderLessonsZodSchema),
    LessonController.reorderLessons,
);

// Routes for individual lessons
router.patch(
    "/lessons/:id",
    chackAuth("INSTRUCTOR"),
    validateRequest(LessonValidation.updateLessonZodSchema),
    LessonController.updateLesson,
);

router.delete(
    "/lessons/:id",
    chackAuth("INSTRUCTOR"),
    LessonController.deleteLesson,
);

export const InstructorLessonRoutes = router;
