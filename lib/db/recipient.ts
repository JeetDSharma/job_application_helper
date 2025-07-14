import { PrismaClient } from "@/app/generated/prisma";
const prisma = new PrismaClient();

type UpsertRecipientInput = {
  email: string;
  name: string;
  companyId: string;
  isAlumni: boolean;
};

export async function upsertRecipient({
  email,
  name,
  companyId,
  isAlumni,
}: UpsertRecipientInput): Promise<string> {
  const normalizedName = name.toLowerCase();
  const response = await prisma.recipient.upsert({
    where: { email },
    update: {},
    create: { email, name: normalizedName, isAlumni, companyId },
    select: {
      id: true,
    },
  });
  return response.id;
}
