import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { DESTINATIONS } from "./destinations.data";

const InputSchema = z.object({
  source: z.string().min(1).max(120),
  destination: z.string().min(1).max(120),
  budget: z.number().min(500).max(10_000_000),
  currency: z.string().default("INR"),
  days: z.number().min(1).max(30).default(3),
  travelers: z.number().min(1).max(20).default(1),
});

export type TripInput = z.infer<typeof InputSchema>;

export type TripPlan = {
  summary: string;
  currency: string;
  total_estimated_cost: number;
  budget_breakdown: {
    accommodation: number;
    food: number;
    transport: number;
    activities: number;
    buffer: number;
  };
  attractions: Array<{ name: string; description: string; estimated_cost: number; duration: string }>;
  stays: Array<{ name: string; type: string; price_per_night: number; notes: string }>;
  restaurants: Array<{ name: string; cuisine: string; avg_cost_per_meal: number; vibe: string }>;
  transport: Array<{ mode: string; description: string; estimated_cost: number }>;
  itinerary: Array<{ day: number; title: string; plan: string; est_cost: number }>;
  tips: string[];
};

const systemPrompt = `You are BudgetWise, an expert travel planner for students and tourists.
Return STRICT JSON only that matches the requested schema. No prose, no markdown.
Optimize for STAYING WITHIN BUDGET. Prefer practical, cost-effective options
(homestays, hostels, local eateries, public transit) over premium ones, while
still suggesting genuinely worthwhile experiences.
All numeric costs are in the user's specified currency for the whole trip duration
(except price_per_night and avg_cost_per_meal which are per night / per meal).
Return 4-6 attractions, 3-4 stays, 4-5 restaurants, 3-4 transport options,
one entry per day in itinerary, and 4-6 practical tips.`;

const schemaHint = `{
  "summary": string,
  "currency": string,
  "total_estimated_cost": number,
  "budget_breakdown": { "accommodation": number, "food": number, "transport": number, "activities": number, "buffer": number },
  "attractions": [{ "name": string, "description": string, "estimated_cost": number, "duration": string }],
  "stays": [{ "name": string, "type": string, "price_per_night": number, "notes": string }],
  "restaurants": [{ "name": string, "cuisine": string, "avg_cost_per_meal": number, "vibe": string }],
  "transport": [{ "mode": string, "description": string, "estimated_cost": number }],
  "itinerary": [{ "day": number, "title": string, "plan": string, "est_cost": number }],
  "tips": [string]
}`;

// Fetch with automatic retry configuration to handle transient rate limits/503s
async function fetchWithRetry(url: string, options: RequestInit, retries = 2, delay = 1000): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        if (i === retries) return res; // Last try, return the response
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      return res;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error("API call failed after retries.");
}

