import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Sparkles, Compass, Wallet, MapPinned, Plane, Star, ArrowRight, Calendar, Hotel, UtensilsCrossed, Bus, ChevronRight, ChevronLeft, Train, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DESTINATIONS, type Destination } from "@/lib/destinations.data";
import { supabase } from "@/lib/supabase";

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

function matchesSeason(bestTime: string, season: string): boolean {
  if (season === "all") return true;
  const activeMonths = getMonthsFromRange(bestTime);
  const seasonMonths: Record<string, string[]> = {
    winter: ["november", "december", "january", "february", "march", "october"],
    summer: ["march", "april", "may", "june"],
    monsoon: ["july", "august", "september", "october"]
  };
  const targetMonths = seasonMonths[season.toLowerCase()] || [];
  return targetMonths.some(m => activeMonths.includes(m));
}



export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "BudgetWise — Smart Travel Planning Within Your Budget" },
      {
        name: "description",
        content:
          "Plan your entire trip within your exact budget.",
      },
    ],
  }),
});


const MOCK_ITINERARY = [
  {
    day: 1,
    title: "Tea Hills & Fresh Brews",
    activities: [
      { icon: "Compass", name: "Walk through Lockhart Tea Gardens", cost: "Free", time: "09:00 AM" },
      { icon: "UtensilsCrossed", name: "Traditional Sadhya Meal at Saravana", cost: "₹150", time: "01:00 PM" },
      { icon: "MapPinned", name: "Mattupetty Dam Viewpoint hike", cost: "Free", time: "03:30 PM" },
    ]
  },
  {
    day: 2,
    title: "Wilderness & Waterfalls",
    activities: [
      { icon: "Compass", name: "Eravikulam National Park (Tahr sighting)", cost: "₹200", time: "08:30 AM" },
      { icon: "UtensilsCrossed", name: "Spicy Kerala Curry at Rapsy Restaurant", cost: "₹180", time: "01:30 PM" },
      { icon: "Bus", name: "Shared auto back to town center", cost: "₹40", time: "05:00 PM" },
    ]
  },
  {
    day: 3,
    title: "Spices & High Peaks",
    activities: [
      { icon: "Compass", name: "Lockhart Spice Plantation walking tour", cost: "₹100", time: "10:00 AM" },
      { icon: "UtensilsCrossed", name: "Organic tea tasting & snacks", cost: "₹80", time: "02:00 PM" },
      { icon: "MapPinned", name: "Sunset view from Top Station", cost: "Free", time: "04:30 PM" },
    ]
  }
];

const getIconComponent = (name: string) => {
  switch (name) {
    case "Compass":
      return <Compass className="h-4 w-4" />;
    case "UtensilsCrossed":
      return <UtensilsCrossed className="h-4 w-4" />;
    case "MapPinned":
      return <MapPinned className="h-4 w-4" />;
    case "Bus":
      return <Bus className="h-4 w-4" />;
    default:
      return <Compass className="h-4 w-4" />;
  }
};

