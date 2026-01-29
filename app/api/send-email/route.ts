import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { buildAlumTemplate } from "@/templates/alumTemplate";
import { buildEmailTemplate } from "@/templates/emailTemplate";
import { buildRecruiterTemplate } from "@/templates/recruiterTemplate";
import { buildFollowUpTemplate } from "@/templates/followUpTemplate";
import { UNIVERSITY_NAME } from "@/lib/constants";
import { RESUME_NAME } from "@/lib/constants";
import { PrismaClient } from "@/app/generated/prisma";
import { upsertCompany } from "@/lib/db/company";
import { upsertRecipient } from "@/lib/db/recipient";
import {
  insertEmailLog,
  updateEmailStatus,
  markFollowUpSent,
} from "@/lib/db/emailLog";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    email,
    name,
    company,
    jobPosition,
    isAlum,
    isRecruiter,
    tenureYears,
    personalMention,
    isFollowUp,
    customHtml,
    resumeFile = "resume.pdf",
  } = body; // Get new fields
  console.log(body);

  // Determine template type
  let templateUsed = "GENERIC";
  if (isFollowUp) {
    templateUsed = "FOLLOWUP";
  } else if (isRecruiter) {
    templateUsed = "RECRUITER";
  } else if (isAlum) {
    templateUsed = "ALUMNI";
  }

  // Insert company and recipient data
  const companyId = await upsertCompany({ companyName: company });
  const recipientId = await upsertRecipient({
    email,
    name,
    companyId,
    isAlumni: isAlum,
  });
  // Calculate follow-up date (6 days from now) for initial emails
  let followUpDate: Date | undefined = undefined;
  if (!isFollowUp) {
    followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 6);
  }

  const emailLogId = await insertEmailLog({
    recipientId,
    jobPosition,
    templateUsed,
    followUpScheduledFor: followUpDate,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Validate resume file selection for security
  const ALLOWED_RESUMES = [
    "resume.pdf",
    "resume_blockchain.pdf",
    "resume_infra.pdf",
  ];
  if (!ALLOWED_RESUMES.includes(resumeFile)) {
    return NextResponse.json(
      { error: "Invalid resume file selected" },
      { status: 400 },
    );
  }

  const resumePath = path.join(process.cwd(), "public", resumeFile);

  // Check if file exists
  if (!fs.existsSync(resumePath)) {
    return NextResponse.json(
      { error: `Resume file not found: ${resumeFile}` },
      { status: 400 },
    );
  }

  const resumeBuffer = fs.readFileSync(resumePath);

  // Rename attachment to professional filename
  const attachmentName = RESUME_NAME;

  // Use custom HTML if provided, otherwise generate from template
  let html_body;
  if (customHtml) {
    html_body = customHtml;
    console.log("Using custom HTML from preview editor");
  } else if (isFollowUp) {
    html_body = buildFollowUpTemplate({
      name,
      company,
      jobPosition,
      isRecruiter: isRecruiter || false,
    });
  } else if (isRecruiter) {
    html_body = buildRecruiterTemplate({
      name,
      jobPosition,
      company,
    });
  } else if (isAlum) {
    html_body = buildAlumTemplate({
      name,
      jobPosition,
      company,
      university: UNIVERSITY_NAME,
    });
  } else {
    html_body = buildEmailTemplate({
      name,
      jobPosition,
      company,
      tenureYears,
      personalMention,
    });
  }

  const emailSubject = isFollowUp
    ? `Following up - ${jobPosition} at ${company}`
    : isRecruiter
      ? `${jobPosition} - Founding Engineer w/ 2 YOE | May 2026 Grad`
      : `Seeking to Learn From Your Journey to ${company}`;

  const mailOptions = {
    from: `"Jeet Sharma" <${process.env.SMTP_USER}>`,
    to: email,
    subject: emailSubject,
    html: html_body,
    attachments: [
      {
        filename: attachmentName,
        content: resumeBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Sent");
    await updateEmailStatus({ emailLogId, status: "SENT" });

    // If this is a follow-up, mark the original email log
    if (isFollowUp) {
      const originalEmailLog = await prisma.emailLog.findFirst({
        where: {
          recipientId,
          followUpScheduledFor: {
            not: null,
          },
          responseReceived: false,
        },
        orderBy: {
          sentAt: "desc",
        },
      });

      if (originalEmailLog) {
        await markFollowUpSent(originalEmailLog.id);
      }
    }

    return NextResponse.json(
      { message: "Email Sent Successfully!", emailLogId },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    await updateEmailStatus({ emailLogId, status: "FAILED" });
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
