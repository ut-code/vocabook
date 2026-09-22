/*
  Warnings:

  - You are about to drop the column `starCount` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `starred` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `Card` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "NotebookShare" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notebookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotebookShare_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NotebookShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NotebookInvite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "notebookId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotebookInvite_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CardProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "starred" BOOLEAN NOT NULL DEFAULT false,
    "starCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CardProgress_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CardProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 既存の★・暗記モード表示回数は、これまで単語帳オーナー1人分の状態として保存されていた。
-- CardをCardProgress（ユーザーごと）に分割するにあたり、そのデータを単語帳オーナーの進捗として引き継ぐ
INSERT INTO "CardProgress" ("id", "cardId", "userId", "starred", "starCount", "viewCount", "updatedAt")
SELECT lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(6))),
       "Card"."id",
       "Notebook"."userId",
       "Card"."starred",
       "Card"."starCount",
       "Card"."viewCount",
       "Card"."updatedAt"
FROM "Card"
JOIN "Notebook" ON "Notebook"."id" = "Card"."notebookId"
WHERE "Card"."starred" = 1 OR "Card"."starCount" > 0 OR "Card"."viewCount" > 0;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notebookId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Card_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("createdAt", "data", "id", "notebookId", "position", "updatedAt") SELECT "createdAt", "data", "id", "notebookId", "position", "updatedAt" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE INDEX "Card_notebookId_position_idx" ON "Card"("notebookId", "position");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "NotebookShare_userId_idx" ON "NotebookShare"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotebookShare_notebookId_userId_key" ON "NotebookShare"("notebookId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotebookInvite_token_key" ON "NotebookInvite"("token");

-- CreateIndex
CREATE INDEX "NotebookInvite_notebookId_idx" ON "NotebookInvite"("notebookId");

-- CreateIndex
CREATE INDEX "CardProgress_userId_starred_idx" ON "CardProgress"("userId", "starred");

-- CreateIndex
CREATE UNIQUE INDEX "CardProgress_cardId_userId_key" ON "CardProgress"("cardId", "userId");
