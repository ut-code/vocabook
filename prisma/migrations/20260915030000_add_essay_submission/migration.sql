-- CreateTable
CREATE TABLE "EssaySubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "topicSource" TEXT NOT NULL,
    "topicId" TEXT,
    "topicPrompt" TEXT NOT NULL,
    "targetWordCount" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "feedback" JSONB NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EssaySubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "EssaySubmission_userId_language_createdAt_idx" ON "EssaySubmission"("userId", "language", "createdAt");
