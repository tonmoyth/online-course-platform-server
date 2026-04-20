import { Router } from "express";
import chackAuth from "../../../middlewares/checkAuth";
import validateRequest from "../../../middlewares/validateRequest";
import { CertificateValidation } from "./certificate.validation";
import { CertificateController } from "./certificate.controller";

const router = Router();

router.post(
    "/:attemptId/generate",
    chackAuth("STUDENT"),
    validateRequest(CertificateValidation.generateCertificateZodSchema),
    CertificateController.generateCertificate,
);

router.get(
    "/:id",
    chackAuth("STUDENT"),
    CertificateController.getCertificate,
);

router.get(
    "/:id/download",
    chackAuth("STUDENT"),
    CertificateController.downloadCertificate,
);

export const StudentCertificateRoutes = router;
