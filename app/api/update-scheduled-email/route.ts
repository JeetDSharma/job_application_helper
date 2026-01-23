import { NextRequest, NextResponse } from "next/server";
import {
  updateScheduledEmail,
  cancelScheduledEmail,
} from "@/lib/db/scheduledEmail";

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

    await updateScheduledEmail({
      id,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      subject,
      htmlBody,
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
