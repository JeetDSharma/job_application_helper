import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const company = searchParams.get("company");

  try {
    const emailLogs = await prisma.emailLog.findMany({
      where: {
        ...(status && status !== "ALL" ? { status } : {}),
        ...(company
          ? {
              recipient: {
                company: {
                  companyName: {
                    contains: company,
                  },
                },
              },
            }
          : {}),
      },
      include: {
        recipient: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
    });

    const formattedLogs = emailLogs.map((log) => ({
      id: log.id,
      sentAt: log.sentAt,
      status: log.status,
      jobPosition: log.jobPosition,
      recipientName: log.recipient.name,
      recipientEmail: log.recipient.email,
      companyName: log.recipient.company.companyName,
      isAlumni: log.recipient.isAlumni,
      errorMessage: log.errorMessage,
    }));

    return NextResponse.json(formattedLogs, { status: 200 });
  } catch (error) {
    console.error("Error fetching email logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch email logs" },
      { status: 500 },
    );
  }
}
