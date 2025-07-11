import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

export async function insertEmailLog(recipientId: string, jobPosition: string) {
  return await prisma.emailLog.create({
    data: {
      recipientId,
      jobPosition,
    },
  });
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
