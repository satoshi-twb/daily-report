import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "営業日報システム",
  description: "営業担当者の日々の活動を記録・報告するシステム",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={geist.className}>{children}</body>
    </html>
  );
}
