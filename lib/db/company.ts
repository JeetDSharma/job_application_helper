import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

type UpsertCompanyInput = {
  companyName: string;
};

type FetchCompanyInput = {
  skip?: number;
  take?: number;
};
type CompanyTableInput = {
  companyName: string;
  createdAt: Date;
  recipientCount: number;
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
  const companyCountResponse = await prisma.company.count();
  const recipientCountResponse = await prisma.recipient.count();
  return {
    companyCount: companyCountResponse,
    recipientCount: recipientCountResponse,
  };
}

export async function fetchCompany({
  skip = 0,
  take = 10,
}: FetchCompanyInput): Promise<CompanyTableInput[]> {
  const response = await prisma.company.findMany({
    skip,
    take,
    select: {
      companyName: true,
      createdAt: true,
      _count: {
        select: { recipients: true },
      },
    },
  });
  return response.map((company) => ({
    companyName: company.companyName,
    createdAt: company.createdAt,
    recipientCount: company._count.recipients,
  }));
}
