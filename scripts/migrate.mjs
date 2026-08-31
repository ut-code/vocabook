#!/usr/bin/env node
// prisma migrate deploy のマイグレーションエンジンは file: スキームしか理解できず、
// Turso の libsql:// / https:// / wss:// URL を渡すと P1013 (scheme not recognized) で失敗する。
// ローカルのファイルDBは純正の prisma migrate deploy に任せ、Turso向けだけ
// @libsql/client で migration.sql を直接流し込む。
import "dotenv/config";
import { createClient } from "@libsql/client";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL が設定されていません");
}

if (url.startsWith("file:")) {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
  process.exit(0);
}

const migrationsDir = path.join(import.meta.dirname, "..", "prisma", "migrations");
const migrationNames = readdirSync(migrationsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const client = createClient({ url });

await client.execute(`
  CREATE TABLE IF NOT EXISTS "_libsql_migrations" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "appliedAt" TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const appliedRows = await client.execute('SELECT "name" FROM "_libsql_migrations"');
const applied = new Set(appliedRows.rows.map((row) => row.name));

for (const name of migrationNames) {
  if (applied.has(name)) {
    console.log(`skip (already applied): ${name}`);
    continue;
  }
  const sql = readFileSync(path.join(migrationsDir, name, "migration.sql"), "utf8");
  console.log(`applying migration: ${name}`);
  await client.executeMultiple(sql);
  await client.execute({
    sql: 'INSERT INTO "_libsql_migrations" ("name") VALUES (?)',
    args: [name],
  });
}

console.log("migrations up to date");
client.close();
