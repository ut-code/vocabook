import { getCurrentUser } from "@/lib/session";
import LogoutButton from "@/components/auth/LogoutButton";
import AuthNavLinks from "@/components/auth/AuthNavLinks";

// ヘッダーの中で唯一セッションを参照する部分。ここをSuspenseで囲むことで、
// 他の静的な部分（ナビゲーションなど）まで動的レンダリングに巻き込まれるのを防ぐ
export default async function HeaderAuthStatus() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:inline">
          {user.name}
        </span>
        <LogoutButton />
      </div>
    );
  }

  return <AuthNavLinks />;
}
