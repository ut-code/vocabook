-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NotebookInvite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "notebookId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotebookInvite_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NotebookInvite" ("createdAt", "id", "notebookId", "token") SELECT "createdAt", "id", "notebookId", "token" FROM "NotebookInvite";
DROP TABLE "NotebookInvite";
ALTER TABLE "new_NotebookInvite" RENAME TO "NotebookInvite";
CREATE UNIQUE INDEX "NotebookInvite_token_key" ON "NotebookInvite"("token");
CREATE INDEX "NotebookInvite_notebookId_idx" ON "NotebookInvite"("notebookId");
CREATE TABLE "new_NotebookShare" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notebookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotebookShare_notebookId_fkey" FOREIGN KEY ("notebookId") REFERENCES "Notebook" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NotebookShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NotebookShare" ("createdAt", "id", "notebookId", "userId") SELECT "createdAt", "id", "notebookId", "userId" FROM "NotebookShare";
DROP TABLE "NotebookShare";
ALTER TABLE "new_NotebookShare" RENAME TO "NotebookShare";
CREATE INDEX "NotebookShare_userId_idx" ON "NotebookShare"("userId");
CREATE UNIQUE INDEX "NotebookShare_notebookId_userId_key" ON "NotebookShare"("notebookId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

