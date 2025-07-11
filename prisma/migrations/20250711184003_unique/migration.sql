/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Recipient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Recipient_email_companyId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Recipient_email_key" ON "Recipient"("email");
