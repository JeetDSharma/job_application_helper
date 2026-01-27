import { NextRequest, NextResponse } from "next/server";
import { buildAlumTemplate } from "@/templates/alumTemplate";
import { buildEmailTemplate } from "@/templates/emailTemplateNew";
import { buildRecruiterTemplate } from "@/templates/recruiterTemplate";
import { buildFollowUpTemplate } from "@/templates/followUpTemplate";
import { UNIVERSITY_NAME } from "@/lib/constants";
import { upsertCompany } from "@/lib/db/company";
import { upsertRecipient } from "@/lib/db/recipient";
import { createScheduledEmail } from "@/lib/db/scheduledEmail";

export async function POST(req: NextRequest) {
  try {
    console.log("=== Schedule Email API Called ===");
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

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
      scheduledFor,
      customHtml,
    } = body;

    if (!scheduledFor) {
      console.log("Error: scheduledFor is missing");
      return NextResponse.json(
        { error: "scheduledFor is required" },
        { status: 400 },
      );
    }

    console.log("Step 1: Upserting company...");
    const companyId = await upsertCompany({ companyName: company });
    console.log("Company ID:", companyId);

    console.log("Step 2: Upserting recipient...");
    const recipientId = await upsertRecipient({
      email,
      name,
      companyId,
      isAlumni: isAlum,
    });
    console.log("Recipient ID:", recipientId);

    let templateUsed = "GENERIC";
    if (isFollowUp) {
      templateUsed = "FOLLOWUP";
    } else if (isRecruiter) {
      templateUsed = "RECRUITER";
    } else if (isAlum) {
      templateUsed = "ALUMNI";
    }

    console.log("Step 3: Building email template...");
    let html_body;
    if (customHtml) {
      html_body = customHtml;
      console.log(
        "Using custom HTML from preview editor, length:",
        html_body.length,
      );
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
      console.log("Building generic template with:", {
        name,
        jobPosition,
        company,
        tenureYears,
        personalMention,
      });
      html_body = buildEmailTemplate({
        name,
        jobPosition,
        company,
        tenureYears,
        personalMention,
      });
    }
    if (!customHtml) {
      console.log("Template built successfully, length:", html_body.length);
    }

    const emailSubject = isFollowUp
      ? `Following up - ${jobPosition} at ${company}`
      : isRecruiter
        ? `${jobPosition} - Founding Engineer w/ 2 YOE | May 2026 Grad`
        : `Seeking to Learn From Your Journey to ${company}`;
    console.log("Email subject:", emailSubject);

    console.log("Step 4: Creating scheduled email in database...");
    const scheduledEmailId = await createScheduledEmail({
      recipientId,
      scheduledFor: new Date(scheduledFor),
      subject: emailSubject,
      htmlBody: html_body,
      jobPosition,
      templateUsed,
      isFollowUp,
      isAlum,
      isRecruiter,
      tenureYears: tenureYears ? Number(tenureYears) : undefined,
      personalMention: personalMention || undefined,
    });
    console.log("Scheduled email created with ID:", scheduledEmailId);

    return NextResponse.json(
      {
        message: "Email scheduled successfully!",
        scheduledEmailId,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error scheduling email:", err);
    console.error(
      "Error details:",
      JSON.stringify(err, Object.getOwnPropertyNames(err)),
    );
    return NextResponse.json(
      {
        error: "Failed to schedule email",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
