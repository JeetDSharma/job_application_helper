const nodemailer = require("nodemailer");
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { buildAlumTemplate } from "@/templates/alumTemplate";
import { buildEmailTemplate } from "@/templates/emailTemplate";
import { UNIVERSITY_NAME } from "@/lib/constants";
import { RESUME_NAME } from "@/lib/constants";
import { PrismaClient } from "@/app/generated/prisma";
import { upsertCompany } from "@/lib/db/company";
import { upsertRecipient } from "@/lib/db/recipient";
import { insertEmailLog, updateEmailStatus } from "@/lib/db/emailLog";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, name, company, jobPosition, isAlum } = body;
  console.log(body);

  const companyId = await upsertCompany({ companyName: company });
  const recipientId = await upsertRecipient({
    email,
    name,
    companyId,
    isAlumni: isAlum,
  });
  const emailLogId = await insertEmailLog({
    recipientId,
    jobPosition,
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

  const html_body = isAlum
    ? buildAlumTemplate({
        name,
        jobPosition,
        company,
        university: UNIVERSITY_NAME,
      })
    : buildEmailTemplate({ name, jobPosition, company });

  const mailOptions = {
    from: `"Jeet Sharma" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Seeking Your Advice on ${jobPosition} Position at ${company}`,
    html: html_body,
    attachments: [
      {
        filename: RESUME_NAME,
        content: resumeFile,
        contentType: "application/pdf",
      },
    ],
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Sent");
    await updateEmailStatus({ emailLogId, status: "SENT" });
    return NextResponse.json(
      { message: "Email Sent Successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    await updateEmailStatus({ emailLogId, status: "FAILED" });
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
