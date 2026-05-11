import { createFileRoute, Link } from "@tanstack/react-router";
import { ShaderBackground } from "@/components/ShaderBackground";
import { Logo } from "@/components/Logo";
import { PlannerForm } from "@/components/PlannerForm";
import { Sparkles, Compass, Wallet, MapPinned, Plane, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "BudgetWise — Smart Travel Planning Within Your Budget" },
      {
        name: "description",
        content:
          "AI-powered travel planner that builds full itineraries — stays, food, transport and attractions — strictly within your budget.",
      },
      { property: "og:title", content: "BudgetWise — Smart Travel Planning" },
      {
        property: "og:description",
        content: "Plan budget-friendly trips with AI: stays, food, transport, attractions.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <ShaderBackground />

      {/* nav */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <Link to="/" hash="planner" className="rounded-full border border-border/70 px-4 py-1.5 text-foreground transition-all hover:border-[color:var(--neon-cyan)] hover:glow-cyan">
            Start planning
          </Link>
        </nav>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pb-16 pt-8 lg:grid-cols-2 lg:gap-16 lg:pt-14">
        <div className="animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--neon-cyan)" }} />
            AI-powered • Budget-first
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Travel <span className="text-gradient-neon">smarter,</span>
            <br />
            spend <span className="shimmer-text">wiser.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tell BudgetWise where you're headed and how much you've got — get a
            full itinerary with stays, food, transport and attractions that
            actually fits your wallet.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
            <Stat label="Avg. budget hit" value="98%" />
            <div className="h-8 w-px bg-border" />
            <Stat label="Itinerary in" value="< 10s" />
            <div className="h-8 w-px bg-border" />
            <Stat label="Categories" value="5+" />
          </div>
        </div>

        <div id="planner" className="lg:pl-6">
          <PlannerForm />
        </div>
      </section>

      {/* features */}
      <section id="features" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Everything you need, <span className="text-gradient-neon">nothing you don't</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            One workspace for the entire trip. No tab-hopping. No premium-only suggestions.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={<Wallet />} title="Budget-locked" desc="Plans are built around your number — never above it." color="var(--neon-cyan)" />
          <Feature icon={<MapPinned />} title="Local-first picks" desc="Homestays, street food, and public transit over premium chains." color="var(--neon-magenta)" />
          <Feature icon={<Compass />} title="Real itineraries" desc="Day-by-day plan with timing, distance and cost estimates." color="var(--neon-violet)" />
          <Feature icon={<Plane />} title="Transport modes" desc="Compare taxis, autos, buses, trains in one view." color="var(--neon-lime)" />
          <Feature icon={<Star />} title="Attractions ranked" desc="Worthwhile stops curated for your time and money." color="var(--neon-cyan)" />
          <Feature icon={<Sparkles />} title="Pro tips" desc="Local hacks to stretch your budget further." color="var(--neon-magenta)" />
        </div>
      </section>

      {/* how */}
      <section id="how" className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="glass rounded-3xl p-8 sm:p-12">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">How it works</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { n: "01", t: "Tell us about your trip", d: "Source, destination, budget, days." },
              { n: "02", t: "AI builds the plan", d: "We balance stays, food, travel and sights." },
              { n: "03", t: "Pack and go", d: "Refine, save, or share your itinerary." },
            ].map((s) => (
              <li key={s.n} className="relative rounded-2xl border border-border/70 bg-card/40 p-5">
                <div className="font-mono text-xs tracking-widest text-muted-foreground">{s.n}</div>
                <div className="mt-2 font-semibold">{s.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        Built with care • BudgetWise © {new Date().getFullYear()}
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold text-gradient-neon">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Feature({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <div className="group glass relative overflow-hidden rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-neon)]">
      <div
        className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 bg-card/60 transition-all group-hover:scale-110"
        style={{ color }}
      >
        {icon}
      </div>
      <div className="font-semibold">{title}</div>
      <div className="mt-1.5 text-sm text-muted-foreground">{desc}</div>
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: color }}
      />
    </div>
  );
}
