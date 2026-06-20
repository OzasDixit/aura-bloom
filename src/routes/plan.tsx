import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { planTrip, type TripPlan } from "@/lib/trip-planner.functions";
import { ArrowLeft, Loader2, MapPin, Wallet, Calendar, Users, Sparkles, Hotel, UtensilsCrossed, Bus, Compass, AlertCircle, TrendingUp, TrendingDown, Save, Check, SlidersHorizontal, MapPinned } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Search = z.object({
  source: z.string().min(1),
  destination: z.string().min(1),
  budget: z.number(),
  days: z.number().default(3),
  travelers: z.number().default(1),
  currency: z.string().default("INR"),
  savedTripId: z.string().optional(),
  vibe: z.string().default("Relaxed"),
  food: z.string().default("Local Specialties"),
  pace: z.string().default("Moderate"),
});

export const Route = createFileRoute("/plan")({
  validateSearch: (s) => Search.parse(s),
  component: PlanPage,
  head: ({ match }) => {
    const s = match.search as z.infer<typeof Search>;
    const title = `${s?.source ?? "Trip"} → ${s?.destination ?? ""} • BudgetWise Plan`;
    return {
      meta: [
        { title },
        { name: "description", content: `Budget travel plan from ${s?.source} to ${s?.destination}.` },
      ],
    };
  },
});

function PlanPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const planTripFn = useServerFn(planTrip);
  const [user, setUser] = useState<any>(null);
  const [loadedSavedTrip, setLoadedSavedTrip] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Clear Supabase redirect hash parameters from URL
    if (typeof window !== "undefined" && (window.location.hash.includes("access_token") || window.location.hash.includes("refresh_token"))) {
      setTimeout(() => {
        const cleanUrl = window.location.origin + window.location.pathname + window.location.search;
        window.history.replaceState(null, "", cleanUrl);
      }, 500);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (search.savedTripId) {
      try {
        const savedTripsStr = localStorage.getItem("budgetwise_saved_trips") || "[]";
        const savedTrips = JSON.parse(savedTripsStr);
        const matched = savedTrips.find((t: any) => t.id === search.savedTripId);
        if (matched) {
          setLoadedSavedTrip(matched);
        }
      } catch (err) {
        console.error("Failed to load saved trip:", err);
      }
    }
  }, [search.savedTripId]);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["plan", search],
    queryFn: () => planTripFn({ data: search }) as Promise<TripPlan>,
    retry: false,
    staleTime: 1000 * 60 * 10,
    enabled: !search.savedTripId,
  });

  return (
    <main className="relative z-10 min-h-screen pb-32 bg-transparent selection:bg-white/10 selection:text-white">

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8">
        <Logo />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-foreground transition-all hover:bg-white/10 hover:border-white/20 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            New trip
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-3 pr-2 py-1 backdrop-blur-md animate-scale-in">
                <span className="text-xs font-medium text-zinc-300 max-w-[120px] truncate">
                  {user.email?.split("@")[0]}
                </span>
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {user.email?.[0]}
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
                className="text-xs font-semibold text-zinc-400 hover:text-red-400 transition-colors px-3 py-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/5 cursor-pointer"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-white"
            >
              Log in
            </Link>
          )}
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6">
        {/* trip header */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-12 backdrop-blur-md animate-fade-up">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Generated Itinerary
              </div>
              <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                <span>{search.source}</span>
                <span className="mx-4 text-muted-foreground font-light">→</span>
                <span>{search.destination}</span>
              </h1>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <Meta icon={<Wallet className="h-4 w-4" />} value={`₹${search.budget.toLocaleString()}`} label="Budget" />
              <Meta icon={<Calendar className="h-4 w-4" />} value={`${search.days}`} label="Days" />
              <Meta icon={<Users className="h-4 w-4" />} value={`${search.travelers}`} label="Travelers" />
            </div>
          </div>
        </div>

        {!loadedSavedTrip && (isLoading || isFetching) ? <LoadingState /> : null}

        {!loadedSavedTrip && error ? (
          <div className="mt-8 rounded-[1.5rem] border border-destructive/20 bg-destructive/5 p-8 animate-fade-up">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <div>
                <div className="font-semibold text-lg">We couldn't build your plan</div>
                <div className="mt-2 text-muted-foreground leading-relaxed">{(error as Error).message}</div>
                <button
                  onClick={() => refetch()}
                  className="mt-6 rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {loadedSavedTrip || data ? (
          <PlanContent 
            plan={loadedSavedTrip ? loadedSavedTrip.plan : data!} 
            budget={search.budget} 
            initialSavedState={loadedSavedTrip}
            search={search}
          />
        ) : null}
      </section>
    </main>
  );
}

