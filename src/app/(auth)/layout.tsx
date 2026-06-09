/**
 * Layout for authentication pages (login, signup).
 * Intentionally minimal — no navigation, no sidebar.
 * Just a clean centered page with a subtle background.
 */
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="relative min-h-screen bg-background">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative">{children}</div>
      </div>
    )
  }