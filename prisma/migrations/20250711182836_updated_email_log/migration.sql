-- AlterTable
ALTER TABLE "EmailLog" ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
