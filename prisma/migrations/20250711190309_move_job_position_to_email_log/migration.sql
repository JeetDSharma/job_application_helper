/*
  Warnings:

  - You are about to drop the column `jobPosition` on the `Recipient` table. All the data in the column will be lost.
  - Added the required column `jobPosition` to the `EmailLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailLog" ADD COLUMN     "jobPosition" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipient" DROP COLUMN "jobPosition";
