import { useState } from "react";
import { Building2, Home, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CAB_BASE_KM,
  CO2_KG_PER_KM,
  computeCabFare,
  computeFare,
  FARE_RATE_PER_KM_INR,
  fareBreakdown,
  formatInr,
  MONTHLY_COMMUTE_KM,
  TRIPS_PER_MONTH,
} from "@/lib/fare";

const MIN_KM = 2;
const MAX_KM = 40;
const MAX_SEATS = 4;
const MARKS = [2, 10, 20, 30, 40];

/**
 * The fare calculator as a journey: drag the car along the road to set the distance, tap
 * seats to choose how many, and read the calculation as a printed ride receipt.
 */
export function FareJourney() {
  const [km, setKm] = useState<number>(MONTHLY_COMMUTE_KM);
  const [seats, setSeats] = useState(1);

  const fare = computeFare(km, seats);
  const cab = computeCabFare(km);
  const breakdown = fareBreakdown(km, seats);
  const save = Math.max(0, cab - fare);
  const monthly = save * TRIPS_PER_MONTH;
  const pct = ((km - MIN_KM) / (MAX_KM - MIN_KM)) * 100;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      {/* Journey: road + seats */}
      <div className="flex flex-col rounded-3xl bg-paper p-6 shadow-card ring-1 ring-line md:p-8">
        <p className="text-xs font-semibold tracking-wider text-ember uppercase">
          Plan your commute
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">Drag the car to your office.</h3>

        {/* The road */}
        <div className="relative mt-10 mb-2 px-7">
          <div className="relative h-16 rounded-pill focus-within:ring-2 focus-within:ring-ember focus-within:ring-offset-4">
            {/* Home and office */}
            <span className="absolute top-1/2 -left-7 grid size-11 -translate-y-1/2 place-items-center rounded-2xl bg-charcoal text-on-dark shadow-card">
              <Home className="size-5" />
            </span>
            <span className="absolute top-1/2 -right-7 grid size-11 -translate-y-1/2 place-items-center rounded-2xl bg-sunrise-gradient text-on-dark shadow-card">
              <Building2 className="size-5" />
            </span>

            {/* Road surface with lane markings; the travelled part glows */}
            <div className="absolute inset-x-4 top-1/2 h-7 -translate-y-1/2 overflow-hidden rounded-pill bg-charcoal">
              <div
                className="absolute inset-y-0 left-0 bg-sunrise-gradient opacity-90 transition-[width] duration-150"
                style={{ width: `${pct}%` }}
              />
              <div className="absolute inset-x-3 top-1/2 h-0.5 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.75)_0_12px,transparent_12px_24px)]" />
            </div>

            {/* The car and its distance bubble */}
            <div
              className="pointer-events-none absolute top-1/2 size-0 transition-[left] duration-150 ease-out"
              style={{ left: `calc(1rem + (100% - 2rem) * ${pct / 100})` }}
            >
              <div className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-pill bg-ink px-3 py-1 text-sm font-bold whitespace-nowrap text-on-dark tabular-nums shadow-card">
                {km} km
              </div>
              <CarTop className="relative -translate-x-1/2 -translate-y-1/2" seats={seats} />
            </div>

            {/* The real control: a range input over the road */}
            <input
              type="range"
              min={MIN_KM}
              max={MAX_KM}
              step={1}
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
              aria-label="One-way commute distance in kilometres"
              aria-valuetext={`${km} kilometres`}
              className="journey-range absolute inset-0 w-full cursor-grab active:cursor-grabbing"
            />
          </div>
          <div className="relative mx-4 h-6 text-xs text-muted tabular-nums">
            {MARKS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setKm(m)}
                className={cn(
                  "absolute min-h-10 min-w-8 -translate-x-1/2 whitespace-nowrap",
                  m === km ? "font-semibold text-ember" : "hover:text-ink",
                )}
                style={{ left: `${((m - MIN_KM) / (MAX_KM - MIN_KM)) * 100}%` }}
              >
                {m} km
              </button>
            ))}
          </div>
        </div>

        {/* Seats */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-[#f7f9fc] p-5 ring-1 ring-line">
          <div>
            <p className="font-semibold text-ink">How many seats?</p>
            <p className="mt-1 text-sm text-ink-soft">
              Tap a seat. Travelling with a friend? Take two.
            </p>
          </div>
          <div
            className="grid grid-cols-2 gap-2 rounded-[1.4rem] bg-charcoal p-3"
            role="radiogroup"
            aria-label="Number of seats"
          >
            {Array.from({ length: MAX_SEATS }, (_, i) => {
              const n = i + 1;
              const on = n <= seats;
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={seats === n}
                  aria-label={`${n} ${n === 1 ? "seat" : "seats"}`}
                  onClick={() => setSeats(n)}
                  className={cn(
                    "grid size-12 place-items-center rounded-xl text-sm font-bold transition-[background-color,transform,color] duration-200 active:scale-95",
                    on
                      ? "bg-sunrise-gradient text-charcoal shadow-[0_6px_16px_rgba(255,107,74,0.45)]"
                      : "bg-white/8 text-on-dark/50 ring-1 ring-white/15 hover:bg-white/15",
                  )}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fills the rest of the card: the commute at a glance, with the wordmark behind */}
        <div className="relative mt-6 flex flex-1 flex-col justify-end overflow-hidden rounded-2xl bg-charcoal p-6 text-on-dark">
          <p
            className="journey-watermark pointer-events-none absolute -right-2 -bottom-3 font-display text-[clamp(4.5rem,9vw,7.5rem)] leading-none font-semibold tracking-[-0.03em] select-none"
            aria-hidden
          >
            RideShare
          </p>
          <div className="relative">
            <p className="text-xs font-semibold tracking-wider text-honey uppercase">
              Your shared commute
            </p>
            <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
              Share the ride. Share the road.
            </p>
            <dl className="mt-5 grid gap-2 sm:grid-cols-3 sm:gap-3">
              <Glance value={`${TRIPS_PER_MONTH}`} label="shared trips a month" />
              <Glance
                value={`${Math.round(km * CO2_KG_PER_KM * TRIPS_PER_MONTH)} kg`}
                label="CO₂ avoided a month*"
              />
              <Glance value={formatInr(monthly)} label="kept in a month" />
            </dl>
            <p className="mt-4 text-[0.7rem] leading-relaxed text-on-dark/55">
              *Estimate: each shared journey replaces a solo car trip, at {CO2_KG_PER_KM} kg of CO₂
              per kilometre.
            </p>
          </div>
        </div>
      </div>

      {/* The receipt */}
      <div className="flex flex-col gap-4">
        <div className="receipt relative overflow-hidden rounded-2xl bg-paper px-6 pt-6 pb-7 shadow-card ring-1 ring-line">
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-semibold">
              Ride<span className="text-ember">Share</span>
            </p>
            <p className="font-mono text-xs text-muted">RIDE RECEIPT</p>
          </div>
          <div className="my-4 border-t border-dashed border-line" />

          <dl className="space-y-2.5 font-mono text-sm">
            <Line label="Distance" value={`${km} km`} />
            <Line label="Rate" value={`${formatInr(FARE_RATE_PER_KM_INR)} / km / seat`} />
            <Line label="Seats" value={`× ${seats}`} />
            <Line label="Distance charge" value={formatInr(breakdown.raw)} />
            <Line
              label="Minimum fare"
              value={formatInr(breakdown.floor)}
              muted={!breakdown.floorApplied}
            />
          </dl>

          <div className="my-4 border-t border-dashed border-line" />
          <div className="flex items-baseline justify-between">
            <p className="font-semibold text-ink">You pay</p>
            <p className="text-4xl font-bold tracking-tight text-ember tabular-nums">
              {formatInr(fare)}
            </p>
          </div>
          <div className="mt-2 flex items-baseline justify-between font-mono text-sm text-muted">
            <span>Typical app cab</span>
            <span className="line-through tabular-nums">{formatInr(cab)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-amber-wash px-4 py-3">
            <span className="text-sm font-semibold text-amber-ink">You save on this trip</span>
            <span className="text-xl font-bold text-amber-ink tabular-nums">{formatInr(save)}</span>
          </div>
          <p className="mt-3 font-mono text-[0.7rem] leading-relaxed text-muted">
            {breakdown.text}
          </p>

          {breakdown.floorApplied ? (
            <span
              key={`${km}-${seats}`}
              className="stamp pointer-events-none absolute top-24 right-4 rotate-[-12deg] rounded-lg border-2 border-ember px-3 py-1 font-mono text-xs font-bold tracking-widest text-ember uppercase"
            >
              Minimum fare
            </span>
          ) : null}
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-charcoal p-6 text-on-dark">
          <div className="absolute inset-0 bg-dotgrid text-on-dark opacity-30" aria-hidden />
          <div className="relative flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-honey/15 text-honey">
              <PiggyBank className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-on-dark/70">Saved in a working month</p>
              <p className="text-4xl font-bold tracking-tight text-honey tabular-nums">
                {formatInr(monthly)}
              </p>
              <p className="mt-1 text-sm text-on-dark/70">
                That is{" "}
                <span className="font-semibold text-on-dark">{formatInr(monthly * 12)}</span> over
                twelve such months.
              </p>
            </div>
          </div>
          <p className="relative mt-4 text-xs leading-relaxed text-on-dark/50">
            Based on {km} km each way, twice a day, for {TRIPS_PER_MONTH / 2} working days a month (
            {TRIPS_PER_MONTH} trips). App-cab estimate: base fare for the first {CAB_BASE_KM} km,
            then a per-kilometre rate, before surge or waiting charges.
          </p>
        </div>
      </div>
    </div>
  );
}

function Glance({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 rounded-xl bg-white/6 px-3 py-3 ring-1 ring-white/10 sm:flex-col sm:justify-start sm:gap-0">
      <dt className="order-2 text-right text-xs leading-snug text-on-dark/65 sm:mt-1 sm:text-left">
        {label}
      </dt>
      <dd className="order-1 font-display text-xl font-semibold whitespace-nowrap text-honey tabular-nums md:text-2xl">
        {value}
      </dd>
    </div>
  );
}

function Line({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4",
        muted ? "text-muted/60" : "text-ink",
      )}
    >
      <dt className="text-muted">{label}</dt>
      <dd className={cn("tabular-nums", muted && "line-through decoration-1")}>{value}</dd>
    </div>
  );
}

/** A car seen from above, with its occupied seats lit. */
function CarTop({ seats, className }: { seats: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 34"
      className={cn("h-10 w-[4.5rem] drop-shadow-lg", className)}
      aria-hidden
    >
      <rect x="2" y="3" width="60" height="28" rx="12" fill="#ffffff" />
      <rect x="4" y="5" width="56" height="24" rx="10" fill="#232a36" />
      <rect x="40" y="8" width="12" height="18" rx="4" fill="#ffd8c9" opacity="0.85" />
      {[
        [14, 9],
        [26, 9],
        [14, 19],
        [26, 19],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="9"
          height="7"
          rx="2"
          fill={i < seats ? "#fcd34d" : "rgba(255,255,255,0.25)"}
        />
      ))}
      <rect x="58" y="7" width="3" height="5" rx="1" fill="#fff6d6" />
      <rect x="58" y="22" width="3" height="5" rx="1" fill="#fff6d6" />
    </svg>
  );
}