function Index() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [activeMockTab, setActiveMockTab] = useState<'overview' | number | 'budget'>('overview');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftVal = useRef(0);
  const isInteracting = useRef(false);
  const resumeTimer = useRef<any>(null);
  const dragDistance = useRef(0);
  const [user, setUser] = useState<any>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>("all");
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

  // Hybrid auto-scroll loop
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 25; // Speed of auto-scrolling in px/sec

    const scrollLoop = (time: number) => {
      if (container && !isInteracting.current && !isDragging) {
        const delta = (time - lastTime) / 1000;
        container.scrollLeft += speed * delta;

        // Infinite scroll threshold
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;
    setIsDragging(true);
    isInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);

    startX.current = e.pageX - container.offsetLeft;
    scrollLeftVal.current = container.scrollLeft;
    dragDistance.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const container = scrollRef.current;
    if (!container) return;
    e.preventDefault();

    const x = e.pageX - container.offsetLeft;
    const currentDragX = e.pageX;
    dragDistance.current = Math.abs(currentDragX - (startX.current + container.offsetLeft));

    const walk = (x - startX.current) * 1.5;
    container.scrollLeft = scrollLeftVal.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
    // Resume auto-scroll after 3 seconds of idle time
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 3000);
  };

  const handleTouchStart = () => {
    isInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  const handleTouchEnd = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 3000);
  };

  const handleScrollPrev = () => {
    const container = scrollRef.current;
    if (!container) return;
    isInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);

    container.scrollBy({
      left: -container.clientWidth * 0.75,
      behavior: "smooth"
    });

    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 4000);
  };

  const handleScrollNext = () => {
    const container = scrollRef.current;
    if (!container) return;
    isInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);

    container.scrollBy({
      left: container.clientWidth * 0.75,
      behavior: "smooth"
    });

    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 4000);
  };

  const handleCardClick = (dest: Destination) => {
    if (dragDistance.current > 8) {
      return; // Ignore clicks if dragging was detected
    }
    setSelectedDestination(dest);
  };

  return (
    <main className="relative z-10 min-h-screen bg-transparent overflow-x-hidden selection:bg-white/10 selection:text-white">

      {/* nav */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0c0a09]/60 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="flex items-center gap-6">
            <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground sm:flex mr-4">
              <a href="#destinations" className="transition-colors hover:text-white">Destinations</a>
              <a href="#features" className="transition-colors hover:text-white">Features</a>
            </div>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-3 pr-2 py-1 backdrop-blur-md animate-scale-in">
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
            <Link 
              to="/planner" 
              className="rounded-full bg-white text-black px-5 py-2 text-sm font-semibold transition-all hover:bg-zinc-200 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.35)]"
            >
              Start planning
            </Link>
          </nav>
        </div>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto flex flex-col items-center justify-center text-center w-full max-w-5xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-24 animate-fade-in">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4.5 py-1.5 text-xs font-medium text-indigo-300 mb-8 backdrop-blur-md animate-scale-in">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          Introducing Premium Itinerary Optimizer
        </div>

        <h1 className="font-display text-5xl font-semibold leading-[1.15] tracking-tight sm:text-7xl lg:text-[5.5rem] mb-6">
          Travel <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">smarter</span>,<br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.35)]">spend wiser.</span>
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl leading-relaxed text-zinc-400 mb-10">
          Tell BudgetWise where you're headed and how much you've got. Get a
          full itinerary with stays, food, transport and attractions that
          actually fits your wallet.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/planner"
            className="group flex h-12 items-center justify-center gap-2 rounded-full bg-white text-black px-8 text-sm font-semibold transition-all hover:bg-zinc-100 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            Start Planning
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#how"
            className="flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20"
          >
            How it works
          </a>
        </div>
        
        <div className="mt-20 flex flex-wrap justify-center items-center gap-4 text-sm max-w-3xl">
          <Stat label="Avg. budget hit" value="98%" />
          <Stat label="Itinerary in" value="< 10s" />
          <Stat label="Categories" value="5+" />
        </div>
      </section>

      {/* Interactive Mockup Dashboard */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-24 animate-fade-in">
        <div className="text-center mb-10">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Interactive Experience
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold tracking-tight mt-3 mb-2">
            See the AI engine in action
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            Interact with this live sample itinerary generated by our budget optimization engine.
          </p>
        </div>

        {/* Mockup Window */}
        <div className="w-full rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden glass-premium-glow animate-float-slow">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
              <span className="w-3 h-3 rounded-full bg-[#eab308]/80" />
              <span className="w-3 h-3 rounded-full bg-[#22c55e]/80" />
            </div>
            {/* Search/URL Mock */}
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-4 py-1.5 text-xs text-zinc-400 font-mono w-96 justify-center">
              <span className="text-indigo-400 font-semibold">https://</span>
              <span>budgetwise.ai/trip/munnar-tea-escape</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-medium text-emerald-400 uppercase tracking-wider">AI Optimal</span>
            </div>
          </div>

          {/* Main App Layout Grid */}
          <div className="flex flex-col md:flex-row min-h-[460px]">
            {/* Sidebar / Tabs */}
            <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-white/5 p-4 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1 scrollbar-none bg-white/[0.01]">
              <button
                type="button"
                onClick={() => setActiveMockTab("overview")}
                className={`flex-shrink-0 flex items-center gap-2.5 w-auto md:w-full px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeMockTab === "overview"
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>Trip Overview</span>
              </button>

              <div className="hidden md:block my-2 border-t border-white/5" />

              {MOCK_ITINERARY.map((d) => (
                <button
                  type="button"
                  key={d.day}
                  onClick={() => setActiveMockTab(d.day)}
                  className={`flex-shrink-0 flex items-center gap-2.5 w-auto md:w-full px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    activeMockTab === d.day
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5 text-purple-400" />
                  <span>Day {d.day}: {d.day === 1 ? "Tea Hills" : d.day === 2 ? "Hikes" : "Spices"}</span>
                </button>
              ))}

              <div className="hidden md:block my-2 border-t border-white/5" />

              <button
                type="button"
                onClick={() => setActiveMockTab("budget")}
                className={`flex-shrink-0 flex items-center gap-2.5 w-auto md:w-full px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeMockTab === "budget"
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Wallet className="h-3.5 w-3.5 text-emerald-400" />
                <span>Budget Breakdown</span>
              </button>
            </div>

            {/* Content Panel */}
            <div className="flex-1 p-6 md:p-8 bg-white/[0.005] flex flex-col justify-between">
              {/* Tab: Overview */}
              {activeMockTab === "overview" && (
                <div className="space-y-6 animate-scale-in">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white mb-1">Munnar Tea Valley Escape</h3>
                    <p className="text-xs text-indigo-300 font-mono uppercase tracking-widest font-semibold flex items-center gap-2">
                      <span>3 Days</span>
                      <span>•</span>
                      <span>2 Travelers</span>
                      <span>•</span>
                      <span>Optimal Cost Route</span>
                    </p>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                    An immersive Himalayan-vibe tea garden tour using Kerala's public transport systems and homestays. Built for students or budget adventurers seeking gorgeous landscapes without the luxury hotel markup.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border border-white/5 bg-white/[0.02] p-4 rounded-xl">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Total Spent</div>
                      <div className="text-xl font-bold text-white">₹9,850</div>
                    </div>
                    <div className="border border-white/5 bg-white/[0.02] p-4 rounded-xl">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Budget Goal</div>
                      <div className="text-xl font-bold text-zinc-400">₹12,000</div>
                    </div>
                    <div className="border border-indigo-500/20 bg-indigo-500/5 p-4 rounded-xl">
                      <div className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider mb-1">Savings Margin</div>
                      <div className="text-xl font-bold text-indigo-200">₹2,150 (18%)</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Day 1, 2, or 3 */}
              {typeof activeMockTab === "number" && (
                <div className="space-y-5 animate-scale-in">
                  {(() => {
                    const dayData = MOCK_ITINERARY.find(d => d.day === activeMockTab);
                    if (!dayData) return null;
                    return (
                      <>
                        <div>
                          <span className="text-xs font-mono bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full">Day {dayData.day} Timeline</span>
                          <h3 className="font-display text-xl font-bold text-white mt-2">{dayData.title}</h3>
                        </div>

                        <div className="space-y-3.5">
                          {dayData.activities.map((act, index) => (
                            <div key={index} className="flex items-center gap-4 border border-white/5 bg-white/[0.02] p-3.5 rounded-xl transition-all hover:bg-white/[0.05] hover:border-white/10 group">
                              <div className="text-xs font-mono text-zinc-500 w-16">{act.time}</div>
                              <div className="p-2 rounded-lg bg-white/5 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                {getIconComponent(act.icon)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs sm:text-sm font-semibold text-zinc-200 truncate">{act.name}</div>
                              </div>
                              <div className="text-xs font-mono font-semibold text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg">{act.cost}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Tab: Budget */}
              {activeMockTab === "budget" && (
                <div className="space-y-6 animate-scale-in">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white mb-1">Expense Breakdown</h3>
                    <p className="text-xs text-zinc-400">Daily expenses grouped by category</p>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { cat: "Stays & Lodges", cost: "₹3,200", pct: 33, color: "bg-indigo-500" },
                      { cat: "Local Street Food & Cafes", cost: "₹2,400", pct: 24, color: "bg-purple-500" },
                      { cat: "Public Transport & Ferry rides", cost: "₹1,200", pct: 12, color: "bg-emerald-500" },
                      { cat: "Sightseeing & Park entries", cost: "₹1,850", pct: 19, color: "bg-pink-500" },
                      { cat: "Emergency Buffer", cost: "₹1,200", pct: 12, color: "bg-zinc-500" },
                    ].map((b, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-zinc-300">{b.cat}</span>
                          <span className="text-white font-semibold font-mono">{b.cost} <span className="text-zinc-500 font-normal">({b.pct}%)</span></span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/5 border border-white/5">
                          <div className={`h-full rounded-full ${b.color} transition-all duration-1000`} style={{ width: `${b.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Action inside Mockup */}
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-zinc-500 font-mono">
                  Optimized for: <b>Kerala State Road Transit (KSRTC) routes</b>
                </div>
                <Link
                  to="/planner"
                  search={{ destination: "Munnar" }}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.35)] group"
                >
                  <span>Build your own now</span>
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Section with Carousel */}
      <section id="destinations" className="relative z-10 w-full py-24 overflow-hidden">
        {/* Section Header */}
        <div className="mx-auto w-full max-w-7xl px-6 mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-indigo-300 mb-3 backdrop-blur-md">
              <Compass className="h-3 w-3" />
              Explore Budget Escapes
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl text-white">
              Featured Destinations
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl">
              Hand-picked locations offering rich experiences for under ₹1,500/day. Drag to scroll or click a card to see saving hacks.
            </p>

            {/* Season Selector Tabs with spectacular transitions */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                { id: "all", label: "🌎 All Seasons" },
                { id: "winter", label: "❄️ Winter (Oct-Mar)" },
                { id: "summer", label: "☀️ Summer (Mar-Jun)" },
                { id: "monsoon", label: "🌧️ Monsoon (Jul-Oct)" }
              ].map((season) => (
                <button
                  key={season.id}
                  type="button"
                  onClick={() => setSelectedSeason(season.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase border cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 ${
                    selectedSeason === season.id
                      ? "bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.35)] font-bold scale-[1.02]"
                      : "bg-white/5 text-zinc-400 border-white/5 hover:text-white hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  {season.label}
                </button>
              ))}
            </div>
          </div>

          {/* Carousel Control Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleScrollPrev}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all backdrop-blur-md cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              aria-label="Previous Destinations"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleScrollNext}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all backdrop-blur-md cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              aria-label="Next Destinations"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full">
          {/* Left/Right Fading Gradients for Depth */}
          <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#0c0a09] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#0c0a09] to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`flex overflow-x-auto scrollbar-none select-none py-4 px-6 sm:px-12 gap-6 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ scrollBehavior: 'auto' }}
          >
            {(() => {
              const filtered = DESTINATIONS.filter(dest => matchesSeason(dest.bestTime, selectedSeason));
              let displayDests = [...filtered];
              if (displayDests.length > 0) {
                while (displayDests.length < 8) {
                  displayDests = [...displayDests, ...filtered];
                }
              }
              const marqueeDests = [...displayDests, ...displayDests];
              
              if (marqueeDests.length === 0) {
                return (
                  <div className="w-full text-center py-24 text-zinc-500 font-mono text-sm uppercase tracking-widest">
                    No destinations match this season.
                  </div>
                );
              }

              return marqueeDests.map((dest, i) => (
                <div
                  key={i}
                  onClick={() => handleCardClick(dest)}
                  className="group relative flex-shrink-0 w-72 sm:w-80 overflow-hidden rounded-[2.25rem] border border-white/5 bg-white/[0.02] aspect-[4/5] transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)]"
                >
                  {/* Background Image */}
                  <img
                    src={dest.url}
                    alt={dest.name}
                    draggable="false"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
                  />

                  {/* Bottom Shadow Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/50 to-transparent opacity-90 transition-opacity duration-500" />

                  {/* Details glassmorphic panel */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 p-5 rounded-[1.75rem] bg-[#0c0a09]/60 border border-white/5 backdrop-blur-md transition-all duration-500 group-hover:bg-[#0c0a09]/85 group-hover:border-white/15">
                    <h3 className="font-display text-xl font-bold text-white flex items-center gap-1.5 mb-1">
                      <MapPinned className="h-4 w-4 text-indigo-400 shrink-0" />
                      {dest.name}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-1 mb-3.5 group-hover:text-zinc-300 transition-colors">
                      {dest.tagline}
                    </p>

                    <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-[11px] font-mono">
                      <div className="flex items-center gap-1 text-indigo-400 font-semibold">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span>{dest.badge}</span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>{dest.bestTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>



      {/* how */}
      <section id="how" className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-8 sm:p-16 backdrop-blur-md">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl text-center mb-16">How it works</h2>
          <ol className="grid gap-12 sm:grid-cols-3">
            {[
              { n: "01", t: "Tell us about your trip", d: "Select your source, destination, total budget, and number of days." },
              { n: "02", t: "AI builds the plan", d: "Our engine balances stays, food, travel and sights without going over budget." },
              { n: "03", t: "Pack and go", d: "Review the daily breakdown, get insider tips, and share the itinerary." },
            ].map((s, i) => (
              <li key={s.n} className="group relative flex flex-col items-center text-center animate-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-[1px] border-t border-dashed border-white/10" />
                )}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 font-mono text-lg font-medium text-foreground transition-transform duration-500 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  {s.n}
                </div>
                <div className="font-medium text-xl mb-3">{s.t}</div>
                <div className="text-sm text-muted-foreground leading-relaxed max-w-xs">{s.d}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* features */}
      <section id="features" className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-32">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl mb-4">
            Everything you need,<br />
            <span className="text-muted-foreground">nothing you don't.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            One workspace for the entire trip. No tab-hopping. No premium-only suggestions.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={<Wallet />} title="Budget-locked" desc="Plans are built around your number — never above it." delay={0.1} />
          <Feature icon={<MapPinned />} title="Local-first picks" desc="Homestays, street food, and public transit over premium chains." delay={0.2} />
          <Feature icon={<Compass />} title="Real itineraries" desc="Day-by-day plan with timing, distance and cost estimates." delay={0.3} />
          <Feature icon={<Plane />} title="Transport modes" desc="Compare taxis, autos, buses, trains in one view." delay={0.4} />
          <Feature icon={<Star />} title="Attractions ranked" desc="Worthwhile stops curated for your time and money." delay={0.5} />
          <Feature icon={<Sparkles />} title="Pro tips" desc="Local hacks to stretch your budget further." delay={0.6} />
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-10 text-center text-sm text-muted-foreground">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Logo />
        </div>
        <div>
          Built with care • BudgetWise © {new Date().getFullYear()}
        </div>
      </footer>

      {/* Destination Details Dialog Modal */}
      <Dialog open={selectedDestination !== null} onOpenChange={(open) => { if (!open) setSelectedDestination(null); }}>
        <DialogContent className="sm:max-w-[600px] overflow-hidden p-0 bg-[#0c0a09] border border-white/5 text-foreground glass-strong shadow-2xl animate-scale-in">
          {selectedDestination && (
            <div>
              {/* Banner Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <img 
                  src={selectedDestination.url} 
                  alt={selectedDestination.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/20 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-white/10 border border-white/10 text-white backdrop-blur-md font-medium text-xs rounded-full px-3 py-1 hover:bg-white/20">
                  {selectedDestination.badge}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
                <div>
                  <DialogTitle className="text-3xl font-display font-semibold tracking-tight text-white mb-1">
                    {selectedDestination.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm font-medium text-muted-foreground italic">
                    {selectedDestination.tagline}
                  </DialogDescription>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/50 mb-2">Overview</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {selectedDestination.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
                      Why it's featured on BudgetWise
                    </h4>
                    <p className="text-sm text-zinc-300 leading-relaxed bg-white/5 border border-white/10 p-3 sm:p-4 rounded-xl">
                      {selectedDestination.whyFeatured}
                    </p>
                  </div>

                  {/* Quick Specs Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="border border-white/5 bg-white/[0.02] p-4 rounded-2xl">
                      <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Wallet className="h-3.5 w-3.5" />
                        Est. Daily Budget
                      </div>
                      <div className="text-base font-semibold text-white">{selectedDestination.budget}</div>
                    </div>

                    <div className="border border-white/5 bg-white/[0.02] p-4 rounded-2xl">
                      <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Best Time to Visit
                      </div>
                      <div className="text-base font-semibold text-white">{selectedDestination.bestTime}</div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-white/50 mb-2">Budget Highlights</h4>
                    <ul className="grid gap-2 text-sm text-zinc-300">
                      {selectedDestination.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-zinc-500 mt-0.5">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Link
                    to="/planner"
                    search={{ destination: selectedDestination.name }}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white text-black py-3.5 text-sm font-semibold transition-all hover:bg-zinc-100 hover:scale-[1.01]"
                    onClick={() => setSelectedDestination(null)}
                  >
                    Plan Trip to {selectedDestination.name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center bg-white/[0.01] border border-white/5 backdrop-blur-md px-6 py-4 rounded-2xl transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03]">
      <div className="font-display text-3xl font-semibold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">{value}</div>
      <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">{label}</div>
    </div>
  );
}

function Feature({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  return (
    <div 
      className="group relative overflow-hidden rounded-[2rem] glass-premium glass-premium-glow p-8 transition-all duration-500 hover:-translate-y-1.5 animate-fade-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'both' }}
    >
      <div className="relative z-10">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-indigo-400 transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 group-hover:text-indigo-300">
          {icon}
        </div>
        <div className="font-semibold text-lg text-white group-hover:text-indigo-200 transition-colors duration-300">{title}</div>
        <div className="mt-2 text-sm leading-relaxed text-muted-foreground group-hover:text-zinc-300 transition-colors duration-300">{desc}</div>
      </div>
    </div>
  );
}
