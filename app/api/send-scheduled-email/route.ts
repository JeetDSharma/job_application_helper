import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { RESUME_NAME } from "@/lib/constants";
import {
  getScheduledEmailById,
  markScheduledEmailAsSent,
} from "@/lib/db/scheduledEmail";
import { insertEmailLog, updateEmailStatus } from "@/lib/db/emailLog";

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

    const emailLogId = await insertEmailLog({
      recipientId: scheduledEmail.recipientId,
      jobPosition: scheduledEmail.jobPosition,
      templateUsed: scheduledEmail.templateUsed,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resumePath = path.join(process.cwd(), "public", "resume.pdf");
    const resumeFile = fs.readFileSync(resumePath);

    const mailOptions = {
      from: `"Jeet Sharma" <${process.env.SMTP_USER}>`,
      to: scheduledEmail.recipient.email,
      subject: scheduledEmail.subject,
      html: scheduledEmail.htmlBody,
      attachments: [
        {
          filename: RESUME_NAME,
          content: resumeFile,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Scheduled email sent");

    await updateEmailStatus({ emailLogId, status: "SENT" });
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
