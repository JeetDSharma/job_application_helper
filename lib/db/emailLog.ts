import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

type InsertEmailLog = {
  recipientId: string;
  jobPosition: string;
  templateUsed?: string;
  followUpScheduledFor?: Date;
  emailSubject?: string;
};

type UpdateEmailStatus = {
  emailLogId: string;
  status: string;
};
export async function insertEmailLog({
  recipientId,
  jobPosition,
  templateUsed,
  followUpScheduledFor,
  emailSubject,
}: InsertEmailLog): Promise<string> {
  const response = await prisma.emailLog.create({
    data: {
      recipientId,
      jobPosition,
      templateUsed,
      followUpScheduledFor,
      emailSubject,
    },
    select: {
      id: true,
    },
  });
  return response.id;
}

export async function updateEmailStatus({
  emailLogId,
  status,
}: UpdateEmailStatus) {
  return await prisma.emailLog.update({
    where: {
      id: emailLogId,
    },
    data: {
      status: status,
    },
  });
}

export async function updateMessageId(emailLogId: string, messageId: string) {
  return await prisma.emailLog.update({
    where: { id: emailLogId },
    data: { messageId },
  });
}

export async function getOriginalEmailForThread(emailLogId: string) {
  return await prisma.emailLog.findUnique({
    where: { id: emailLogId },
    select: {
      messageId: true,
      emailSubject: true,
    },
  });
}

export async function markFollowUpSent(emailLogId: string) {
  const emailLog = await prisma.emailLog.findUnique({
    where: { id: emailLogId },
  });

  if (!emailLog) {
    throw new Error("Email log not found");
  }

  return await prisma.emailLog.update({
    where: {
      id: emailLogId,
    },
    data: {
      followUpCount: emailLog.followUpCount + 1,
      lastFollowUpDate: new Date(),
      followUpScheduledFor: null,
    },
  });
}
