import { planTrip } from "../src/lib/trip-planner.functions";

async function test() {
  const data = {
    source: "Hyderabad",
    destination: "Uttarakhand",
    budget: 45000,
    days: 7,
    travelers: 2,
    currency: "INR"
  };

  try {
    // Set environment variable so it triggers the fallback or the API
    process.env.GEMINI_API_KEY = "AIzaSyAQltkNghCARU7cHri49hg7kB13bx_Vsao";
    
    // Call server function
    console.log("Calling planTrip...");
    const result = await planTrip({ data });
    console.log("Raw result:", result);
  } catch (error) {
    console.error("Error calling planTrip:", error);
  }
}

test();
