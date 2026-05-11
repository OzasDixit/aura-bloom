import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Wallet, Calendar, Users, ArrowRight, Loader2 } from "lucide-react";

const POPULAR = ["Goa", "Manali", "Jaipur", "Pondicherry", "Rishikesh", "Udaipur"];

export function PlannerForm({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState<number>(15000);
  const [days, setDays] = useState<number>(3);
  const [travelers, setTravelers] = useState<number>(2);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) return;
    setLoading(true);
    navigate({
      to: "/plan",
      search: { source, destination, budget, days, travelers },
    });
  };

  return (
    <form
      onSubmit={submit}
      className={`glass-strong relative w-full rounded-2xl p-5 sm:p-6 neon-border animate-scale-in ${compact ? "" : "shadow-[var(--shadow-neon)]"}`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field icon={<MapPin className="h-4 w-4" />} label="From">
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. Hyderabad"
            className="input-base"
            required
          />
        </Field>
        <Field icon={<MapPin className="h-4 w-4" style={{ color: "var(--neon-magenta)" }} />} label="To">
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Goa"
            className="input-base"
            required
          />
        </Field>
        <Field icon={<Wallet className="h-4 w-4" />} label="Total Budget (₹)">
          <input
            type="number"
            min={500}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="input-base"
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field icon={<Calendar className="h-4 w-4" />} label="Days">
            <input
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="input-base"
            />
          </Field>
          <Field icon={<Users className="h-4 w-4" />} label="Travelers">
            <input
              type="number"
              min={1}
              max={20}
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="input-base"
            />
          </Field>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="mr-1">Trending:</span>
        {POPULAR.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => setDestination(p)}
            className="rounded-full border border-border/60 bg-card/40 px-3 py-1 transition-all hover:border-[color:var(--neon-cyan)] hover:text-foreground hover:glow-cyan"
          >
            {p}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all disabled:opacity-60"
        style={{ background: "var(--gradient-neon)", boxShadow: "var(--shadow-neon)" }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
        Plan my trip
      </button>

      <style>{`
        .input-base {
          width: 100%;
          background: color-mix(in oklab, var(--input) 100%, transparent);
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 0.7rem 0.9rem;
          font-size: 0.92rem;
          color: var(--foreground);
          outline: none;
          transition: all 0.2s ease;
        }
        .input-base::placeholder { color: var(--muted-foreground); }
        .input-base:focus {
          border-color: color-mix(in oklab, var(--neon-cyan) 60%, transparent);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--neon-cyan) 18%, transparent);
        }
      `}</style>
    </form>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span style={{ color: "var(--neon-cyan)" }}>{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}