// Local High-Fidelity Fallback Generator
export function generateFallbackPlan(data: TripInput): TripPlan {
  const days = data.days;
  const travelers = data.travelers;
  const budget = data.budget;
  const destination = data.destination;
  const source = data.source;

  // Search if destination exists in our 50+ curated destinations
  const matched = DESTINATIONS.find(
    (d) => d.name.toLowerCase().trim() === destination.toLowerCase().trim()
  );

  // Math-locked budget breakdown
  const accommodationTotal = Math.round(budget * 0.30);
  const foodTotal = Math.round(budget * 0.25);
  const transportTotal = Math.round(budget * 0.15);
  const activitiesTotal = Math.round(budget * 0.20);
  const bufferTotal = Math.round(budget * 0.10);
  const totalCost = accommodationTotal + foodTotal + transportTotal + activitiesTotal + bufferTotal;

  const pricePerNight = Math.max(150, Math.round(accommodationTotal / Math.max(1, days) / travelers));
  const costPerMeal = Math.max(50, Math.round(foodTotal / Math.max(1, days * 3) / travelers));
  const activityCost = Math.round(activitiesTotal / 4);
  const transitCost = Math.round(transportTotal / 3);

  const stays = [
    {
      name: matched ? `${matched.name} Homestay & Inn` : `${destination} Heritage Homestay`,
      type: "Guesthouse / Homestay",
      price_per_night: pricePerNight,
      notes: matched 
        ? `Top-rated budget stay in ${matched.name}. ${matched.tagline}`
        : `Cozy local homestay hosted by a welcoming family. Includes authentic breakfast, hot water, and helpful hosts.`
    },
    {
      name: `${destination} Backpacker Lodge`,
      type: "Youth Hostel",
      price_per_night: Math.round(pricePerNight * 0.8),
      notes: "Social community hostel featuring clean shared dorms, a common workspace, and high-speed Wi-Fi."
    },
    {
      name: `${destination} Nature Eco-Cabins`,
      type: "Eco Lodge / Cabin",
      price_per_night: Math.round(pricePerNight * 1.35),
      notes: "Environmentally sustainable cabins located near scenic vistas. Great options for nature trails."
    }
  ];

  const restaurants = [
    {
      name: "The Local Treat Kitchen",
      cuisine: "Regional Local Food",
      avg_cost_per_meal: costPerMeal,
      vibe: "A very popular and busy local eatery serving authentic traditional dishes."
    },
    {
      name: "Summit View Café",
      cuisine: "Café & Fast Food",
      avg_cost_per_meal: Math.round(costPerMeal * 1.25),
      vibe: "Rooftop café with beautiful scenery, perfect for evening tea and snacks."
    },
    {
      name: "Highway Corner Dhaba",
      cuisine: "North-Indian / Regional",
      avg_cost_per_meal: Math.round(costPerMeal * 0.75),
      vibe: "Open-air dhaba style seating with highly affordable quick meals."
    }
  ];

  const attractions = [];
  if (matched && matched.highlights && matched.highlights.length > 0) {
    matched.highlights.forEach((hl, idx) => {
      attractions.push({
        name: hl.split(" - ")[0] || hl,
        description: hl,
        estimated_cost: idx === 0 ? 0 : Math.round(activityCost * (0.6 + idx * 0.2)),
        duration: "2-3 hours"
      });
    });
  } else {
    attractions.push(
      {
        name: `${destination} Viewpoint Hike`,
        description: "A scenic walking trail leading up to the highest point in the valley, offering breathtaking vistas.",
        estimated_cost: activityCost,
        duration: "3 hours"
      },
      {
        name: `${destination} Old Town & Heritage Quarter`,
        description: "Self-guided walking tour exploring local architecture, historic temples, and local culture.",
        estimated_cost: 0,
        duration: "2 hours"
      },
      {
        name: "Artisans Cooperative Bazaar",
        description: "A bustling cooperative market displaying traditional handicrafts, local spices, and fabrics.",
        estimated_cost: Math.round(activityCost * 1.2),
        duration: "2.5 hours"
      }
    );
  }

  const transport = [
    {
      mode: "State Roadways Bus (KSRTC/Equivalent)",
      description: "Extremely reliable state-run public transport connecting major terminals.",
      estimated_cost: transitCost
    },
    {
      mode: "Shared Autos & E-Rickshaws",
      description: "Highly budget-friendly electric rickshaws for small hops around the city centre.",
      estimated_cost: Math.round(transitCost * 0.6)
    },
    {
      mode: "Local Scooty Rental",
      description: "Self-drive scooter rental option, providing total transit independence.",
      estimated_cost: Math.round(transitCost * 1.3)
    }
  ];

  const itinerary = [];
  const genericActivities = [
    "Arrive, check into your local stay, and take a relaxing evening walk around the local market.",
    "Start early with a trek to the main viewpoint. Grab a delicious regional lunch, and explore the heritage quarter.",
    "Spend the day exploring nearby parks. Rent a local scooty to visit scenic waterfalls and catch the sunset.",
    "Visit the artisans cooperative bazaar for souvenir shopping. Try local street food snacks before departure."
  ];

  for (let d = 1; d <= days; d++) {
    const actIndex = (d - 1) % genericActivities.length;
    const estCost = Math.round((foodTotal / days) + (transitCost / days) + (activitiesTotal / days));
    itinerary.push({
      day: d,
      title: d === 1 ? "Arrival & Orientation" : d === days ? "Farewell & Departure" : `Explore ${destination} Highlights`,
      plan: `[Day ${d}] ${genericActivities[actIndex]} Head over to recommended street food stalls for dinner.`,
      est_cost: estCost
    });
  }

  const tips = matched && matched.whyFeatured ? [
    matched.whyFeatured,
    "Use public transit and shared rickshaws to cut down local transport costs by up to 80%.",
    "Always purchase entrance tickets at official counters directly rather than through local agencies.",
    "Prefer eating at local dhabas and home kitchens for delicious regional taste at student-friendly rates."
  ] : [
    "Use public transit and shared rickshaws to cut down local transport costs by up to 80%.",
    "Always purchase entrance tickets at official counters directly rather than through local agencies.",
    "Prefer eating at local dhabas and home kitchens for delicious regional taste at student-friendly rates.",
    "Keep cash handy, as digital network signals can be intermittent in high viewpoints."
  ];

  return {
    summary: matched 
      ? `An optimized, budget-locked itinerary for a ${days}-day escape to ${destination} from ${source}. ${matched.description}`
      : `An optimized, budget-locked itinerary for a ${days}-day escape to ${destination} from ${source}. Custom-built to keep your adventure completely budget-safe.`,
    currency: "INR",
    total_estimated_cost: totalCost,
    budget_breakdown: {
      accommodation: accommodationTotal,
      food: foodTotal,
      transport: transportTotal,
      activities: activitiesTotal,
      buffer: bufferTotal
    },
    stays,
    restaurants,
    attractions,
    transport,
    itinerary,
    tips
  };
}

export async function planTripHandler(data: TripInput): Promise<TripPlan> {
  const safeEnv = (key: string) => {
    try {
      if (typeof process !== "undefined" && process.env) {
        return process.env[key];
      }
      // @ts-ignore
      if (typeof globalThis !== "undefined" && globalThis[key]) return globalThis[key];
    } catch {
      return undefined;
    }
    return undefined;
  };

  let apiKey = safeEnv("LOVABLE_API_KEY");
  let endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";

  if (!apiKey) {
    apiKey = safeEnv("GEMINI_API_KEY");
    endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/v1/chat/completions";
  }

  if (!apiKey) {
    console.error("AI service not configured. Missing API keys. Activating local fallback generator.");
    return generateFallbackPlan(data);
  }

  const userPrompt = `Plan a trip:
- From: ${data.source}
- To: ${data.destination}
- Total budget: ${data.budget} ${data.currency}
- Days: ${data.days}
- Travelers: ${data.travelers}

Respond with JSON matching this schema exactly:
${schemaHint}`;

  try {
    const res = await fetchWithRetry(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "{}";

    let parsed: TripPlan;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI returned invalid JSON.");
      parsed = JSON.parse(match[0]);
    }

    return parsed;
  } catch (error: any) {
    console.warn("AI Generation failed. Initiating high-fidelity local fallback engine:", error);
    try {
      const fallback = generateFallbackPlan(data);
      return fallback;
    } catch (fallbackError) {
      console.error("Critical: Fallback engine failed as well:", fallbackError);
      throw new Error("We couldn't build your plan at this time. Please try again.");
    }
  }
}

export const planTrip = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    return planTripHandler(data);
  });
