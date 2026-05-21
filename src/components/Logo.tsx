import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5">
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12c4-7 14-7 18 0" />
          <path d="M3 12c4 7 14 7 18 0" />
          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-purple-300 transition-all duration-300">Budget</span>
        <span className="text-white">Wise</span>
      </span>
    </Link>
  );
}
