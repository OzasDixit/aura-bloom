import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Wallet, Calendar, Users, ArrowRight, Loader2, Plus, Minus, Sparkles, Compass } from "lucide-react";
import { DESTINATIONS } from "@/lib/destinations.data";

const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];

function getMonthsFromRange(rangeStr: string): string[] {
  const str = rangeStr.toLowerCase();
  if (str.includes("year-round") || str.includes("all year") || str.includes("any time")) {
    return [...MONTH_NAMES];
  }
  
  const months: string[] = [];
  const parts = str.split(",");
  for (const part of parts) {
    const range = part.trim().split("-");
    if (range.length === 1) {
      const startTrim = range[0].trim();
      const found = MONTH_NAMES.find(m => m.startsWith(startTrim) || startTrim.startsWith(m));
      if (found) months.push(found);
    } else if (range.length === 2) {
      const startTrim = range[0].trim();
      const endTrim = range[1].trim();
      const startIdx = MONTH_NAMES.findIndex(m => m.startsWith(startTrim) || startTrim.startsWith(m));
      const endIdx = MONTH_NAMES.findIndex(m => m.startsWith(endTrim) || endTrim.startsWith(m));
      
      if (startIdx !== -1 && endIdx !== -1) {
        let curr = startIdx;
        while (curr !== endIdx) {
          months.push(MONTH_NAMES[curr]);
          curr = (curr + 1) % 12;
        }
        months.push(MONTH_NAMES[endIdx]);
      }
    }
  }
  return months;
}

const seasonMonths: Record<string, string[]> = {
  winter: ["november", "december", "january", "february", "march", "october"],
  summer: ["march", "april", "may", "june"],
  monsoon: ["july", "august", "september", "october"]
};



const POPULAR = ["Goa", "Manali", "Jaipur", "Pondicherry", "Rishikesh", "Udaipur"];

const VIBE_OPTIONS = ["Relaxed", "Adventure", "Cultural", "Nature", "Nightlife"];
const FOOD_OPTIONS = ["Local Specialties", "Street Food", "Fine Dining", "Cafe Culture", "Vegetarian"];
const PACE_OPTIONS = ["Slow", "Moderate", "Active"];

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
  const [selectedSeason, setSelectedSeason] = useState<"winter" | "summer" | "monsoon">("winter");

  const [vibe, setVibe] = useState("Relaxed");
  const [food, setFood] = useState("Local Specialties");
  const [pace, setPace] = useState("Moderate");

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const seasonDestinations = DESTINATIONS.filter(d => {
    const activeMonths = getMonthsFromRange(d.bestTime);
    const targetMonths = seasonMonths[selectedSeason] || [];
    return targetMonths.some(m => activeMonths.includes(m));
  }).slice(0, 8);

  useEffect(() => {
    if (defaultDestination) {
      setDestination(defaultDestination);
    }
    const presetSource = localStorage.getItem("budgetwise_preset_source");
    if (presetSource) {
      setSource(presetSource);
      localStorage.removeItem("budgetwise_preset_source");
    }
  }, [defaultDestination]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setShowSuggestions(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleDestinationChange = (val: string) => {
    setDestination(val);
    if (val.trim().length > 0) {
      const filtered = DESTINATIONS.filter(d => 
        d.name.toLowerCase().includes(val.toLowerCase())
      ).map(d => d.name);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (name: string) => {
    setDestination(name);
    setShowSuggestions(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) return;
    setLoading(true);
    navigate({
      to: "/plan",
      search: { source, destination, budget, days, travelers, currency: "INR", vibe, food, pace },
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

          <div className="space-y-2 relative" onClick={(e) => e.stopPropagation()}>
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <MapPin className="h-4 w-4 text-purple-400" />
              To
            </span>
            <input
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              onFocus={() => {
                if (destination.trim().length > 0) {
                  const filtered = DESTINATIONS.filter(d => 
                    d.name.toLowerCase().includes(destination.toLowerCase())
                  ).map(d => d.name);
                  setSuggestions(filtered);
                  setShowSuggestions(true);
                } else {
                  setSuggestions(DESTINATIONS.map(d => d.name).slice(0, 8));
                  setShowSuggestions(true);
                }
              }}
              placeholder="e.g. Goa"
              className="input-base"
              required
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-2xl p-2.5 space-y-1">
                {suggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => selectSuggestion(name)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
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

        {/* Vibe, Food & Pace Selection */}
        <div className="space-y-4 border-t border-white/5 pt-5 animate-fade-up">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <Compass className="h-4 w-4 text-indigo-400" />
            Travel Preferences
          </span>

          <div className="grid gap-5 sm:grid-cols-3">
            {/* Vibe */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-wide">Vibe</span>
              <div className="flex flex-wrap gap-1.5">
                {VIBE_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setVibe(opt)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 ${
                      vibe === opt
                        ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 shadow-[0_0_12px_rgba(99,102,241,0.15)]"
                        : "bg-white/[0.02] border border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/[0.04]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Style */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-wide">Dining</span>
              <div className="flex flex-wrap gap-1.5">
                {FOOD_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setFood(opt)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 ${
                      food === opt
                        ? "bg-purple-500/20 border border-purple-500/40 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                        : "bg-white/[0.02] border border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/[0.04]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Pace */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-wide">Pace</span>
              <div className="flex flex-wrap gap-1.5">
                {PACE_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setPace(opt)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 ${
                      pace === opt
                        ? "bg-pink-500/20 border border-pink-500/40 text-pink-200 shadow-[0_0_12px_rgba(236,72,153,0.15)]"
                        : "bg-white/[0.02] border border-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/[0.04]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Explore by Season Suggestions */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
              <Compass className="h-3.5 w-3.5 text-indigo-400" />
              Not sure where to go? Explore by Season
            </span>
          </div>
          
          {/* Season Toggle Tabs */}
          <div className="flex gap-2 bg-white/[0.02] border border-white/5 p-1 rounded-xl">
            {(["winter", "summer", "monsoon"] as const).map((season) => (
              <button
                type="button"
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`flex-1 py-1.5 text-center rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 ${
                  selectedSeason === season
                    ? "bg-white text-black font-bold shadow-md scale-100"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {season === "winter" ? "❄️ Winter" : season === "summer" ? "☀️ Summer" : "🌧️ Monsoon"}
              </button>
            ))}
          </div>

          {/* Season Destinations List */}
          <div className="flex flex-wrap gap-2 pt-1 animate-scale-in">
            {seasonDestinations.map((d) => (
              <button
                type="button"
                key={d.name}
                onClick={() => setDestination(d.name)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                  destination.toLowerCase() === d.name.toLowerCase()
                    ? "bg-indigo-500/15 border-indigo-500/35 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)] scale-[1.03]"
                    : "bg-white/[0.01] border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{d.name}</span>
                  <span className="text-[9px] font-normal text-zinc-500 font-mono">({d.bestTime.split(" ")[0]})</span>
                </div>
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
            <span>Map My Escape</span>
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
