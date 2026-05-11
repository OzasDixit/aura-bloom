import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

export const planTrip = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("AI service not configured. Please contact support.");
    }

    const userPrompt = `Plan a trip:
- From: ${data.source}
- To: ${data.destination}
- Total budget: ${data.budget} ${data.currency}
- Days: ${data.days}
- Travelers: ${data.travelers}

Respond with JSON matching this schema exactly:
${schemaHint}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in Lovable Cloud.");
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}): ${t.slice(0, 200)}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "{}";

    let parsed: TripPlan;
    try {
      parsed = JSON.parse(content);
    } catch {
      // try to recover JSON if the model wrapped it
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI returned invalid JSON.");
      parsed = JSON.parse(match[0]);
    }

    return parsed;
  });
