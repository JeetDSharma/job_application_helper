import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

async function checkFollowUps() {
  try {
    const now = new Date();
    console.log(`Current date/time: ${now.toISOString()}`);
    console.log(`Current date (local): ${now.toLocaleString()}\n`);

    // Get all emails with follow-up dates
    const allFollowUps = await prisma.emailLog.findMany({
      where: {
        followUpScheduledFor: {
          not: null,
        },
        responseReceived: false,
      },
      include: {
        recipient: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        followUpScheduledFor: "asc",
      },
    });

    console.log(`Total emails with follow-up dates: ${allFollowUps.length}\n`);

    // Separate into due and upcoming
    const due = allFollowUps.filter(
      (f) => f.followUpScheduledFor && new Date(f.followUpScheduledFor) <= now,
    );
    const upcoming = allFollowUps.filter(
      (f) => f.followUpScheduledFor && new Date(f.followUpScheduledFor) > now,
    );

    console.log(`📅 DUE FOR FOLLOW-UP (${due.length}):`);
    due.forEach((email) => {
      console.log(
        `  - ${email.recipient.name} at ${email.recipient.company.companyName}`,
      );
      console.log(`    Sent: ${new Date(email.sentAt).toLocaleDateString()}`);
      console.log(
        `    Follow-up due: ${new Date(email.followUpScheduledFor!).toLocaleDateString()}`,
      );
    });

    console.log(`\n⏰ UPCOMING FOLLOW-UPS (${upcoming.length}):`);
    upcoming.forEach((email) => {
      console.log(
        `  - ${email.recipient.name} at ${email.recipient.company.companyName}`,
      );
      console.log(`    Sent: ${new Date(email.sentAt).toLocaleDateString()}`);
      console.log(
        `    Follow-up scheduled: ${new Date(email.followUpScheduledFor!).toLocaleDateString()}`,
      );
    });
  } catch (error) {
    console.error("Error checking follow-ups:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFollowUps();
