-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ConjugationProgress";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SectionProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "sectionSlug" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "box" INTEGER NOT NULL DEFAULT 0,
    "autoTagged" BOOLEAN NOT NULL DEFAULT false,
    "manuallyTagged" BOOLEAN NOT NULL DEFAULT false,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "nextReviewAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SectionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SectionProgress_userId_language_needsReview_idx" ON "SectionProgress"("userId", "language", "needsReview");

-- CreateIndex
CREATE UNIQUE INDEX "SectionProgress_userId_language_sectionSlug_key" ON "SectionProgress"("userId", "language", "sectionSlug");

