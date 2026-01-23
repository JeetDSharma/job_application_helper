import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all follow-ups (not just due ones)
    const allFollowUps = await prisma.emailLog.findMany({
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

    return NextResponse.json({ followUps: allFollowUps }, { status: 200 });
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    return NextResponse.json(
      { error: "Failed to fetch follow-ups" },
      { status: 500 },
    );
  }
}
