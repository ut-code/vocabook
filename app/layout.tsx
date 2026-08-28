import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { getAllLanguageSections } from "@/app/learn/content";
import { LANGUAGES } from "@/app/learn/languages";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vocabook | 多次元単語帳アプリ",
  description: "自分だけの多次元単語帳を作って共有できる、多言語対応の暗記学習アプリ。",
};

// ルートレイアウト（全ページ共通でHeader, Sidebar, Footerを一元管理）
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // サイドバーで利用する全言語のセクション一覧を取得
  const allSections = await getAllLanguageSections(LANGUAGES.map((l) => l.languageSlug));

  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex flex-1 flex-col md:flex-row">
          {/* ルートレイアウト直下にSidebarを組み込み（/ などのTOPページではSidebar内部で表示を判定制御） */}
          <Sidebar allSections={allSections} />
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
