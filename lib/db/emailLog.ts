import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

type InsertEmailLog = {
  recipientId: string;
  jobPosition: string;
};

export async function insertEmailLog({
  recipientId,
  jobPosition,
}: InsertEmailLog): Promise<string> {
  const response = await prisma.emailLog.create({
    data: {
      recipientId,
      jobPosition,
    },
    select: {
      id: true,
    },
  });
  return response.id;
}

export async function updateEmailStatus(emailId: string) {
  return await prisma.emailLog.update({
    where: {
      id: emailId,
    },
    data: {
      status: "SENT",
    },
  });
}
