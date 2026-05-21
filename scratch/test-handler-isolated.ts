import { planTripHandler } from "../src/lib/trip-planner.functions";

async function test() {
  console.log("Mocking global fetch to return a 503 Service Unavailable...");
  
  const originalFetch = globalThis.fetch;
  
  // Mock fetch to simulate Gemini returning 503
  globalThis.fetch = async (url, options) => {
    console.log(`[Mock Fetch] Intercepted request to: ${url}`);
    return {
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
      json: async () => ({ error: { message: "Service Unavailable" } }),
      text: async () => "Service Unavailable",
    } as Response;
  };

  const data = {
    source: "Hyderabad",
    destination: "Uttarakhand",
    budget: 45000,
    days: 7,
    travelers: 2,
    currency: "INR"
  };

  try {
    // Set environment variable so that it does not early exit due to missing API key,
    // and instead executes the fetch request which will fail with a 503 status code.
    process.env.GEMINI_API_KEY = "dummy-api-key";

    console.log("Invoking planTripHandler directly...");
    const result = await planTripHandler(data);
    
    console.log("\nResult from planTripHandler:");
    console.log("SUCCESS! Returned a plan successfully despite the 503!");
    console.log("Summary:", result.summary);
    console.log("Total Cost:", result.total_estimated_cost);
    console.log("Stays Count:", result.stays.length);
    console.log("Attractions Count:", result.attractions.length);
  } catch (error) {
    console.error("\nFAILURE! planTripHandler threw an error:", error);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test();
