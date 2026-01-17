import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email parameter is required" },
      { status: 400 },
    );
  }

  try {
    const recipient = await prisma.recipient.findUnique({
      where: { email },
      include: {
        company: true,
        emailLogs: {
          orderBy: {
            sentAt: "desc",
          },
          take: 5,
        },
      },
    });

    if (!recipient) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    return NextResponse.json(
      {
        exists: true,
        recipient: {
          name: recipient.name,
          email: recipient.email,
          isAlumni: recipient.isAlumni,
          company: recipient.company.companyName,
          emailLogs: recipient.emailLogs.map((log) => ({
            sentAt: log.sentAt,
            status: log.status,
            jobPosition: log.jobPosition,
          })),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking recipient:", error);
    return NextResponse.json(
      { error: "Failed to check recipient" },
      { status: 500 },
    );
  }
}
