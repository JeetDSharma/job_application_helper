import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

type UpsertCompanyInput = {
  companyName: string;
};

export async function upsertCompany({
  companyName,
}: UpsertCompanyInput): Promise<string> {
  const response = await prisma.company.upsert({
    where: { companyName },
    update: {},
    create: { companyName },
    select: {
      id: true,
    },
  });
  return response.id;
}
