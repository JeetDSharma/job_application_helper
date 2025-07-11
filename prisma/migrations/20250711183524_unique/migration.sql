/*
  Warnings:

  - A unique constraint covering the columns `[email,companyId]` on the table `Recipient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Recipient_email_companyId_key" ON "Recipient"("email", "companyId");
