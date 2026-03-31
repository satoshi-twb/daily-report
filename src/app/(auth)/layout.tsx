import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* ナビゲーションは共通レイアウト実装 Issue で追加 */}
      <main>{children}</main>
    </div>
  );
}
