import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
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
  description:
    "自分だけの多次元単語帳を作って共有できる、多言語対応の暗記学習アプリ。",
};

// ルートレイアウト
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {/* 常駐型サイドバー */}
        <Sidebar />

        {/* メインエリア（ヘッダー・コンテンツ・フッター） */}
        <div className="flex flex-1 flex-col min-w-0">
          <Header />
          <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

