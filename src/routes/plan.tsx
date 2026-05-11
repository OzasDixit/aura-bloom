import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ShaderBackground } from "@/components/ShaderBackground";
import { Logo } from "@/components/Logo";
import { planTrip, type TripPlan } from "@/lib/trip-planner.functions";
import { ArrowLeft, Loader2, MapPin, Wallet, Calendar, Users, Sparkles, Hotel, UtensilsCrossed, Bus, Compass, AlertCircle, TrendingUp } from "lucide-react";

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

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["plan", search],
    queryFn: () => planTripFn({ data: search }) as Promise<TripPlan>,
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  return (
    <main className="relative min-h-screen pb-24">
      <ShaderBackground intensity={0.85} />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <button
          onClick={() => navigate({ to: "/" })}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-4 py-1.5 text-sm text-foreground transition-all hover:border-[color:var(--neon-cyan)] hover:glow-cyan"
        >
          <ArrowLeft className="h-4 w-4" />
          New trip
        </button>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6">
        {/* trip header */}
        <div className="glass-strong neon-border animate-fade-up rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Itinerary
              </div>
              <h1 className="mt-1 font-display text-3xl font-bold leading-tight sm:text-4xl">
                <span>{search.source}</span>
                <span className="mx-3 text-gradient-neon">→</span>
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
          <div className="mt-8 glass rounded-2xl border border-destructive/40 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <div className="font-semibold">We couldn't build your plan</div>
                <div className="mt-1 text-sm text-muted-foreground">{(error as Error).message}</div>
                <button
                  onClick={() => refetch()}
                  className="mt-4 rounded-lg border border-border/70 bg-card/40 px-4 py-2 text-sm transition-all hover:border-[color:var(--neon-cyan)]"
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
    <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/40 px-3 py-2">
      <span style={{ color: "var(--neon-cyan)" }}>{icon}</span>
      <div>
        <div className="text-sm font-semibold leading-tight">{value}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="glass rounded-2xl p-8 col-span-full">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--neon-cyan)" }} />
          <div className="shimmer-text font-semibold">Curating your perfect budget trip…</div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl border border-border/60 bg-card/30" style={{ animation: `pulse 2s ease-in-out ${i * 0.1}s infinite` }} />
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
    <div className="mt-8 space-y-8">
      {/* summary + budget bar */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass animate-fade-up rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--neon-cyan)" }} />
            Trip summary
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">{plan.summary}</p>
        </div>
        <div className="glass animate-fade-up rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Total estimate</div>
            <TrendingUp className="h-4 w-4" style={{ color: overBudget ? "var(--destructive)" : "var(--neon-lime)" }} />
          </div>
          <div className="mt-2 font-display text-3xl font-bold">
            <span className={overBudget ? "text-destructive" : "text-gradient-neon"}>
              ₹{total.toLocaleString()}
            </span>
            <span className="ml-1 text-base font-normal text-muted-foreground">/ ₹{budget.toLocaleString()}</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-card/60">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background: overBudget
                  ? "linear-gradient(90deg, var(--destructive), var(--neon-magenta))"
                  : "var(--gradient-neon)",
                boxShadow: "0 0 12px color-mix(in oklab, var(--neon-cyan) 60%, transparent)",
              }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {overBudget ? "Slightly above budget — see tips below." : `${pct}% of budget used`}
          </div>
        </div>
      </div>

      {/* breakdown */}
      {plan.budget_breakdown ? (
        <div className="glass animate-fade-up rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold">Where your money goes</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Object.entries(plan.budget_breakdown).map(([k, v]) => (
              <BreakdownCell key={k} label={k} value={v as number} total={budget} />
            ))}
          </div>
        </div>
      ) : null}

      {/* sections */}
      <Section title="Attractions" icon={<Compass />} color="var(--neon-cyan)">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.attractions?.map((a, i) => (
            <Card key={i} accent="var(--neon-cyan)" title={a.name} sub={a.duration}>
              <p className="text-sm text-muted-foreground">{a.description}</p>
              <Cost amount={a.estimated_cost} />
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Stays" icon={<Hotel />} color="var(--neon-magenta)">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.stays?.map((s, i) => (
            <Card key={i} accent="var(--neon-magenta)" title={s.name} sub={s.type}>
              <p className="text-sm text-muted-foreground">{s.notes}</p>
              <Cost amount={s.price_per_night} suffix="/ night" />
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Food spots" icon={<UtensilsCrossed />} color="var(--neon-violet)">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.restaurants?.map((r, i) => (
            <Card key={i} accent="var(--neon-violet)" title={r.name} sub={r.cuisine}>
              <p className="text-sm text-muted-foreground">{r.vibe}</p>
              <Cost amount={r.avg_cost_per_meal} suffix="/ meal" />
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Getting around" icon={<Bus />} color="var(--neon-lime)">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plan.transport?.map((t, i) => (
            <Card key={i} accent="var(--neon-lime)" title={t.mode} sub="">
              <p className="text-sm text-muted-foreground">{t.description}</p>
              <Cost amount={t.estimated_cost} />
            </Card>
          ))}
        </div>
      </Section>

      {/* itinerary timeline */}
      {plan.itinerary?.length ? (
        <Section title="Day by day" icon={<Calendar />} color="var(--neon-cyan)">
          <ol className="relative ml-3 space-y-5 border-l border-border/70 pl-6">
            {plan.itinerary.map((d) => (
              <li key={d.day} className="relative animate-fade-up">
                <span
                  className="absolute -left-[33px] flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground"
                  style={{ background: "var(--gradient-neon)", boxShadow: "0 0 14px color-mix(in oklab, var(--neon-cyan) 60%, transparent)" }}
                >
                  {d.day}
                </span>
                <div className="glass rounded-xl p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="font-semibold">Day {d.day} — {d.title}</div>
                    <div className="font-mono text-xs text-muted-foreground">~ ₹{d.est_cost?.toLocaleString?.() ?? d.est_cost}</div>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{d.plan}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* tips */}
      {plan.tips?.length ? (
        <Section title="Pro tips" icon={<Sparkles />} color="var(--neon-magenta)">
          <div className="grid gap-3 sm:grid-cols-2">
            {plan.tips.map((t, i) => (
              <div key={i} className="glass flex items-start gap-3 rounded-xl p-4">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--neon-magenta)" }} />
                <p className="text-sm text-foreground/90">{t}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <div className="pt-4 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-5 py-2.5 text-sm transition-all hover:border-[color:var(--neon-cyan)] hover:glow-cyan"
        >
          <ArrowLeft className="h-4 w-4" />
          Plan another trip
        </Link>
      </div>
    </div>
  );
}

function Section({ title, icon, color, children }: { title: string; icon: React.ReactNode; color: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up">
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card/60" style={{ color }}>
          {icon}
        </span>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <div className="ml-2 h-px flex-1" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />
      </div>
      {children}
    </div>
  );
}

function Card({ title, sub, accent, children }: { title: string; sub?: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="group glass relative overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-1">
      <div
        className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40"
        style={{ background: accent }}
      />
      <div className="font-semibold leading-tight">{title}</div>
      {sub ? <div className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">{sub}</div> : null}
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

function Cost({ amount, suffix }: { amount: number; suffix?: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-mono font-semibold text-gradient-neon">₹{amount?.toLocaleString?.() ?? amount}</span>
      {suffix ? <span className="text-xs text-muted-foreground">{suffix}</span> : null}
    </div>
  );
}

function BreakdownCell({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-xl border border-border/70 bg-card/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-sm font-semibold">₹{value?.toLocaleString?.() ?? value}</div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-card/60">
        <div className="h-full" style={{ width: `${Math.min(pct, 100)}%`, background: "var(--gradient-neon)" }} />
      </div>
    </div>
  );
}
