import { NextRequest, NextResponse } from "next/server";
import {
  updateScheduledEmail,
  cancelScheduledEmail,
  getScheduledEmailById,
} from "@/lib/db/scheduledEmail";
import { upsertCompany } from "@/lib/db/company";
import { upsertRecipient } from "@/lib/db/recipient";
import { buildEmailTemplate } from "@/templates/emailTemplateNew";
import { buildAlumTemplate } from "@/templates/alumTemplate";
import { buildRecruiterTemplate } from "@/templates/recruiterTemplate";
import { buildFollowUpTemplate } from "@/templates/followUpTemplate";
import { UNIVERSITY_NAME } from "@/lib/constants";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, scheduledFor, subject, htmlBody, cancel } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    if (cancel) {
      await cancelScheduledEmail(id);
      return NextResponse.json(
        { message: "Scheduled email cancelled" },
        { status: 200 },
      );
    }

    const { recipientName, recipientEmail, companyName, jobPosition } = body;

    const existing = await getScheduledEmailById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Scheduled email not found" },
        { status: 404 },
      );
    }

    let newRecipientId: string | undefined;
    const hasRecipientChanges = recipientName || recipientEmail || companyName;

    if (hasRecipientChanges) {
      const finalCompany =
        companyName || existing.recipient.company.companyName;
      const companyId = await upsertCompany({ companyName: finalCompany });

      const finalEmail = recipientEmail || existing.recipient.email;
      const finalName = recipientName || existing.recipient.name;

      newRecipientId = await upsertRecipient({
        email: finalEmail,
        name: finalName,
        companyId,
        isAlumni: existing.isAlum,
      });
    }

    const finalJobPosition = jobPosition || existing.jobPosition;
    const finalName = recipientName || existing.recipient.name;
    const finalCompany = companyName || existing.recipient.company.companyName;

    let newHtmlBody = htmlBody;
    let newSubject = subject;

    if ((hasRecipientChanges || jobPosition) && !htmlBody) {
      if (existing.isFollowUp) {
        newHtmlBody = buildFollowUpTemplate({
          name: finalName,
          company: finalCompany,
          jobPosition: finalJobPosition,
          isRecruiter: existing.isRecruiter,
        });
      } else if (existing.isRecruiter) {
        newHtmlBody = buildRecruiterTemplate({
          name: finalName,
          jobPosition: finalJobPosition,
          company: finalCompany,
        });
      } else if (existing.isAlum) {
        newHtmlBody = buildAlumTemplate({
          name: finalName,
          jobPosition: finalJobPosition,
          company: finalCompany,
          university: UNIVERSITY_NAME,
        });
      } else {
        newHtmlBody = buildEmailTemplate({
          name: finalName,
          jobPosition: finalJobPosition,
          company: finalCompany,
          tenureYears: existing.tenureYears ?? undefined,
          personalMention: existing.personalMention ?? undefined,
        });
      }
    }

    if ((hasRecipientChanges || jobPosition) && !subject) {
      newSubject = existing.isFollowUp
        ? `Following up - ${finalJobPosition} at ${finalCompany}`
        : existing.isRecruiter
          ? `${finalJobPosition} - Founding Engineer w/ 2 YOE | May 2026 Grad`
          : `Seeking to Learn From Your Journey to ${finalCompany}`;
    }

    await updateScheduledEmail({
      id,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      subject: newSubject,
      htmlBody: newHtmlBody,
      recipientId: newRecipientId,
      jobPosition: jobPosition || undefined,
    });

    return NextResponse.json(
      { message: "Scheduled email updated" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update scheduled email" },
      { status: 500 },
    );
  }
}
