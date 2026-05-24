export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
          Phase 1 — Project Setup Complete
        </div>
        <h1 className="text-4xl font-medium tracking-tight">Argus</h1>
        <p className="text-muted-foreground max-w-sm">
          AI-powered company intelligence platform. Architecture and database coming next.
        </p>
      </div>
    </main>
  )
}
