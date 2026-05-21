import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { planTrip, type TripPlan } from "@/lib/trip-planner.functions";
import { ArrowLeft, Loader2, MapPin, Wallet, Calendar, Users, Sparkles, Hotel, UtensilsCrossed, Bus, Compass, AlertCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Search = z.object({
  source: z.string().min(1),
  destination: z.string().min(1),
  budget: z.number(),
  days: z.number().default(3),
  travelers: z.number().default(1),
  currency: z.string().default("INR"),
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

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["plan", search],
    queryFn: () => planTripFn({ data: search }) as Promise<TripPlan>,
    retry: false,
    staleTime: 1000 * 60 * 10,
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

        {isLoading || isFetching ? <LoadingState /> : null}

        {error ? (
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

        {data ? <PlanContent plan={data} budget={search.budget} /> : null}
      </section>
    </main>
  );
}

function Meta({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <div className="text-base font-semibold leading-none">{value}</div>
        <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-8 animate-fade-up">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 backdrop-blur-sm">
        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <div className="font-semibold text-lg text-foreground">Curating your perfect budget trip...</div>
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

function PlanContent({ plan, budget }: { plan: TripPlan; budget: number }) {
  const total = plan.total_estimated_cost ?? 0;
  const pct = Math.min(100, Math.round((total / budget) * 100));
  const overBudget = total > budget;

  return (
    <div className="mt-8 space-y-12">
      {/* summary + budget bar */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="animate-fade-up rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:col-span-2">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            Trip summary
          </div>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{plan.summary}</p>
        </div>
        <div className="animate-fade-up rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total estimate</div>
            <TrendingUp className={`h-4 w-4 ${overBudget ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
          <div className="mt-4 font-display text-4xl font-semibold tracking-tight">
            <span className={overBudget ? "text-destructive" : "text-foreground"}>
              ₹{total.toLocaleString()}
            </span>
            <span className="ml-2 text-lg font-normal text-muted-foreground">/ ₹{budget.toLocaleString()}</span>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${pct}%`,
                background: overBudget ? "var(--color-destructive)" : "var(--color-foreground)",
              }}
            />
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            {overBudget ? "Slightly above budget — see tips below." : `${pct}% of budget used`}
          </div>
        </div>
      </div>

      {/* breakdown */}
      {plan.budget_breakdown ? (
        <div className="animate-fade-up rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Where your money goes</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Object.entries(plan.budget_breakdown).map(([k, v]) => (
              <BreakdownCell key={k} label={k} value={v as number} total={budget} />
            ))}
          </div>
        </div>
      ) : null}

      {/* sections */}
      <div className="space-y-16">
        <Section title="Attractions" icon={<Compass />}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plan.attractions?.map((a, i) => (
              <Card key={i} title={a.name} sub={a.duration}>
                <p className="text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                <Cost amount={a.estimated_cost} />
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Stays" icon={<Hotel />}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plan.stays?.map((s, i) => (
              <Card key={i} title={s.name} sub={s.type}>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.notes}</p>
                <Cost amount={s.price_per_night} suffix="/ night" />
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Food spots" icon={<UtensilsCrossed />}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plan.restaurants?.map((r, i) => (
              <Card key={i} title={r.name} sub={r.cuisine}>
                <p className="text-sm leading-relaxed text-muted-foreground">{r.vibe}</p>
                <Cost amount={r.avg_cost_per_meal} suffix="/ meal" />
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Getting around" icon={<Bus />}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plan.transport?.map((t, i) => (
              <Card key={i} title={t.mode} sub="">
                <p className="text-sm leading-relaxed text-muted-foreground">{t.description}</p>
                <Cost amount={t.estimated_cost} />
              </Card>
            ))}
          </div>
        </Section>
      </div>

      {/* itinerary timeline */}
      {plan.itinerary?.length ? (
        <Section title="Day by day" icon={<Calendar />}>
          <ol className="relative ml-4 space-y-8 border-l border-white/10 pl-8">
            {plan.itinerary.map((d) => (
              <li key={d.day} className="relative animate-fade-up">
                <span
                  className="absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background ring-4 ring-background"
                >
                  {d.day}
                </span>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <div className="font-semibold text-lg">Day {d.day} <span className="text-muted-foreground font-normal mx-2">—</span> {d.title}</div>
                    <div className="font-mono text-sm text-muted-foreground">~ ₹{d.est_cost?.toLocaleString?.() ?? d.est_cost}</div>
                  </div>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{d.plan}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* tips */}
      {plan.tips?.length ? (
        <Section title="Pro tips" icon={<Sparkles />}>
          <div className="grid gap-4 sm:grid-cols-2">
            {plan.tips.map((t, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <p className="text-sm leading-relaxed text-muted-foreground">{t}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <div className="pt-12 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-8 py-4 font-semibold transition-all hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Plan another trip
        </Link>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up">
      <div className="mb-8 flex items-center gap-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground">
          {icon}
        </span>
        <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
        <div className="ml-4 h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>
      {children}
    </div>
  );
}

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-1">
      <div className="font-semibold text-lg">{title}</div>
      {sub ? <div className="mt-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">{sub}</div> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Cost({ amount, suffix }: { amount: number; suffix?: string }) {
  return (
    <div className="flex items-baseline gap-2 pt-2 border-t border-white/10">
      <span className="font-mono text-lg font-semibold text-foreground">₹{amount?.toLocaleString?.() ?? amount}</span>
      {suffix ? <span className="text-xs font-medium text-muted-foreground">{suffix}</span> : null}
    </div>
  );
}

function BreakdownCell({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-xl font-semibold">₹{value?.toLocaleString?.() ?? value}</div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-foreground transition-all duration-1000 ease-out" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}