function Meta({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm hover:border-white/20 transition-colors">
      <span className="text-indigo-400">{icon}</span>
      <div>
        <div className="text-base font-semibold leading-none text-white">{value}</div>
        <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">{label}</div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-8 animate-fade-up">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 backdrop-blur-sm">
        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          <div className="font-semibold text-lg text-white">Curating your perfect itinerary...</div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i} 
              className="h-24 rounded-2xl border border-white/5 bg-white/5" 
              style={{ animation: `pulse 2s ease-in-out ${i * 0.15}s infinite` }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface BudgetPercentages {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  buffer: number;
}

function PlanContent({ 
  plan, 
  budget, 
  initialSavedState,
  search 
}: { 
  plan: TripPlan; 
  budget: number; 
  initialSavedState?: any;
  search: any;
}) {
  const navigate = useNavigate();
  const days = search.days ?? plan.itinerary?.length ?? 3;
  const travelers = search.travelers ?? 1;

  const makeCheaper = () => {
    const newBudget = Math.max(500, Math.round((budget * 0.8) / 1000) * 1000);
    navigate({
      to: "/plan",
      search: { ...search, budget: newBudget },
    });
  };

  // 1. Sort options by cost ascending
  const sortedStays = [...(plan.stays ?? [])].sort((a, b) => a.price_per_night - b.price_per_night);
  const sortedRestaurants = [...(plan.restaurants ?? [])].sort((a, b) => a.avg_cost_per_meal - b.avg_cost_per_meal);
  const sortedTransport = [...(plan.transport ?? [])].sort((a, b) => a.estimated_cost - b.estimated_cost);
  const sortedAttractions = [...(plan.attractions ?? [])].sort((a, b) => a.estimated_cost - b.estimated_cost);

  // 2. Initialize sliders to 100% sum percentages
  const [percentages, setPercentages] = useState<BudgetPercentages>(() => {
    if (initialSavedState?.percentages) {
      return initialSavedState.percentages;
    }
    
    // Otherwise calculate from initial breakdown
    const breakdown = plan.budget_breakdown || {
      accommodation: budget * 0.3,
      food: budget * 0.25,
      transport: budget * 0.15,
      activities: budget * 0.2,
      buffer: budget * 0.1
    };

    const totalAmount = (breakdown.accommodation ?? 0) +
                        (breakdown.food ?? 0) +
                        (breakdown.transport ?? 0) +
                        (breakdown.activities ?? 0) +
                        (breakdown.buffer ?? 0);

    const getInitialPct = (val: number) => {
      if (totalAmount <= 0) return 20;
      return Math.round((val / totalAmount) * 100);
    };

    const initialPct = {
      accommodation: getInitialPct(breakdown.accommodation ?? 0),
      food: getInitialPct(breakdown.food ?? 0),
      transport: getInitialPct(breakdown.transport ?? 0),
      activities: getInitialPct(breakdown.activities ?? 0),
      buffer: getInitialPct(breakdown.buffer ?? 0),
    };

    let sum = initialPct.accommodation + initialPct.food + initialPct.transport + initialPct.activities + initialPct.buffer;
    if (sum !== 100) {
      const diff = 100 - sum;
      const keys = Object.keys(initialPct) as Array<keyof typeof initialPct>;
      const largestKey = keys.reduce((a, b) => initialPct[a] > initialPct[b] ? a : b);
      initialPct[largestKey] += diff;
    }

    return initialPct;
  });

  // 3. Initialize selection state
  const [selectedStayIdx, setSelectedStayIdx] = useState(() => {
    if (initialSavedState?.selectedStayIdx !== undefined) {
      return Math.min(initialSavedState.selectedStayIdx, sortedStays.length - 1);
    }
    return Math.min(1, sortedStays.length - 1); // Default to Standard (Index 1)
  });

  const [selectedRestaurantIdx, setSelectedRestaurantIdx] = useState(() => {
    if (initialSavedState?.selectedRestaurantIdx !== undefined) {
      return Math.min(initialSavedState.selectedRestaurantIdx, sortedRestaurants.length - 1);
    }
    return Math.min(1, sortedRestaurants.length - 1);
  });

  const [selectedTransportIdx, setSelectedTransportIdx] = useState(() => {
    if (initialSavedState?.selectedTransportIdx !== undefined) {
      return Math.min(initialSavedState.selectedTransportIdx, sortedTransport.length - 1);
    }
    return Math.min(1, sortedTransport.length - 1);
  });

  const [selectedAttractions, setSelectedAttractions] = useState<Set<number>>(() => {
    if (initialSavedState?.selectedAttractionIds) {
      return new Set(initialSavedState.selectedAttractionIds);
    }
    return new Set(Array.from({ length: sortedAttractions.length }, (_, i) => i));
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [activeDay, setActiveDay] = useState<number | "all">("all");

  const handleShareTrip = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  // 4. Clamped Proportional Percentage Adjustment System (sums to 100%)
  const adjustPercentages = (
    currentPcts: typeof percentages,
    activeKey: keyof typeof percentages,
    newValue: number
  ) => {
    const clampedVal = Math.min(80, Math.max(5, newValue)); // Clamp between 5% and 80% to keep allocations sane
    const delta = clampedVal - currentPcts[activeKey];
    
    const keys = Object.keys(currentPcts) as Array<keyof typeof percentages>;
    const otherKeys = keys.filter(k => k !== activeKey);
    
    const sumOthers = otherKeys.reduce((s, k) => s + currentPcts[k], 0);
    
    const updated = { ...currentPcts };
    updated[activeKey] = clampedVal;
    
    if (sumOthers > 0) {
      otherKeys.forEach(k => {
        const share = currentPcts[k] / sumOthers;
        updated[k] = Math.max(5, Math.round(currentPcts[k] - delta * share));
      });
    } else {
      const share = (100 - clampedVal) / otherKeys.length;
      otherKeys.forEach(k => {
        updated[k] = Math.max(5, Math.round(share));
      });
    }
    
    // Ensure final sum is exactly 100%
    let currentSum = keys.reduce((s, k) => s + updated[k], 0);
    if (currentSum !== 100) {
      const diff = 100 - currentSum;
      const adjustKey = otherKeys.reduce((a, b) => updated[a] > updated[b] ? a : b);
      updated[adjustKey] = Math.max(5, updated[adjustKey] + diff);
    }
    
    return updated;
  };

  // 5. Auto-select stays, dining, transport options that best fit target budgets
  const autoSelectOptions = (newPcts: typeof percentages) => {
    // Stays (Accommodation)
    const accBudget = (budget * newPcts.accommodation) / 100;
    let bestStayIdx = 0;
    for (let i = 0; i < sortedStays.length; i++) {
      const cost = sortedStays[i].price_per_night * days;
      if (cost <= accBudget) {
        bestStayIdx = i;
      }
    }
    setSelectedStayIdx(bestStayIdx);

    // Dining (Food)
    const foodBudget = (budget * newPcts.food) / 100;
    let bestRestIdx = 0;
    for (let i = 0; i < sortedRestaurants.length; i++) {
      const cost = sortedRestaurants[i].avg_cost_per_meal * 3 * days * travelers;
      if (cost <= foodBudget) {
        bestRestIdx = i;
      }
    }
    setSelectedRestaurantIdx(bestRestIdx);

    // Transit (Transport)
    const transBudget = (budget * newPcts.transport) / 100;
    let bestTransIdx = 0;
    for (let i = 0; i < sortedTransport.length; i++) {
      const cost = sortedTransport[i].estimated_cost;
      if (cost <= transBudget) {
        bestTransIdx = i;
      }
    }
    setSelectedTransportIdx(bestTransIdx);
  };

  const handlePctChange = (key: keyof typeof percentages, value: number) => {
    const updated = adjustPercentages(percentages, key, value);
    setPercentages(updated);
    autoSelectOptions(updated);
  };

  // 6. Save trip parameter state locally
  const handleSaveTrip = () => {
    try {
      const savedTripsStr = localStorage.getItem("budgetwise_saved_trips") || "[]";
      const savedTrips = JSON.parse(savedTripsStr);
      
      // Prevent duplicates if already loaded
      const matchedIdx = savedTrips.findIndex((t: any) => t.id === search.savedTripId);
      
      const tripData = {
        id: search.savedTripId || Math.random().toString(36).substring(2, 11),
        source: search.source,
        destination: search.destination,
        budget: budget,
        days: days,
        travelers: travelers,
        vibe: search.vibe,
        food: search.food,
        pace: search.pace,
        percentages,
        selectedStayIdx,
        selectedRestaurantIdx,
        selectedTransportIdx,
        selectedAttractionIds: Array.from(selectedAttractions),
        timestamp: Date.now(),
        plan: plan
      };

      if (matchedIdx !== -1) {
        savedTrips[matchedIdx] = tripData;
      } else {
        savedTrips.push(tripData);
      }
      
      localStorage.setItem("budgetwise_saved_trips", JSON.stringify(savedTrips));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Error saving trip:", err);
    }
  };

  // 7. Calculate real-time costs of currently selected items
  const activeStay = sortedStays[Math.min(selectedStayIdx, sortedStays.length - 1)] || null;
  const activeRestaurant = sortedRestaurants[Math.min(selectedRestaurantIdx, sortedRestaurants.length - 1)] || null;
  const activeTransport = sortedTransport[Math.min(selectedTransportIdx, sortedTransport.length - 1)] || null;

  const actualStayCost = activeStay ? (activeStay.price_per_night * days) : 0;
  const actualFoodCost = activeRestaurant ? (activeRestaurant.avg_cost_per_meal * 3 * days * travelers) : 0;
  const actualTransportCost = activeTransport ? activeTransport.estimated_cost : 0;
  
  const actualActivitiesCost = sortedAttractions
    .filter((_, idx) => selectedAttractions.has(idx))
    .reduce((sum, item) => sum + (item.estimated_cost ?? 0), 0);

  const actualBufferCost = Math.round((budget * percentages.buffer) / 100);

  // Computed total cost
  const actualTotalCost = actualStayCost + actualFoodCost + actualTransportCost + actualActivitiesCost + actualBufferCost;
  const pct = Math.min(100, Math.round((actualTotalCost / budget) * 100));
  const overBudget = actualTotalCost > budget;

  return (
    <div className="mt-8 space-y-12">
      {/* Summary + Dynamic cost bar */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="animate-fade-up rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-indigo-400">
              <Sparkles className="h-4 w-4" />
              Itinerary Summary
            </div>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-300">{plan.summary}</p>
          </div>
          
          {/* Save & Share Action */}
          <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-zinc-400">Save this adjusted plan or share it with others.</span>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleShareTrip}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  shareSuccess 
                    ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-105 active:scale-95"
                }`}
              >
                {shareSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Compass className="h-3.5 w-3.5 text-indigo-400" />
                    Share Journey
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveTrip}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  saveSuccess 
                    ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                    : "bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95"
                }`}
              >
                {saveSuccess ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Saved Successfully!
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    Save Journey
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={`animate-fade-up rounded-[2rem] border p-8 backdrop-blur-sm transition-all duration-500 flex flex-col justify-between ${
          overBudget 
            ? "border-destructive/30 bg-destructive/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]" 
            : "border-white/10 bg-white/5 shadow-2xl"
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className="font-mono text-xs font-semibold uppercase tracking-widest text-zinc-400">Dynamic Cost</div>
              <TrendingUp className={`h-4 w-4 ${overBudget ? "text-destructive animate-bounce" : "text-indigo-400"}`} />
            </div>
            <div className="mt-4 font-display text-4xl font-semibold tracking-tight">
              <span className={overBudget ? "text-destructive" : "text-white"}>
                ₹{actualTotalCost.toLocaleString()}
              </span>
              <span className="ml-2 text-sm font-normal text-zinc-400">/ ₹{budget.toLocaleString()}</span>
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  background: overBudget ? "var(--color-destructive)" : "linear-gradient(to right, #6366f1, #a855f7)",
                }}
              />
            </div>
          </div>
          <div className="mt-6 text-xs font-semibold uppercase tracking-wider">
            {overBudget ? (
              <span className="text-destructive">Over budget by ₹{(actualTotalCost - budget).toLocaleString()} — Swap card options below to balance.</span>
            ) : (
              <span className="text-emerald-400">Under budget! ₹{(budget - actualTotalCost).toLocaleString()} surplus remaining.</span>
            )}
          </div>
          <button
            type="button"
            onClick={makeCheaper}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-white py-3.5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-95 hover:scale-[1.01]"
          >
            <TrendingDown className="h-4 w-4 text-emerald-400" />
            Make It Cheaper
          </button>
        </div>
      </div>

      {/* Interactive Budget Allocator Console */}
      <div className="animate-fade-up rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent" />
        <div className="flex items-center gap-3.5 mb-6">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-indigo-400">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold text-white tracking-wide">Interactive Budget Tuning Console</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Drag any slider to redistribute percentage weight. Stays, food, and transport automatically swap tiers!</p>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 pt-2">
          {[
            { key: "accommodation", label: "Stays", value: percentages.accommodation, color: "from-indigo-500 to-indigo-400", amt: actualStayCost },
            { key: "food", label: "Dining", value: percentages.food, color: "from-purple-500 to-purple-400", amt: actualFoodCost },
            { key: "transport", label: "Transit", value: percentages.transport, color: "from-pink-500 to-pink-400", amt: actualTransportCost },
            { key: "activities", label: "Sights", value: percentages.activities, color: "from-emerald-500 to-emerald-400", amt: actualActivitiesCost },
            { key: "buffer", label: "Buffer", value: percentages.buffer, color: "from-yellow-500 to-yellow-400", amt: actualBufferCost },
          ].map((slider) => (
            <div key={slider.key} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all hover:bg-white/[0.04]">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">{slider.label}</span>
                <span className="text-xs font-mono font-bold text-indigo-300">{slider.value}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={slider.value}
                onChange={(e) => handlePctChange(slider.key as any, parseInt(e.target.value, 10))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
              />
              <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>Allocation:</span>
                <span className="font-semibold text-zinc-300">₹{slider.amt.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Option Swappers Sections */}
      <div className="space-y-16">
        
        {/* Stays Section */}
        <Section title="Stay Options" icon={<Hotel />}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedStays.map((s, i) => {
              const isActive = i === selectedStayIdx;
              const stayTotal = s.price_per_night * days;
              return (
                <div 
                  key={i}
                  onClick={() => setSelectedStayIdx(i)}
                  className={`group relative overflow-hidden rounded-[2rem] border p-6 transition-all duration-500 cursor-pointer hover-glow-card animate-fade-up ${
                    isActive 
                      ? "bg-white/[0.04] border-white/20 shadow-[0_20px_50px_rgba(99,102,241,0.15)] scale-[1.02] ring-1 ring-white/10"
                      : "bg-white/[0.01] border-white/5 opacity-55 hover:opacity-100 hover:border-white/15 hover:bg-white/[0.02]"
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase mb-3 ${
                        i < 2 ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" :
                        i < 4 ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20" :
                        "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      }`}>
                        {i < 2 ? `Budget Stay ${i + 1}` : i < 4 ? `Standard Stay ${i - 1}` : `Premium Stay ${i - 3}`}
                      </span>
                      <h3 className="font-semibold text-lg text-white leading-tight">{s.name}</h3>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400">{s.type}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-zinc-400 min-h-[48px]">{s.notes}</p>
                  {s.why && (
                    <div className="mt-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        <Sparkles className="h-3 w-3 animate-pulse" />
                        AI Insight
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{s.why}</p>
                    </div>
                  )}
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <div className="font-mono text-base font-bold text-white">₹{s.price_per_night.toLocaleString()}</div>
                      <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">per night</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-zinc-300 font-bold">₹{stayTotal.toLocaleString()}</div>
                      <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">total stay</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(s.name + " " + search.destination)}&aid=88888`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold uppercase tracking-wider text-white py-2 px-1 transition-all text-center select-none"
                    >
                      Booking.com
                    </a>
                    <a
                      href={`https://www.agoda.com/search?query=${encodeURIComponent(s.name + " " + search.destination)}&cid=99999`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-[10px] font-bold uppercase tracking-wider text-white py-2 px-1 transition-all text-center select-none"
                    >
                      Agoda
                    </a>
                  </div>
                  {isActive && (
                    <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_#6366f1]" />
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Dining Section */}
        <Section title="Dining Spots" icon={<UtensilsCrossed />}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedRestaurants.map((r, i) => {
              const isActive = i === selectedRestaurantIdx;
              const diningTotal = r.avg_cost_per_meal * 3 * days * travelers;
              return (
                <div 
                  key={i}
                  onClick={() => setSelectedRestaurantIdx(i)}
                  className={`group relative overflow-hidden rounded-[2rem] border p-6 transition-all duration-500 cursor-pointer hover-glow-card animate-fade-up ${
                    isActive 
                      ? "bg-white/[0.04] border-white/20 shadow-[0_20px_50px_rgba(99,102,241,0.15)] scale-[1.02] ring-1 ring-white/10"
                      : "bg-white/[0.01] border-white/5 opacity-55 hover:opacity-100 hover:border-white/15 hover:bg-white/[0.02]"
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase mb-3 ${
                        i < 2 ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" :
                        i < 4 ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20" :
                        "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      }`}>
                        {i < 2 ? `Budget Dining ${i + 1}` : i < 4 ? `Standard Dining ${i - 1}` : `Premium Dining ${i - 3}`}
                      </span>
                      <h3 className="font-semibold text-lg text-white leading-tight">{r.name}</h3>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400">{r.cuisine}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-zinc-400 min-h-[48px]">{r.vibe}</p>
                  {r.why && (
                    <div className="mt-3 rounded-xl bg-purple-500/5 border border-purple-500/10 p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400">
                        <Sparkles className="h-3 w-3 animate-pulse" />
                        AI Insight
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{r.why}</p>
                    </div>
                  )}
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <div className="font-mono text-base font-bold text-white">₹{r.avg_cost_per_meal.toLocaleString()}</div>
                      <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">per meal</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-zinc-300 font-bold">₹{diningTotal.toLocaleString()}</div>
                      <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">total dining</div>
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_#6366f1]" />
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Transport Section */}
        <Section title="Transit Modes" icon={<Bus />}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTransport.map((t, i) => {
              const isActive = i === selectedTransportIdx;
              return (
                <div 
                  key={i}
                  onClick={() => setSelectedTransportIdx(i)}
                  className={`group relative overflow-hidden rounded-[2rem] border p-6 transition-all duration-500 cursor-pointer hover-glow-card animate-fade-up ${
                    isActive 
                      ? "bg-white/[0.04] border-white/20 shadow-[0_20px_50px_rgba(99,102,241,0.15)] scale-[1.02] ring-1 ring-white/10"
                      : "bg-white/[0.01] border-white/5 opacity-55 hover:opacity-100 hover:border-white/15 hover:bg-white/[0.02]"
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase mb-3 ${
                        i < 2 ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" :
                        i < 4 ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20" :
                        "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      }`}>
                        {i < 2 ? `Budget Transit ${i + 1}` : i < 4 ? `Standard Transit ${i - 1}` : `Premium Transit ${i - 3}`}
                      </span>
                      <h3 className="font-semibold text-lg text-white leading-tight">{t.mode}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-zinc-400 min-h-[48px]">{t.description}</p>
                  {t.why && (
                    <div className="mt-3 rounded-xl bg-pink-500/5 border border-pink-500/10 p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-400">
                        <Sparkles className="h-3 w-3 animate-pulse" />
                        AI Insight
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{t.why}</p>
                    </div>
                  )}
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <div className="font-mono text-base font-bold text-white">₹{t.estimated_cost.toLocaleString()}</div>
                      <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">total transit</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={t.mode.toLowerCase().includes("train")
                        ? `https://www.irctc.co.in/nget/train-search`
                        : t.mode.toLowerCase().includes("bus")
                        ? `https://www.redbus.in/`
                        : t.mode.toLowerCase().includes("flight")
                        ? `https://www.makemytrip.com/flights/`
                        : `https://www.makemytrip.com/`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[10px] font-bold uppercase tracking-wider text-white py-2.5 transition-all text-center"
                    >
                      Check Availability & Book
                    </a>
                  </div>
                  {isActive && (
                    <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_#6366f1]" />
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Attractions Section */}
        <Section title="Attractions & Sights" icon={<Compass />}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedAttractions.map((a, i) => {
              const isSelected = selectedAttractions.has(i);
              return (
                <div 
                  key={i}
                  onClick={() => {
                    const next = new Set(selectedAttractions);
                    if (next.has(i)) {
                      if (next.size > 1) next.delete(i); // Keep at least one attraction
                    } else {
                      next.add(i);
                    }
                    setSelectedAttractions(next);
                  }}
                  className={`group relative overflow-hidden rounded-[2rem] border p-6 transition-all duration-500 cursor-pointer hover-glow-card animate-fade-up ${
                    isSelected 
                      ? "bg-white/[0.04] border-white/20 shadow-[0_20px_50px_rgba(99,102,241,0.15)] scale-[1.02] ring-1 ring-white/10"
                      : "bg-white/[0.01] border-white/5 opacity-55 hover:opacity-100 hover:border-white/15 hover:bg-white/[0.02]"
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase mb-3 bg-white/5 text-zinc-300 border border-white/10">
                        {a.duration || "2-3 hours"}
                      </span>
                      <h3 className="font-semibold text-lg text-white leading-tight">{a.name}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-zinc-400 min-h-[48px]">{a.description}</p>
                  {a.why && (
                    <div className="mt-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        <Sparkles className="h-3 w-3 animate-pulse" />
                        AI Insight
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{a.why}</p>
                    </div>
                  )}
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <div className="font-mono text-base font-bold text-white">
                        {a.estimated_cost === 0 ? "Free Entry" : `₹${a.estimated_cost.toLocaleString()}`}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">activity fee</div>
                    </div>
                    <div className="text-xs font-semibold text-indigo-400">
                      {isSelected ? "Included" : "Excluded"}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_#6366f1]" />
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      {/* Day by Day Itinerary */}
      {plan.itinerary?.length ? (
        <Section title="Day by Day Itinerary" icon={<Calendar />}>
          {/* Mobile-Friendly Sticky Day Navigation Tabs */}
          <div className="sticky top-[80px] sm:top-[100px] z-30 -mx-4 px-4 py-3 bg-zinc-950/85 backdrop-blur-xl border border-white/5 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth mb-8 rounded-2xl shadow-xl">
            <button
              type="button"
              onClick={() => setActiveDay("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all duration-300 ${
                activeDay === "all"
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-[1.02]"
                  : "bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              All Days
            </button>
            {plan.itinerary.map((d) => (
              <button
                key={d.day}
                type="button"
                onClick={() => setActiveDay(d.day)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-all duration-300 ${
                  activeDay === d.day
                    ? "bg-indigo-500 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] scale-[1.02]"
                    : "bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                Day {d.day}
              </button>
            ))}
          </div>

          <ol className="relative ml-4 space-y-8 border-l border-white/10 pl-8">
            {plan.itinerary
              .filter(d => activeDay === "all" || d.day === activeDay)
              .map((d) => {
              // Dynamically estimate day's cost based on active selections
              const dailyStayCost = activeStay ? activeStay.price_per_night : 0;
              const dailyFoodCost = activeRestaurant ? (activeRestaurant.avg_cost_per_meal * 3 * travelers) : 0;
              const dailyTransCost = activeTransport ? Math.round(activeTransport.estimated_cost / days) : 0;
              const dailyActCost = Math.round(actualActivitiesCost / days);
              const estCost = dailyStayCost + dailyFoodCost + dailyTransCost + dailyActCost;

              return (
                <li key={d.day} className="relative animate-fade-up" style={{ animationDelay: `${(d.day - 1) * 150}ms` }}>
                  <span
                    className="absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-black ring-4 ring-black"
                  >
                    {d.day}
                  </span>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.08] hover:border-white/15 hover-glow-card">
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <div className="font-semibold text-lg text-white">
                        Day {d.day} <span className="text-zinc-500 font-normal mx-2">—</span> {d.title}
                      </div>
                      <div className="font-mono text-sm text-indigo-300">~ ₹{estCost.toLocaleString()}</div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">{d.plan}</p>
                    {d.why && (
                      <div className="mt-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-3 mb-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                          <Sparkles className="h-3 w-3 animate-pulse" />
                          AI Insight
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-zinc-300">{d.why}</p>
                      </div>
                    )}
                    {/* Inline helpers for clarity */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-zinc-500 font-mono">
                      {activeStay && <span>Stay: <b className="text-zinc-400">{activeStay.name}</b></span>}
                      {activeRestaurant && <span>Dining: <b className="text-zinc-400">{activeRestaurant.name}</b></span>}
                      {activeTransport && <span>Transit: <b className="text-zinc-400">{activeTransport.mode}</b></span>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Section>
      ) : null}

      {/* Pro Tips */}
      {plan.tips?.length ? (
        <Section title="Traveler Tips" icon={<Sparkles />}>
          <div className="grid gap-4 sm:grid-cols-2">
            {plan.tips.map((t, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover-glow-card animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" />
                <p className="text-sm leading-relaxed text-zinc-300">{t}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <div className="pt-12 text-center flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 text-white px-8 py-4 font-semibold transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          to="/planner"
          className="inline-flex items-center gap-2 rounded-full bg-white text-black px-8 py-4 font-semibold transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.25)]"
        >
          New Travel Parameters
        </Link>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up">
      <div className="mb-8 flex items-center gap-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-indigo-400 shadow-md">
          {icon}
        </span>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-white">{title}</h2>
        <div className="ml-4 h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>
      {children}
    </div>
  );
}

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-1">
      <div className="font-semibold text-lg text-white">{title}</div>
      {sub ? <div className="mt-1.5 font-mono text-xs uppercase tracking-wider text-zinc-500">{sub}</div> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

