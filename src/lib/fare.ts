/** Same fare model the product charges — a formula, not a typed-in number. */
export const FARE_RATE_PER_KM_INR = 4;
export const FARE_MIN_SHORT_INR = 40;
export const FARE_MIN_INR = 70;
export const SHORT_HOP_KM = 5;

export const CAB_BASE_INR = 90;
export const CAB_BASE_KM = 5;
export const CAB_PER_KM_INR = 9;

export const MONTHLY_COMMUTE_KM = 15;
export const TRIPS_PER_MONTH = 2 * 22;

/**
 * fare = max(rate × distance × seats, minimum). The minimum is tiered on trip length,
 * not seat count, so two seats on a short hop pay the minimum once.
 */
export function computeFare(km: number, seats = 1): number {
  const min = km <= SHORT_HOP_KM ? FARE_MIN_SHORT_INR : FARE_MIN_INR;
  return Math.max(min, Math.round(km * FARE_RATE_PER_KM_INR * seats));
}

export function computeCabFare(km: number): number {
  if (km <= CAB_BASE_KM) return CAB_BASE_INR;
  return CAB_BASE_INR + Math.round((km - CAB_BASE_KM) * CAB_PER_KM_INR);
}

export const FARE_DISTANCES_KM = [5, 10, 15, 20, 25, 30] as const;

export function monthlyRideShare(): number {
  return computeFare(MONTHLY_COMMUTE_KM) * TRIPS_PER_MONTH;
}

export function monthlyCab(): number {
  return computeCabFare(MONTHLY_COMMUTE_KM) * TRIPS_PER_MONTH;
}

export function formatInr(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

/** How computeFare reached its number, so the page can show its working. */
export function fareBreakdown(km: number, seats = 1) {
  const raw = Math.round(km * FARE_RATE_PER_KM_INR * seats);
  const floor = km <= SHORT_HOP_KM ? FARE_MIN_SHORT_INR : FARE_MIN_INR;
  const fare = computeFare(km, seats);
  const seatPart = seats > 1 ? ` × ${seats} seats` : "";
  const working = `${km} km × ${formatInr(FARE_RATE_PER_KM_INR)}${seatPart} = ${formatInr(raw)}`;
  return {
    raw,
    floor,
    fare,
    floorApplied: raw < floor,
    text: raw < floor ? `${working} → ${formatInr(floor)} minimum applies` : working,
  };
}

export function cabBreakdown(km: number): string {
  if (km <= CAB_BASE_KM) return `${formatInr(CAB_BASE_INR)} base covers the first ${CAB_BASE_KM} km`;
  const extra = Number((km - CAB_BASE_KM).toFixed(1));
  return `${formatInr(CAB_BASE_INR)} base + ${extra} km × ${formatInr(CAB_PER_KM_INR)} = ${formatInr(computeCabFare(km))}`;
}

/** The illustrative trip used across the hero card and phone screens. */
export const SAMPLE_TRIP = {
  pickup: { place: "Madhapur", detail: "HITEC City, Hyderabad" },
  drop: { place: "Gachibowli", detail: "Financial District, Hyderabad" },
  km: 8.1,
  minutes: 21,
} as const;

/** Emissions method, as stated beside the platform statistics: 0.23 kg of CO₂ per car-km avoided. */
export const CO2_KG_PER_KM = 0.23;
