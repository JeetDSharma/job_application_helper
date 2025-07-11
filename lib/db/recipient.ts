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
  const response = await prisma.recipient.upsert({
    where: { email },
    update: {},
    create: { email, name, isAlumni, companyId },
    select: {
      id: true,
    },
  });
  return response.id;
}
