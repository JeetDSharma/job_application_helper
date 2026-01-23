import { NextRequest, NextResponse } from "next/server";
import { markFollowUpSent } from "@/lib/db/emailLog";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailLogId } = body;

    if (!emailLogId) {
      return NextResponse.json(
        { error: "Email log ID is required" },
        { status: 400 },
      );
    }

    await markFollowUpSent(emailLogId);

    return NextResponse.json(
      { message: "Follow-up marked as sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error marking follow-up as sent:", error);
    return NextResponse.json(
      { error: "Failed to mark follow-up as sent" },
      { status: 500 },
    );
  }
}
