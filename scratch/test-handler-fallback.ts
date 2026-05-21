import { planTrip } from "../src/lib/trip-planner.functions";

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
    console.log("Invoking planTrip server function...");
    
    // We call the handler directly if available, or call the server function
    // In TanStack Start server functions, calling them directly in a server context executes the handler
    // Let's call the server function. In a Node environment, we can pass data in the expected format:
    // For TanStack Start, we call it with the arguments.
    // Let's invoke it:
    // @ts-ignore
    const result = await planTrip({ data });
    
    console.log("\nResult from planTrip:");
    console.log("SUCCESS! Returned a plan successfully despite the 503!");
    console.log("Summary:", result.summary);
    console.log("Total Cost:", result.total_estimated_cost);
  } catch (error) {
    console.error("\nFAILURE! planTrip threw an error to the caller:", error);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test();
