import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

export async function upsertCompany(companyName: string) {
  return await prisma.company.upsert({
    where: { companyName },
    update: {},
    create: { companyName },
  });
}
