-- CreateTable
CREATE TABLE "ScheduledEmail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledFor" DATETIME NOT NULL,
    "recipientId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "htmlBody" TEXT NOT NULL,
    "jobPosition" TEXT NOT NULL,
    "templateUsed" TEXT NOT NULL,
    "isFollowUp" BOOLEAN NOT NULL DEFAULT false,
    "isAlum" BOOLEAN NOT NULL DEFAULT false,
    "isRecruiter" BOOLEAN NOT NULL DEFAULT false,
    "tenureYears" INTEGER,
    "personalMention" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "sentAt" DATETIME,
    "emailLogId" TEXT,
    CONSTRAINT "ScheduledEmail_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ScheduledEmail_scheduledFor_status_idx" ON "ScheduledEmail"("scheduledFor", "status");

-- CreateIndex
CREATE INDEX "ScheduledEmail_recipientId_idx" ON "ScheduledEmail"("recipientId");
