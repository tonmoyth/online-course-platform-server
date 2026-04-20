import { prisma } from "../../../lib/prisma";
import AppError from "../../../errors/appError";
import httpStatus from "http-status";
import { Response } from "express";
import { CertificateGenerator } from "./certificate.generator";

const generateCertificate = async (studentId: string, attemptId: string) => {
    // 1. Fetch attempt and verify
    const attempt = await prisma.quizAttempt.findUnique({
        where: { id: attemptId },
        include: {
            quiz: {
                include: {
                    course: true,
                },
            },
        },
    });

    if (!attempt) {
        throw new AppError(httpStatus.NOT_FOUND, "Quiz attempt not found");
    }

    if (attempt.studentId !== studentId) {
        throw new AppError(httpStatus.FORBIDDEN, "This attempt does not belong to you");
    }

    if (!attempt.isPassed) {
        throw new AppError(httpStatus.BAD_REQUEST, "Certificate can only be generated for passed attempts");
    }

    // 2. Check if already exists
    const existingCertificate = await prisma.certificate.findUnique({
        where: { attemptId },
    });

    if (existingCertificate) {
        throw new AppError(httpStatus.CONFLICT, "Certificate already generated for this attempt");
    }

    // 3. Create record
    const result = await prisma.certificate.create({
        data: {
            studentId,
            courseId: attempt.quiz.courseId,
            attemptId,
            score: attempt.score,
        },
    });

    return result;
};

const getCertificate = async (studentId: string, id: string) => {
    const certificate = await prisma.certificate.findUnique({
        where: { id },
        include: {
            student: {
                select: {
                    name: true,
                },
            },
            course: {
                include: {
                    instructor: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!certificate) {
        throw new AppError(httpStatus.NOT_FOUND, "Certificate not found");
    }

    if (certificate.studentId !== studentId) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to view this certificate");
    }

    return certificate;
};

const downloadCertificate = async (studentId: string, id: string, res: Response) => {
    const certificate = await getCertificate(studentId, id);

    const certificateData = {
        studentName: certificate.student.name as string,
        courseName: certificate.course.title,
        instructorName: certificate.course.instructor.name as string,
        issuedAt: certificate.issuedAt,
        score: certificate.score,
    };

    CertificateGenerator.generatePDF(certificateData, res);
};

export const CertificateService = {
    generateCertificate,
    getCertificate,
    downloadCertificate,
};
