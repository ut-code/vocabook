import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

// 1リクエスト内で何度呼んでもDBアクセスは1回だけになるようcacheでメモ化する
export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
});

// ログインしていなければ /login に差し戻す。ページ・Server Actionの両方から使う
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
