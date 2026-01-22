/*
  Warnings:

  - You are about to drop the column `followUpScheduled` on the `EmailLog` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmailLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipientId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "jobPosition" TEXT NOT NULL,
    "errorMessage" TEXT,
    "templateUsed" TEXT,
    "isMarkedWrong" BOOLEAN NOT NULL DEFAULT false,
    "markedAt" DATETIME,
    "notes" TEXT,
    "responseReceived" BOOLEAN NOT NULL DEFAULT false,
    "responseDate" DATETIME,
    "responseType" TEXT,
    "followUpCount" INTEGER NOT NULL DEFAULT 0,
    "lastFollowUpDate" DATETIME,
    CONSTRAINT "EmailLog_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EmailLog" ("errorMessage", "followUpCount", "id", "isMarkedWrong", "jobPosition", "lastFollowUpDate", "markedAt", "notes", "recipientId", "responseDate", "responseReceived", "responseType", "sentAt", "status", "templateUsed") SELECT "errorMessage", "followUpCount", "id", "isMarkedWrong", "jobPosition", "lastFollowUpDate", "markedAt", "notes", "recipientId", "responseDate", "responseReceived", "responseType", "sentAt", "status", "templateUsed" FROM "EmailLog";
DROP TABLE "EmailLog";
ALTER TABLE "new_EmailLog" RENAME TO "EmailLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
