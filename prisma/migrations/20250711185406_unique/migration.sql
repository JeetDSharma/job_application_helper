/*
  Warnings:

  - A unique constraint covering the columns `[companyName]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Company_companyName_key" ON "Company"("companyName");
