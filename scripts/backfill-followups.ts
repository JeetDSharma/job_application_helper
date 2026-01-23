import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

async function backfillFollowUps() {
  try {
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    console.log(`Looking for emails sent since: ${sevenDaysAgo.toISOString()}`);

    // Find all sent emails from the past week without follow-up dates
    const emailsToUpdate = await prisma.emailLog.findMany({
      where: {
        sentAt: {
          gte: sevenDaysAgo,
        },
        status: "SENT",
        followUpScheduledFor: null,
        responseReceived: false,
        templateUsed: {
          not: "FOLLOWUP",
        },
      },
      include: {
        recipient: {
          include: {
            company: true,
          },
        },
      },
    });

    console.log(`Found ${emailsToUpdate.length} emails to backfill`);

    // Update each email with follow-up date (6 days after sent date)
    for (const email of emailsToUpdate) {
      const followUpDate = new Date(email.sentAt);
      followUpDate.setDate(followUpDate.getDate() + 6);

      await prisma.emailLog.update({
        where: { id: email.id },
        data: {
          followUpScheduledFor: followUpDate,
        },
      });

      console.log(
        `✓ Updated: ${email.recipient.name} at ${email.recipient.company.companyName} - Follow-up: ${followUpDate.toLocaleDateString()}`,
      );
    }

    console.log(
      `\n✅ Backfill complete! Updated ${emailsToUpdate.length} emails`,
    );
  } catch (error) {
    console.error("Error during backfill:", error);
  } finally {
    await prisma.$disconnect();
  }
}

backfillFollowUps();
