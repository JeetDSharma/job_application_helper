import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get pending follow-ups (scheduled but not sent yet)
    const pendingFollowUps = await prisma.emailLog.findMany({
      where: {
        followUpScheduledFor: {
          not: null,
        },
        responseReceived: false,
        status: "SENT",
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

    // Get sent follow-ups (where followUpCount > 0)
    const sentFollowUps = await prisma.emailLog.findMany({
      where: {
        followUpCount: {
          gt: 0,
        },
        responseReceived: false,
        status: "SENT",
      },
      include: {
        recipient: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        lastFollowUpDate: "desc",
      },
    });

    return NextResponse.json(
      {
        pendingFollowUps,
        sentFollowUps,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    return NextResponse.json(
      { error: "Failed to fetch follow-ups" },
      { status: 500 },
    );
  }
}
