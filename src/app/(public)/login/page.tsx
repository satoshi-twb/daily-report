export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">営業日報システム</h1>
          <p className="text-sm text-muted-foreground">
            アカウント情報を入力してログインしてください
          </p>
        </div>
        {/* ログインフォームは SCR-01 実装 Issue で追加 */}
        <p className="text-center text-sm text-muted-foreground">Coming soon...</p>
      </div>
    </main>
  );
}
