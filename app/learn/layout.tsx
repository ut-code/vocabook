import { EssayWidget } from "@/components/essay/EssayWidget";

// /learn配下の全ページ（各言語の静的セクション・動的[language]ページの両方）に共通で
// 右下固定の作文ウィジェットを表示するためのレイアウト
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <EssayWidget />
    </>
  );
}
