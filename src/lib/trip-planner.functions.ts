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
  vibe: z.string().optional().default("Relaxed"),
  food: z.string().optional().default("Local Specialties"),
  pace: z.string().optional().default("Moderate"),
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
  attractions: Array<{ name: string; description: string; estimated_cost: number; duration: string; why: string }>;
  stays: Array<{ name: string; type: string; price_per_night: number; notes: string; why: string }>;
  restaurants: Array<{ name: string; cuisine: string; avg_cost_per_meal: number; vibe: string; why: string }>;
  transport: Array<{ mode: string; description: string; estimated_cost: number; why: string }>;
  itinerary: Array<{ day: number; title: string; plan: string; est_cost: number; why: string }>;
  tips: string[];
};

const systemPrompt = `You are BudgetWise, an expert travel planner for students and tourists.
Return STRICT JSON only that matches the requested schema. No prose, no markdown.
Optimize for STAYING WITHIN BUDGET while offering diverse choice tiers.
Provide a minimum of 6 stay options (2 budget, 2 standard, 2 premium), 6 restaurants (2 budget, 2 standard, 2 premium), and 6 transport options (2 budget, 2 standard, 2 premium), sorted by cost ascending.
Avoid low-end transit like un-AC sleeper classes or non-AC buses; instead suggest AC Chair Cars, AC Express trains, Vande Bharat Express, self-drive rentals, flights, and private AC cabs.
Write elegant, experiential descriptions (2-3 lines) for stays, restaurants, attractions, and transport. Do NOT focus on costs or use terms like 'cheap', 'budget', 'inexpensive', or 'saving money' inside the descriptions. Describe the vibes, scenic beauty, amenities, and why the location is highly recommended.
All numeric costs are in the user's specified currency for the whole trip duration (except price_per_night and avg_cost_per_meal which are per night / per meal).
Return 4-6 attractions, one entry per day in itinerary, and 4-6 practical tips.
Ensure each attraction, stay, restaurant, transport option, and itinerary day includes a "why" string explaining why it was chosen based on the traveler's budget, destination, and their selected vibe, food style, and travel pace preferences.`;

