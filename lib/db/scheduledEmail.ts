import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

type CreateScheduledEmail = {
  recipientId: string;
  scheduledFor: Date;
  subject: string;
  htmlBody: string;
  jobPosition: string;
  templateUsed: string;
  isFollowUp?: boolean;
  isAlum?: boolean;
  isRecruiter?: boolean;
  tenureYears?: number;
  personalMention?: string;
};

type UpdateScheduledEmail = {
  id: string;
  scheduledFor?: Date;
  subject?: string;
  htmlBody?: string;
  status?: string;
};

export async function createScheduledEmail(
  data: CreateScheduledEmail,
): Promise<string> {
  const scheduledEmail = await prisma.scheduledEmail.create({
    data: {
      recipientId: data.recipientId,
      scheduledFor: data.scheduledFor,
      subject: data.subject,
      htmlBody: data.htmlBody,
      jobPosition: data.jobPosition,
      templateUsed: data.templateUsed,
      isFollowUp: data.isFollowUp || false,
      isAlum: data.isAlum || false,
      isRecruiter: data.isRecruiter || false,
      tenureYears: data.tenureYears,
      personalMention: data.personalMention,
    },
    select: {
      id: true,
    },
  });
  return scheduledEmail.id;
}

export async function getScheduledEmails() {
  return await prisma.scheduledEmail.findMany({
    where: {
      status: "SCHEDULED",
    },
    include: {
      recipient: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      scheduledFor: "asc",
    },
  });
}

export async function getScheduledEmailById(id: string) {
  return await prisma.scheduledEmail.findUnique({
    where: { id },
    include: {
      recipient: {
        include: {
          company: true,
        },
      },
    },
  });
}

export async function updateScheduledEmail(data: UpdateScheduledEmail) {
  const updateData: any = {};
  if (data.scheduledFor) updateData.scheduledFor = data.scheduledFor;
  if (data.subject) updateData.subject = data.subject;
  if (data.htmlBody) updateData.htmlBody = data.htmlBody;
  if (data.status) updateData.status = data.status;

  return await prisma.scheduledEmail.update({
    where: { id: data.id },
    data: updateData,
  });
}

export async function markScheduledEmailAsSent(id: string, emailLogId: string) {
  return await prisma.scheduledEmail.update({
    where: { id },
    data: {
      status: "SENT",
      sentAt: new Date(),
      emailLogId,
    },
  });
}

export async function cancelScheduledEmail(id: string) {
  return await prisma.scheduledEmail.update({
    where: { id },
    data: {
      status: "CANCELLED",
    },
  });
}
