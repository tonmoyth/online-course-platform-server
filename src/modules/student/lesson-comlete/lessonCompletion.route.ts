import { Router } from "express";
import chackAuth from "../../../middlewares/checkAuth";
import validateRequest from "../../../middlewares/validateRequest";
import { LessonCompletionValidation } from "./lessonCompletion.validation";
import { LessonCompletionController } from "./lessonCompletion.controller";

const router = Router();

router.post(
    "/:lessonId/complete",
    chackAuth("STUDENT"),
    validateRequest(LessonCompletionValidation.markAsCompletedZodSchema),
    LessonCompletionController.markAsCompleted,
);

router.delete(
    "/:lessonId/complete",
    chackAuth("STUDENT"),
    LessonCompletionController.unmarkAsCompleted,
);

export const LessonCompletionRoutes = router;
