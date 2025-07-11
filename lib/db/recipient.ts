import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

export async function upsertRecipient(
  email: string,
  name: string,
  companyId: string,
  isAlumni: boolean
) {
  return await prisma.recipient.upsert({
    where: { email },
    update: {},
    create: { email, name, isAlumni, companyId },
  });
}