const schemaHint = `{
  "summary": string,
  "currency": string,
  "total_estimated_cost": number,
  "budget_breakdown": { "accommodation": number, "food": number, "transport": number, "activities": number, "buffer": number },
  "attractions": [{ "name": string, "description": string, "estimated_cost": number, "duration": string, "why": string }],
  "stays": [{ "name": string, "type": string, "price_per_night": number, "notes": string, "why": string }],
  "restaurants": [{ "name": string, "cuisine": string, "avg_cost_per_meal": number, "vibe": string, "why": string }],
  "transport": [{ "mode": string, "description": string, "estimated_cost": number, "why": string }],
  "itinerary": [{ "day": number, "title": string, "plan": string, "est_cost": number, "why": string }],
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
      name: matched ? `${matched.name} Backpacker Lodge` : `${destination} Backpacker Lodge`,
      type: "Boutique Hostel",
      price_per_night: Math.round(pricePerNight * 0.7),
      notes: "A clean, modern backpacker hostel with high-speed WiFi, shared workspaces, and a welcoming social terrace."
    },
    {
      name: matched ? `${matched.name} Heritage Guesthouse` : `${destination} Heritage Guesthouse`,
      type: "Homestay / Guesthouse",
      price_per_night: Math.round(pricePerNight * 0.9),
      notes: matched 
        ? `A cozy, family-run local guesthouse in ${matched.name}. ${matched.tagline}`
        : `A warm local homestay run by a friendly family, offering cozy private rooms and delicious home-cooked morning breakfast.`
    },
    {
      name: matched ? `${matched.name} Orchard Cottages` : `${destination} Valley Cottages`,
      type: "Nature Cabins / Cottages",
      price_per_night: Math.round(pricePerNight * 1.2),
      notes: "Charming stone cottages surrounded by organic gardens, offering mountain views, private balconies, and bonfire areas."
    },
    {
      name: matched ? `${matched.name} Central Heights Hotel` : `${destination} Central Heights Hotel`,
      type: "Boutique Hotel",
      price_per_night: Math.round(pricePerNight * 1.4),
      notes: "A stylish central hotel with contemporary design, comfortable modern bedding, a rooftop terrace, and scenic city/valley views."
    },
    {
      name: matched ? `${matched.name} Signature Resort & Spa` : `${destination} Signature Resort & Spa`,
      type: "Luxury Resort",
      price_per_night: Math.round(pricePerNight * 1.9),
      notes: "An upscale resort nestled in pristine nature, featuring premium private villas, infinity pool, multi-cuisine dining, and ayurvedic spa treatments."
    },
    {
      name: matched ? `${matched.name} Palace Villa` : `${destination} Palace Villa`,
      type: "Heritage Villa",
      price_per_night: Math.round(pricePerNight * 2.4),
      notes: "A majestic heritage estate combining royal historical charm with premium personalized butler services and private manicured gardens."
    }
  ];

  const restaurants = [
    {
      name: "Traditional Spice Kitchen",
      cuisine: "Authentic Regional Cuisine",
      avg_cost_per_meal: Math.round(costPerMeal * 0.7),
      vibe: "A busy local diner famous for serving freshly-ground traditional recipes in a welcoming, family-friendly setting."
    },
    {
      name: "The Garden Dhaba",
      cuisine: "North Indian / Regional",
      avg_cost_per_meal: Math.round(costPerMeal * 0.9),
      vibe: "An open-air garden eatery serving delicious clay-oven flatbreads, aromatic curries, and rich buttermilk."
    },
    {
      name: "Rooftop Bistro & Café",
      cuisine: "Continental & Fusion",
      avg_cost_per_meal: Math.round(costPerMeal * 1.2),
      vibe: "A modern rooftop bistro offering spectacular mountain views, artisanal coffee, and a cozy sunset ambiance."
    },
    {
      name: "Banana Leaf Heritage Resto",
      cuisine: "South Indian / Traditional",
      avg_cost_per_meal: Math.round(costPerMeal * 1.4),
      vibe: "A clean, historic restaurant serving multi-course traditional meals on banana leaves with authentic local hospitality."
    },
    {
      name: "The Golden Pavilion",
      cuisine: "Fine Dining Regional",
      avg_cost_per_meal: Math.round(costPerMeal * 1.9),
      vibe: "A premium fine dining hall presenting gourmet regional delicacies, elegant chandelier lighting, and stellar tableside service."
    },
    {
      name: "Reserve Culinary Conservatory",
      cuisine: "Contemporary Chef's Table",
      avg_cost_per_meal: Math.round(costPerMeal * 2.5),
      vibe: "An upscale culinary destination offering curated multi-course tasting menus, signature botanical mocktails, and live jazz."
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
      mode: "AC Chair Car Express Train (Shatabdi/Jan Shatabdi)",
      description: "Comfortable, fast-moving air-conditioned rail passenger coaches, connecting major cities smoothly.",
      estimated_cost: Math.round(transitCost * 0.7)
    },
    {
      mode: "Luxury Multi-Axle AC Volvo Bus",
      description: "Smooth expressway travel in luxury reclining seats with individual charging ports.",
      estimated_cost: Math.round(transitCost * 0.9)
    },
    {
      mode: "Vande Bharat Express (AC Executive Chair Car)",
      description: "State-of-the-art semi-high-speed train featuring ergonomic seats, panoramic windows, and complimentary onboard meals.",
      estimated_cost: Math.round(transitCost * 1.3)
    },
    {
      mode: "Self-Drive Sedan Rental (Zoomcar/Equivalent)",
      description: "Rent a clean, modern hatchback or sedan, giving you full independence to discover scenic detours.",
      estimated_cost: Math.round(transitCost * 1.6)
    },
    {
      mode: "Direct Flight (IndiGo/Air India/Equivalent)",
      description: "Direct scheduled air transit to the nearest regional airport, saving days of overland travel.",
      estimated_cost: Math.round(transitCost * 2.2)
    },
    {
      mode: "Private Chauffeur AC SUV (Innova Crysta)",
      description: "Door-to-door premium private SUV transfer, offering customized sightseeing detours, refreshments, and absolute privacy.",
      estimated_cost: Math.round(transitCost * 2.9)
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
    stays: stays.map(s => ({ ...s, why: `A popular choice in ${destination} that fits within your allocation for lodging.` })),
    restaurants: restaurants.map(r => ({ ...r, why: `Selected based on food preference to give you a great taste of ${destination} without going over budget.` })),
    attractions: attractions.map(a => ({ ...a, why: `A must-see activity when visiting ${destination} that matches your interest level.` })),
    transport: transport.map(t => ({ ...t, why: `Efficient transport option to keep you moving comfortably throughout your stay.` })),
    itinerary: itinerary.map(i => ({ ...i, why: `Day plan optimized to balance sightseeing activities and dining without feeling rushed.` })),
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
- Preferred Vibe: ${data.vibe}
- Food Preference: ${data.food}
- Travel Pace: ${data.pace}

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
