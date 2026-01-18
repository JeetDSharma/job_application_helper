-- CreateTable
CREATE TABLE "ScheduledEmail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "jobPosition" TEXT NOT NULL,
    "isAlum" BOOLEAN NOT NULL DEFAULT false,
    "isRecruiter" BOOLEAN NOT NULL DEFAULT false,
    "tenureYears" TEXT,
    "personalMention" TEXT,
    "scheduledFor" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" DATETIME,
    "errorMessage" TEXT
);

-- CreateIndex
CREATE INDEX "ScheduledEmail_scheduledFor_status_idx" ON "ScheduledEmail"("scheduledFor", "status");

-- CreateIndex
CREATE INDEX "ScheduledEmail_status_idx" ON "ScheduledEmail"("status");
