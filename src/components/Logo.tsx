import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5">
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg neon-border bg-card/60">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--neon-cyan)" }}>
          <path d="M3 12c4-7 14-7 18 0" />
          <path d="M3 12c4 7 14 7 18 0" />
          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
        </svg>
        <span className="absolute inset-0 rounded-lg animate-pulse-glow" aria-hidden />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        <span className="text-gradient-neon">Budget</span>
        <span className="text-foreground">Wise</span>
      </span>
    </Link>
  );
}
