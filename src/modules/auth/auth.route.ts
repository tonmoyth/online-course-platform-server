import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import chackAuth from "../../middlewares/checkAuth";

const router = Router();

router.post(
    '/register',
    validateRequest(AuthValidation.registerZodSchema),
    AuthController.register
);

router.post(
    '/login',
    validateRequest(AuthValidation.loginZodSchema),
    AuthController.login
);

router.get(
    '/me',
    chackAuth("ADMIN", "SUPER ADMIN", "INSTRUCTOR", "STUDENT"),
    AuthController.getCurrentUser
);

router.post(
    '/logout',
    AuthController.logout
);

export const authRoutes = router;
