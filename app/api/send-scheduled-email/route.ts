import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { RESUME_NAME } from "@/lib/constants";
import {
  getScheduledEmailById,
  markScheduledEmailAsSent,
} from "@/lib/db/scheduledEmail";
import {
  insertEmailLog,
  updateEmailStatus,
  updateMessageId,
} from "@/lib/db/emailLog";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scheduledEmailId } = body;

    if (!scheduledEmailId) {
      return NextResponse.json(
        { error: "scheduledEmailId is required" },
        { status: 400 },
      );
    }

    const scheduledEmail = await getScheduledEmailById(scheduledEmailId);

    if (!scheduledEmail) {
      return NextResponse.json(
        { error: "Scheduled email not found" },
        { status: 404 },
      );
    }

    if (scheduledEmail.status !== "SCHEDULED") {
      return NextResponse.json(
        { error: "Email has already been sent or cancelled" },
        { status: 400 },
      );
    }

    // Calculate follow-up date (6 days from now) for initial emails
    let followUpDate: Date | undefined = undefined;
    if (!scheduledEmail.isFollowUp) {
      followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + 6);
    }

    const emailLogId = await insertEmailLog({
      recipientId: scheduledEmail.recipientId,
      jobPosition: scheduledEmail.jobPosition,
      templateUsed: scheduledEmail.templateUsed,
      followUpScheduledFor: followUpDate,
      emailSubject: scheduledEmail.subject,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Get resume file from scheduled email, default to resume.pdf
    const resumeFile = scheduledEmail.resumeFile || "resume.pdf";

    // Validate resume file selection for security
    const ALLOWED_RESUMES = [
      "resume.pdf",
      "resume_blockchain.pdf",
      "resume_infra.pdf",
    ];
    if (!ALLOWED_RESUMES.includes(resumeFile)) {
      await updateEmailStatus({ emailLogId, status: "FAILED" });
      return NextResponse.json(
        { error: "Invalid resume file in scheduled email" },
        { status: 400 },
      );
    }

    const resumePath = path.join(process.cwd(), "public", resumeFile);

    // Check if file exists
    if (!fs.existsSync(resumePath)) {
      await updateEmailStatus({ emailLogId, status: "FAILED" });
      return NextResponse.json(
        { error: `Resume file not found: ${resumeFile}` },
        { status: 400 },
      );
    }

    const resumeBuffer = fs.readFileSync(resumePath);

    // Rename attachment to professional filename
    const attachmentName = RESUME_NAME;

    // Threading: look up original email for follow-ups
    let threadSubject = scheduledEmail.subject;
    let inReplyTo: string | undefined;
    let references: string | undefined;

    if (scheduledEmail.isFollowUp) {
      // Find the most recent sent email to this recipient with a messageId
      const originalEmail = await prisma.emailLog.findFirst({
        where: {
          recipientId: scheduledEmail.recipientId,
          messageId: { not: null },
          status: "SENT",
        },
        orderBy: { sentAt: "desc" },
        select: { messageId: true, emailSubject: true },
      });

      if (originalEmail?.messageId) {
        inReplyTo = originalEmail.messageId;
        references = originalEmail.messageId;
      }
      if (originalEmail?.emailSubject) {
        threadSubject = `Re: ${originalEmail.emailSubject}`;
      }
    }

    const mailOptions: Record<string, unknown> = {
      from: `"Jeet Sharma" <${process.env.SMTP_USER}>`,
      to: scheduledEmail.recipient.email,
      subject: threadSubject,
      html: scheduledEmail.htmlBody,
      ...(inReplyTo && { inReplyTo }),
      ...(references && { references }),
      ...(!scheduledEmail.isFollowUp && {
        attachments: [
          {
            filename: attachmentName,
            content: resumeBuffer,
            contentType: "application/pdf",
          },
        ],
      }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Scheduled email sent");

    await updateEmailStatus({ emailLogId, status: "SENT" });

    // Store the SMTP Message-ID for future threading
    if (info.messageId) {
      await updateMessageId(emailLogId, info.messageId);
    }

    await markScheduledEmailAsSent(scheduledEmailId, emailLogId);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
