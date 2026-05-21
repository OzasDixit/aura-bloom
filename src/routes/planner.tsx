import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { PlannerForm } from "@/components/PlannerForm";
import { ArrowLeft, Sparkles, Wallet, Compass } from "lucide-react";
import { z } from "zod";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const PlannerSearch = z.object({
  destination: z.string().optional(),
});

export const Route = createFileRoute("/planner")({
  validateSearch: (s) => PlannerSearch.parse(s),
  component: PlannerPage,
});

function PlannerPage() {
  const { destination } = Route.useSearch();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

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
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-indigo-300 mb-3 backdrop-blur-md">
                <Sparkles className="h-3 w-3 animate-pulse" />
                AURA ENGINE V2.0
              </div>
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
            <div className="rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-6 sm:p-10 relative glass-premium-glow">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Trip Parameters</h2>
                <p className="text-xs text-zinc-400">Fill in the fields below to customize your AI-generated itinerary</p>
              </div>
              <PlannerForm defaultDestination={destination} />
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
