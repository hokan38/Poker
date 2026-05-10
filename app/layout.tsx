import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTO Wizard 解説くん",
  description:
    "GTO Wizardのトレーニングモードのスクリーンショットをアップロードすると、なぜそのプレイが正解なのかを日本語で解説します。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-felt-dark text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
