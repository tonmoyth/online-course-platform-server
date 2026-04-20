import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/chatchAsync";
import { CertificateService } from "./certificate.service";
import sendResponse from "../../../shared/sendResponse";

const generateCertificate = catchAsync(async (req: Request, res: Response) => {
    const { attemptId } = req.params;
    const studentId = req.user?.id as string;
    const result = await CertificateService.generateCertificate(studentId, attemptId as string);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Certificate generated successfully",
        data: result,
    });
});

const getCertificate = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const studentId = req.user?.id as string;
    const result = await CertificateService.getCertificate(studentId, id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Certificate retrieved successfully",
        data: result,
    });
});

const downloadCertificate = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const studentId = req.user?.id as string;
    await CertificateService.downloadCertificate(studentId, id as string, res);
});

export const CertificateController = {
    generateCertificate,
    getCertificate,
    downloadCertificate,
};
