import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Wallet, Calendar, Users, ArrowRight, Loader2, Plus, Minus, Sparkles } from "lucide-react";

const POPULAR = ["Goa", "Manali", "Jaipur", "Pondicherry", "Rishikesh", "Udaipur"];

export function PlannerForm({ 
  compact = false,
  defaultDestination = ""
}: { 
  compact?: boolean;
  defaultDestination?: string;
}) {
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState(defaultDestination);
  const [budget, setBudget] = useState<number>(15000);
  const [days, setDays] = useState<number>(3);
  const [travelers, setTravelers] = useState<number>(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultDestination) {
      setDestination(defaultDestination);
    }
  }, [defaultDestination]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) return;
    setLoading(true);
    navigate({
      to: "/plan",
      search: { source, destination, budget, days, travelers, currency: "INR" },
    });
  };

  const adjustDays = (val: number) => {
    setDays((prev) => Math.max(1, Math.min(30, prev + val)));
  };

  const adjustTravelers = (val: number) => {
    setTravelers((prev) => Math.max(1, Math.min(20, prev + val)));
  };

  const presetBudgets = [
    { label: "Backpacker", value: 5000 },
    { label: "Explorer", value: 15000 },
    { label: "Premium", value: 45000 }
  ];

  return (
    <form
      onSubmit={submit}
      className={`relative w-full ${compact ? "" : "animate-fade-up"}`}
    >
      <div className="space-y-6">
        
        {/* Source & Destination */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <MapPin className="h-4 w-4 text-indigo-400" />
              From
            </span>
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. Hyderabad"
              className="input-base"
              required
            />
          </div>

          <div className="space-y-2">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <MapPin className="h-4 w-4 text-purple-400" />
              To
            </span>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Goa"
              className="input-base"
              required
            />
          </div>
        </div>

        {/* Budget Section */}
        <div className="space-y-3.5 border-t border-white/5 pt-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Wallet className="h-4 w-4 text-emerald-400" />
              Total Budget (₹)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              ₹{Math.round(budget / (days || 1)).toLocaleString()} / day allowance
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-white/[0.02] border border-white/5 rounded-2xl p-4.5">
            <input
              type="number"
              min={500}
              max={250000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full sm:w-36 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-base font-bold text-white font-mono outline-none focus:border-emerald-500/40 text-center"
              required
            />
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="flex-1 accent-emerald-500 h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10"
            />
          </div>
          
          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {presetBudgets.map((preset) => (
              <button
                type="button"
                key={preset.label}
                onClick={() => setBudget(preset.value)}
                className={`p-2.5 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                  budget === preset.value
                    ? "bg-emerald-500/10 border-emerald-500/35 text-white shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                    : "bg-white/[0.02] border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/[0.04]"
                }`}
              >
                <div className="text-[10px] font-bold tracking-wider uppercase text-zinc-500">{preset.label}</div>
                <div className="text-xs font-mono font-bold text-white mt-1">₹{preset.value.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Days and Travelers */}
        <div className="grid grid-cols-2 gap-5 border-t border-white/5 pt-5">
          {/* Days */}
          <div className="space-y-2.5">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Calendar className="h-4 w-4 text-indigo-400" />
              Duration (Days)
            </span>
            <div className="flex items-center justify-between bg-white/[0.02] border border-white/10 rounded-xl px-2 py-1.5 h-[48px]">
              <button
                type="button"
                onClick={() => adjustDays(-1)}
                className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer select-none active:scale-95"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="font-display font-bold text-white text-base">{days}</span>
              <button
                type="button"
                onClick={() => adjustDays(1)}
                className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer select-none active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Travelers */}
          <div className="space-y-2.5">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Users className="h-4 w-4 text-purple-400" />
              Travelers
            </span>
            <div className="flex items-center justify-between bg-white/[0.02] border border-white/10 rounded-xl px-2 py-1.5 h-[48px]">
              <button
                type="button"
                onClick={() => adjustTravelers(-1)}
                className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer select-none active:scale-95"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="font-display font-bold text-white text-base">{travelers}</span>
              <button
                type="button"
                onClick={() => adjustTravelers(1)}
                className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer select-none active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Trending Suggestions */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
            <Sparkles className="h-3.5 w-3.5" />
            Trending Hotspots
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setDestination(p)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                  destination.toLowerCase() === p.toLowerCase()
                    ? "bg-indigo-500/10 border-indigo-500/30 text-white"
                    : "bg-white/[0.01] border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

      </div>

      <button
        type="submit"
        disabled={loading}
        className="group mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-4.5 text-base font-bold transition-all hover:opacity-95 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(168,85,247,0.35)] disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <span>Build AI Itinerary</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
          </>
        )}
      </button>

      <style>{`
        .input-base {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.85rem;
          padding: 0.8rem 1.1rem;
          font-size: 0.95rem;
          color: white;
          outline: none;
          transition: all 0.3s ease;
        }
        .input-base::placeholder { color: rgba(255, 255, 255, 0.3); }
        .input-base:focus {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
      `}</style>
    </form>
  );
}
