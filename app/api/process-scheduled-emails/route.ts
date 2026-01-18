const nodemailer = require("nodemailer");
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { buildAlumTemplate } from "@/templates/alumTemplate";
import { buildEmailTemplate } from "@/templates/emailTemplateNew";
import { buildRecruiterTemplate } from "@/templates/recruiterTemplate";
import { UNIVERSITY_NAME, RESUME_NAME } from "@/lib/constants";
import { PrismaClient } from "@/app/generated/prisma";
import { upsertCompany } from "@/lib/db/company";
import { upsertRecipient } from "@/lib/db/recipient";
import { insertEmailLog, updateEmailStatus } from "@/lib/db/emailLog";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedToken = process.env.CRON_SECRET || "your-secret-token";

    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const scheduledEmails = await prisma.scheduledEmail.findMany({
      where: {
        status: "SCHEDULED",
        scheduledFor: {
          lte: now,
        },
      },
      take: 10,
    });

    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const scheduledEmail of scheduledEmails) {
      try {
        await prisma.scheduledEmail.update({
          where: { id: scheduledEmail.id },
          data: { status: "PROCESSING" },
        });

        const companyId = await upsertCompany({
          companyName: scheduledEmail.company,
        });
        const recipientId = await upsertRecipient({
          email: scheduledEmail.email,
          name: scheduledEmail.name,
          companyId,
          isAlumni: scheduledEmail.isAlum,
        });

        let templateUsed = "GENERIC";
        if (scheduledEmail.isRecruiter) {
          templateUsed = "RECRUITER";
        } else if (scheduledEmail.isAlum) {
          templateUsed = "ALUMNI";
        }

        const emailLogId = await insertEmailLog({
          recipientId,
          jobPosition: scheduledEmail.jobPosition,
          templateUsed,
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

        let html_body;
        if (scheduledEmail.isRecruiter) {
          html_body = buildRecruiterTemplate({
            name: scheduledEmail.name,
            jobPosition: scheduledEmail.jobPosition,
            company: scheduledEmail.company,
          });
        } else if (scheduledEmail.isAlum) {
          html_body = buildAlumTemplate({
            name: scheduledEmail.name,
            jobPosition: scheduledEmail.jobPosition,
            company: scheduledEmail.company,
            university: UNIVERSITY_NAME,
          });
        } else {
          html_body = buildEmailTemplate({
            name: scheduledEmail.name,
            jobPosition: scheduledEmail.jobPosition,
            company: scheduledEmail.company,
            tenureYears: scheduledEmail.tenureYears
              ? Number(scheduledEmail.tenureYears)
              : undefined,
            personalMention: scheduledEmail.personalMention || undefined,
          });
        }

        const emailSubject = scheduledEmail.isRecruiter
          ? `${scheduledEmail.jobPosition} - Founding Engineer w/ 2 YOE | May 2026 Grad`
          : `Seeking to Learn From Your Journey to ${scheduledEmail.company}`;

        const mailOptions = {
          from: `"Jeet Sharma" <${process.env.SMTP_USER}>`,
          to: scheduledEmail.email,
          subject: emailSubject,
          html: html_body,
          attachments: [
            {
              filename: RESUME_NAME,
              content: resumeFile,
              contentType: "application/pdf",
            },
          ],
        };

        await transporter.sendMail(mailOptions);
        await updateEmailStatus({ emailLogId, status: "SENT" });

        await prisma.scheduledEmail.update({
          where: { id: scheduledEmail.id },
          data: {
            status: "SENT",
            processedAt: new Date(),
          },
        });

        results.sent++;
        results.processed++;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        await prisma.scheduledEmail.update({
          where: { id: scheduledEmail.id },
          data: {
            status: "FAILED",
            processedAt: new Date(),
            errorMessage,
          },
        });

        results.failed++;
        results.processed++;
        results.errors.push(
          `Failed to send email ${scheduledEmail.id}: ${errorMessage}`,
        );
      }
    }

    return NextResponse.json(
      {
        message: "Scheduled emails processed",
        results,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing scheduled emails:", error);
    return NextResponse.json(
      { error: "Failed to process scheduled emails" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const upcomingEmails = await prisma.scheduledEmail.findMany({
      where: {
        status: "SCHEDULED",
      },
      orderBy: {
        scheduledFor: "asc",
      },
      take: 50,
    });

    const dueNow = upcomingEmails.filter(
      (email) => new Date(email.scheduledFor) <= now,
    );

    return NextResponse.json(
      {
        total: upcomingEmails.length,
        dueNow: dueNow.length,
        upcoming: upcomingEmails,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching scheduled emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled emails" },
      { status: 500 },
    );
  }
}
