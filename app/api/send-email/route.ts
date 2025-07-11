const nodemailer = require('nodemailer');
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { buildAlumTemplate } from "@/templates/alumTemplate";
import { buildEmailTemplate } from "@/templates/emailTemplate";
import { UNIVERSITY_NAME } from "@/lib/constants";
import { RESUME_NAME } from "@/lib/constants";


export async function POST(req: NextRequest) {
    const body = await req.json();
    const {email, name, company, job_position, isAlum} = body;
    console.log(body)

    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const resumePath = path.join(process.cwd(), "public", "resume.pdf");
  const resumeFile = fs.readFileSync(resumePath);

  const html_body = isAlum ? buildAlumTemplate({name, job_position, company, university: UNIVERSITY_NAME}) : buildEmailTemplate({name, job_position, company})

  const mailOptions = {
    from: `"Jeet Sharma" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Application for ${job_position} at ${company}`,
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
    return NextResponse.json({ message: "Email Sent Successfully!" }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}