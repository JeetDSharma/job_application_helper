import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

type UpsertCompanyInput = {
  companyName: string;
};

type FetchCompanyInput = {
  skip?: number;
  take?: number;
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

export async function fetchCompanyCount() {
  const response = await prisma.company.count();
  return response;
}

export async function fetchCompany({ skip, take }: FetchCompanyInput) {
  const response = await prisma.company.findMany({
    skip: skip || 0,
    take: take || 10,
  });
  return response;
}
