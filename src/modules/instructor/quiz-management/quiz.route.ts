import { Router } from "express";
import chackAuth from "../../../middlewares/checkAuth";
import validateRequest from "../../../middlewares/validateRequest";
import { QuizValidation } from "./quiz.validation";
import { QuizController } from "./quiz.controller";

const router = Router();

// Quiz creation (nested under course)
router.post(
    "/courses/:courseId/quizzes",
    chackAuth("INSTRUCTOR"),
    validateRequest(QuizValidation.createQuizZodSchema),
    QuizController.createQuiz,
);

// Question management
router.post(
    "/quizzes/:quizId/questions",
    chackAuth("INSTRUCTOR"),
    validateRequest(QuizValidation.createQuestionZodSchema),
    QuizController.addQuestion,
);

router.patch(
    "/questions/:id",
    chackAuth("INSTRUCTOR"),
    validateRequest(QuizValidation.updateQuestionZodSchema),
    QuizController.updateQuestion,
);

router.delete(
    "/questions/:id",
    chackAuth("INSTRUCTOR"),
    QuizController.deleteQuestion,
);

// Quiz details and attempts
router.get(
    "/quizzes/:quizId",
    chackAuth("INSTRUCTOR"),
    QuizController.getQuizDetails,
);

router.get(
    "/quizzes/:quizId/attempts",
    chackAuth("INSTRUCTOR"),
    QuizController.getQuizAttempts,
);

export const InstructorQuizRoutes = router;
