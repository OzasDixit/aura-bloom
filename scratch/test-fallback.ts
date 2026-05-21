import { planTrip } from "../src/lib/trip-planner.functions";

async function test() {
  console.log("Testing fallback engine directly...");
  const data = {
    source: "Hyderabad",
    destination: "Uttarakhand",
    budget: 45000,
    days: 7,
    travelers: 2,
    currency: "INR"
  };

  try {
    // We can import the file and call its internal generateFallbackPlan or test the main handler if we mock the env
    const { generateFallbackPlan } = await import("../src/lib/trip-planner.functions");
    // @ts-ignore
    const result = generateFallbackPlan(data);
    console.log("Fallback execution SUCCESS!");
    console.log("Summary:", result.summary);
    console.log("Stays:", result.stays.length);
    console.log("Attractions:", result.attractions.length);
    console.log("Restaurants:", result.restaurants.length);
    console.log("Transport:", result.transport.length);
    console.log("Itinerary:", result.itinerary.length);
  } catch (error) {
    console.error("Fallback execution FAILED:", error);
  }
}

test();
