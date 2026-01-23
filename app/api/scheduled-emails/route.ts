import { NextResponse } from "next/server";
import { getScheduledEmails } from "@/lib/db/scheduledEmail";

export async function GET() {
  try {
    const scheduledEmails = await getScheduledEmails();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const categorized = {
      overdue: scheduledEmails.filter(
        (email) => new Date(email.scheduledFor) < today,
      ),
      today: scheduledEmails.filter(
        (email) =>
          new Date(email.scheduledFor) >= today &&
          new Date(email.scheduledFor) < tomorrow,
      ),
      thisWeek: scheduledEmails.filter(
        (email) =>
          new Date(email.scheduledFor) >= tomorrow &&
          new Date(email.scheduledFor) < nextWeek,
      ),
      later: scheduledEmails.filter(
        (email) => new Date(email.scheduledFor) >= nextWeek,
      ),
    };

    return NextResponse.json(categorized, { status: 200 });
  } catch (error) {
    console.error("Error fetching scheduled emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled emails" },
      { status: 500 },
    );
  }
}
