import { planTrip } from "../src/lib/trip-planner.functions";

console.log("planTrip type:", typeof planTrip);
console.log("planTrip keys:", Object.keys(planTrip));
console.log("planTrip properties:", Object.getOwnPropertyNames(planTrip));
console.log("planTrip.toString:", planTrip.toString());
