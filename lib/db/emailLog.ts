import { PrismaClient } from "@/app/generated/prisma";
import { Pinyon_Script } from "next/font/google";
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
