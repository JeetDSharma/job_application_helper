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

    // If exact recipient found, return them
    if (recipient) {
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
    }

    // If not found, try to find a company by domain
    const domain = email.split("@")[1];
    let suggestedCompany = null;

    if (
      domain &&
      ![
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "icloud.com",
        "protonmail.com",
      ].includes(domain.toLowerCase())
    ) {
      const domainMatch = await prisma.recipient.findFirst({
        where: {
          email: {
            endsWith: `@${domain}`,
          },
        },
        include: {
          company: true,
        },
      });

      if (domainMatch) {
        suggestedCompany = domainMatch.company.companyName;
      }
    }

    return NextResponse.json(
      {
        exists: false,
        suggestedCompany,
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
