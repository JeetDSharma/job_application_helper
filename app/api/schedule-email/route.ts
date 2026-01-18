import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      company,
      jobPosition,
      isAlum,
      isRecruiter,
      tenureYears,
      personalMention,
      scheduledFor,
    } = body;

    if (!email || !name || !company || !jobPosition || !scheduledFor) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const scheduledTime = new Date(scheduledFor);
    const now = new Date();

    if (scheduledTime <= now) {
      return NextResponse.json(
        { error: "Scheduled time must be in the future" },
        { status: 400 },
      );
    }

    const scheduledEmail = await prisma.scheduledEmail.create({
      data: {
        email,
        name,
        company,
        jobPosition,
        isAlum: isAlum || false,
        isRecruiter: isRecruiter || false,
        tenureYears: tenureYears || null,
        personalMention: personalMention || null,
        scheduledFor: scheduledTime,
        status: "SCHEDULED",
      },
    });

    return NextResponse.json(
      {
        message: "Email scheduled successfully",
        scheduledEmail: {
          id: scheduledEmail.id,
          scheduledFor: scheduledEmail.scheduledFor,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error scheduling email:", error);
    return NextResponse.json(
      { error: "Failed to schedule email" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "SCHEDULED";

    const scheduledEmails = await prisma.scheduledEmail.findMany({
      where: {
        status: status,
      },
      orderBy: {
        scheduledFor: "asc",
      },
    });

    return NextResponse.json({ scheduledEmails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching scheduled emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled emails" },
      { status: 500 },
    );
  }
}
