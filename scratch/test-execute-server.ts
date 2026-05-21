import { planTrip } from "../src/lib/trip-planner.functions";

async function test() {
  console.log("__executeServer type:", typeof planTrip.__executeServer);
  console.log("__executeServer.toString:", planTrip.__executeServer.toString());
  
  const data = {
    source: "Hyderabad",
    destination: "Uttarakhand",
    budget: 45000,
    days: 7,
    travelers: 2,
    currency: "INR"
  };

  try {
    process.env.GEMINI_API_KEY = "AIzaSyAQltkNghCARU7cHri49hg7kB13bx_Vsao";
    
    // Call server function via __executeServer
    console.log("Calling planTrip.__executeServer...");
    // Let's pass the input. The parameter signature of __executeServer might be different, let's test options:
    // It might take an array of arguments or an object. Let's see.
    // In TanStack Start: server functions are called on the server with (payload)
    const result1 = await planTrip.__executeServer(data);
    console.log("Result 1:", result1);
  } catch (error) {
    console.error("Error 1:", error);
  }

  try {
    // Or it might take an object with a args array or data property?
    // Let's test with { data }
    const result2 = await planTrip.__executeServer({ data });
    console.log("Result 2:", result2);
  } catch (error) {
    console.error("Error 2:", error);
  }
}

test();
