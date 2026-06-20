import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { PlannerForm } from "@/components/PlannerForm";
import { ArrowLeft, Sparkles, Wallet, Compass, Trash2, Calendar, Users, MapPinned, ExternalLink } from "lucide-react";
import { z } from "zod";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const PlannerSearch = z.object({
  destination: z.string().optional(),
});

export const Route = createFileRoute("/planner")({
  validateSearch: (s) => PlannerSearch.parse(s),
  component: PlannerPage,
  head: () => ({
    meta: [
      { title: "Optimize Your Budget Itinerary — BudgetWise" },
      {
        name: "description",
        content: "Plan and customize your perfect trip budget-locked.",
      },
    ],
  }),
});

function PlannerPage() {
  const { destination } = Route.useSearch();
  const [user, setUser] = useState<any>(null);
  const [savedTrips, setSavedTrips] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const loadSavedTrips = () => {
      try {
        const savedTripsStr = localStorage.getItem("budgetwise_saved_trips") || "[]";
        const parsed = JSON.parse(savedTripsStr);
        parsed.sort((a: any, b: any) => b.timestamp - a.timestamp);
        setSavedTrips(parsed);
      } catch (err) {
        console.error("Failed to load saved trips:", err);
      }
    };
    loadSavedTrips();

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

  return (
    <main className="relative z-10 min-h-screen bg-transparent selection:bg-white/10 selection:text-white flex flex-col">

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8">
        <Logo />
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-foreground transition-all hover:bg-white/10 hover:border-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
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

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12 sm:py-20 animate-fade-up">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          
          {/* Left Column: Visual summary / AI engine branding */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            <div>
              {/* Branding badge removed */}
              <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
                Plan your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.2)]">perfect</span> trip budget-locked.
              </h1>
              <p className="mt-4 text-base text-zinc-400 leading-relaxed">
                Our advanced routing engine calculates accommodation, transportation, local dining, and safety buffers to fit your target amount.
              </p>
            </div>

            {/* Feature lists / mini cards */}
            <div className="grid gap-4 sm:grid-cols-1">
              <div className="flex gap-4 p-4.5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300 group">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Smart Budget Allocation</h4>
                  <p className="text-xs text-zinc-400 mt-1">Stays, food, transport and entry fees split dynamically without cross-overs.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4.5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300 group">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Local-First Suggestions</h4>
                  <p className="text-xs text-zinc-400 mt-1">Recommends hidden gems, local transit (like KSRTC buses), and budget dining.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4.5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300 group">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Interactive Timelines</h4>
                  <p className="text-xs text-zinc-400 mt-1">Get hour-by-hour activities, navigation instructions, and pro budget-saving tips.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Planner Form Container */}
          <div className="lg:col-span-7">
            <div className="rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-6 sm:p-10 relative glass-premium-glow animate-scale-in">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Trip Parameters</h2>
                <p className="text-xs text-zinc-400">Fill in the fields below to customize your personalized, budget-locked itinerary</p>
              </div>
              <PlannerForm defaultDestination={destination} />
            </div>
          </div>

        </div>
      </section>

      {/* Saved Journeys Section */}
      {savedTrips.length > 0 && (
        <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 mt-8 animate-fade-up">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-8 sm:p-12 backdrop-blur-md">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
                  Your Saved Journeys
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Revisit your saved custom budget distributions and itineraries instantly.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-500 bg-white/5 border border-white/5 px-3.5 py-1.5 rounded-full">
                {savedTrips.length} Saved {savedTrips.length === 1 ? "Trip" : "Trips"}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedTrips.map((trip) => (
                <Link
                  key={trip.id}
                  to="/plan"
                  search={{
                    source: trip.source,
                    destination: trip.destination,
                    budget: Number(trip.budget),
                    currency: trip.currency || "INR",
                    days: Number(trip.days),
                    travelers: Number(trip.travelers),
                    savedTripId: trip.id,
                    vibe: trip.vibe || "Relaxed",
                    food: trip.food || "Local Specialties",
                    pace: trip.pace || "Moderate"
                  }}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.01] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:bg-white/[0.03] hover:border-white/15 hover:shadow-[0_20px_50px_rgba(99,102,241,0.1)] block"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-mono font-semibold uppercase tracking-wider">
                        <MapPinned className="h-3.5 w-3.5 shrink-0" />
                        <span>Saved Plan</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white leading-snug group-hover:text-indigo-200 transition-colors">
                        {trip.source} → {trip.destination}
                      </h3>
                    </div>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (confirm("Are you sure you want to delete this saved journey?")) {
                          try {
                            const savedTripsStr = localStorage.getItem("budgetwise_saved_trips") || "[]";
                            const parsed = JSON.parse(savedTripsStr);
                            const filtered = parsed.filter((t: any) => t.id !== trip.id);
                            localStorage.setItem("budgetwise_saved_trips", JSON.stringify(filtered));
                            setSavedTrips(filtered);
                          } catch (err) {
                            console.error("Failed to delete saved trip:", err);
                          }
                        }
                      }}
                      className="text-zinc-500 hover:text-red-400 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer relative z-20 shrink-0"
                      title="Delete Journey"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3.5 mt-6 pt-4 border-t border-white/5 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Budget</div>
                      <div className="font-bold text-zinc-300">₹{Number(trip.budget).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Days</div>
                      <div className="font-bold text-zinc-300">{trip.days} days</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">People</div>
                      <div className="font-bold text-zinc-300">{trip.travelers} pax</div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-zinc-400 group-hover:text-white transition-colors">
                    <span className="flex items-center gap-1">
                      Load Saved Plan
                      <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                    <span className="text-[10px] font-normal text-zinc-500 font-mono capitalize">
                      {new Date(trip.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
