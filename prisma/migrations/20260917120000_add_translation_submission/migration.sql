-- CreateTable
CREATE TABLE "TranslationSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "sourceText" TEXT NOT NULL,
    "referenceTranslation" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "feedback" JSONB NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TranslationSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TranslationSubmission_userId_language_createdAt_idx" ON "TranslationSubmission"("userId", "language", "createdAt");
