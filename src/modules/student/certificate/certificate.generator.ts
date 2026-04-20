import PDFDocument from "pdfkit";
import { Response } from "express";

interface ICertificateData {
    studentName: string;
    courseName: string;
    instructorName: string;
    issuedAt: Date;
    score: number;
}

const generatePDF = (data: ICertificateData, res: Response) => {
    const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
        margin: 50,
    });

    // Set headers for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=Certificate_${data.courseName.replace(/\s+/g, "_")}.pdf`
    );

    doc.pipe(res);

    // --- Design ---
    
    // Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke("#1a365d");
    doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke("#2c5282");

    // Title
    doc.moveDown(4);
    doc.fillColor("#1a365d").fontSize(40).text("CERTIFICATE OF COMPLETION", {
        align: "center",
    });

    doc.moveDown(1);
    doc.fillColor("#4a5568").fontSize(18).text("This is to certify that", {
        align: "center",
    });

    // Student Name
    doc.moveDown(1);
    doc.fillColor("#2d3748").fontSize(32).text(data.studentName.toUpperCase(), {
        align: "center",
        underline: true,
    });

    doc.moveDown(1);
    doc.fillColor("#4a5568").fontSize(18).text("has successfully completed the course", {
        align: "center",
    });

    // Course Name
    doc.moveDown(1);
    doc.fillColor("#2b6cb0").fontSize(26).text(data.courseName, {
        align: "center",
    });

    // Score & Date
    doc.moveDown(2);
    doc.fillColor("#4a5568").fontSize(14).text(
        `Issued on: ${data.issuedAt.toLocaleDateString()} | Score: ${data.score}%`,
        { align: "center" }
    );

    // Signature Area
    doc.moveDown(4);
    const signatureY = doc.y;
    
    // Left side: Instructor
    doc.fontSize(14).text("_________________________", 150, signatureY);
    doc.text(data.instructorName, 150, signatureY + 20);
    doc.fontSize(10).text("Instructor", 150, signatureY + 35);

    // Right side: Platform
    doc.fontSize(14).text("_________________________", 500, signatureY);
    doc.text("Online LMS Platform", 500, signatureY + 20);
    doc.fontSize(10).text("Official Certification", 500, signatureY + 35);

    doc.end();
};

export const CertificateGenerator = {
    generatePDF,
};
