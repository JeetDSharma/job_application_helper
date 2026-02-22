import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      emailLogId,
      isMarkedWrong,
      notes,
      responseReceived,
      responseDate,
      responseType,
      followUpScheduled,
    } = body;

    if (!emailLogId) {
      return NextResponse.json(
        { error: "Email log ID is required" },
        { status: 400 },
      );
    }

    const updateData: Record<string, boolean | string | Date | null> = {};

    if (isMarkedWrong !== undefined) {
      updateData.isMarkedWrong = isMarkedWrong;
      if (isMarkedWrong) {
        updateData.markedAt = new Date();
      } else {
        updateData.markedAt = null;
      }
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (responseReceived !== undefined) {
      updateData.responseReceived = responseReceived;
    }

    if (responseDate !== undefined) {
      updateData.responseDate = responseDate ? new Date(responseDate) : null;
    }

    if (responseType !== undefined) {
      updateData.responseType = responseType;
    }

    if (followUpScheduled !== undefined) {
      updateData.followUpScheduledFor = followUpScheduled
        ? new Date(followUpScheduled)
        : null;
    }

    const updatedEmailLog = await prisma.emailLog.update({
      where: { id: emailLogId },
      data: updateData,
    });

    return NextResponse.json(updatedEmailLog, { status: 200 });
  } catch (error) {
    console.error("Error updating email log:", error);
    return NextResponse.json(
      { error: "Failed to update email log" },
      { status: 500 },
    );
  }
}
