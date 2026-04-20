import { z } from "zod";

const generateCertificateZodSchema = z.object({
    params: z.object({
        attemptId: z.string().uuid("Invalid attempt ID format"),
    }),
});

export const CertificateValidation = {
    generateCertificateZodSchema,
};
