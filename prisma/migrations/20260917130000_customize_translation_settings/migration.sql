-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TranslationSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "problemSource" TEXT NOT NULL DEFAULT 'preset',
    "direction" TEXT NOT NULL,
    "problemId" TEXT,
    "level" TEXT NOT NULL,
    "sourceText" TEXT NOT NULL,
    "referenceTranslation" TEXT,
    "content" TEXT NOT NULL,
    "feedback" JSONB NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TranslationSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TranslationSubmission" ("id", "userId", "language", "direction", "problemId", "level", "sourceText", "referenceTranslation", "content", "feedback", "model", "createdAt")
SELECT "id", "userId", "language", "direction", "problemId", "level", "sourceText", "referenceTranslation", "content", "feedback", "model", "createdAt" FROM "TranslationSubmission";
DROP TABLE "TranslationSubmission";
ALTER TABLE "new_TranslationSubmission" RENAME TO "TranslationSubmission";
CREATE INDEX "TranslationSubmission_userId_language_createdAt_idx" ON "TranslationSubmission"("userId", "language", "createdAt");
PRAGMA foreign_keys=ON;
