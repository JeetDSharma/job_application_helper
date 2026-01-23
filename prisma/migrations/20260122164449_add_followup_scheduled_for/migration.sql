-- AlterTable
ALTER TABLE "EmailLog" ADD COLUMN "followUpScheduledFor" DATETIME;

-- CreateIndex
CREATE INDEX "EmailLog_followUpScheduledFor_responseReceived_idx" ON "EmailLog"("followUpScheduledFor", "responseReceived");
