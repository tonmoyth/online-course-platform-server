import { Router } from "express";
import chackAuth from "../../../middlewares/checkAuth";
import validateRequest from "../../../middlewares/validateRequest";
import { QuizAttemptValidation } from "./quizAttempt.validation";
import { QuizAttemptController } from "./quizAttempt.controller";

const router = Router();

router.post(
    "/quizzes/:quizId/start",
    chackAuth("STUDENT"),
    validateRequest(QuizAttemptValidation.startAttemptZodSchema),
    QuizAttemptController.startAttempt,
);

router.get(
    "/quizzes/:quizId/questions",
    chackAuth("STUDENT"),
    QuizAttemptController.getQuizQuestions,
);

router.post(
    "/quizzes/:quizId/submit",
    chackAuth("STUDENT"),
    validateRequest(QuizAttemptValidation.submitAttemptZodSchema),
    QuizAttemptController.submitAttempt,
);

router.get(
    "/attempts/:attemptId",
    chackAuth("STUDENT"),
    QuizAttemptController.getAttemptResult,
);

router.get(
    "/quizzes/:quizId/attempts",
    chackAuth("STUDENT"),
    QuizAttemptController.getAttemptHistory,
);

export const StudentQuizAttemptRoutes = router;
