-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ScheduledEmail" (
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
    "resumeFile" TEXT NOT NULL DEFAULT 'resume.pdf',
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "sentAt" DATETIME,
    "emailLogId" TEXT,
    CONSTRAINT "ScheduledEmail_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ScheduledEmail" ("createdAt", "emailLogId", "htmlBody", "id", "isAlum", "isFollowUp", "isRecruiter", "jobPosition", "personalMention", "recipientId", "scheduledFor", "sentAt", "status", "subject", "templateUsed", "tenureYears") SELECT "createdAt", "emailLogId", "htmlBody", "id", "isAlum", "isFollowUp", "isRecruiter", "jobPosition", "personalMention", "recipientId", "scheduledFor", "sentAt", "status", "subject", "templateUsed", "tenureYears" FROM "ScheduledEmail";
DROP TABLE "ScheduledEmail";
ALTER TABLE "new_ScheduledEmail" RENAME TO "ScheduledEmail";
CREATE INDEX "ScheduledEmail_scheduledFor_status_idx" ON "ScheduledEmail"("scheduledFor", "status");
CREATE INDEX "ScheduledEmail_recipientId_idx" ON "ScheduledEmail"("recipientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
