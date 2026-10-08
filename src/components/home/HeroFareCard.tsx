import { useId, useMemo, useRef, useState } from "react";
import { ArrowUpDown, MapPin, Minus, Plus, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { computeCabFare, computeFare, fareBreakdown, formatInr } from "@/lib/fare";

/** Hyderabad localities with approximate centre coordinates. */
const PLACES = [
  { name: "Madhapur", area: "HITEC City", lat: 17.4483, lng: 78.3915 },
  { name: "Gachibowli", area: "Financial District", lat: 17.4401, lng: 78.3489 },
  { name: "HITEC City", area: "Cyber Towers", lat: 17.4474, lng: 78.3762 },
  { name: "Kondapur", area: "Serilingampally", lat: 17.46, lng: 78.364 },
  { name: "Raidurg", area: "Mindspace", lat: 17.4295, lng: 78.38 },
  { name: "Nanakramguda", area: "Financial District", lat: 17.418, lng: 78.343 },
  { name: "Kokapet", area: "Neopolis", lat: 17.396, lng: 78.329 },
  { name: "Narsingi", area: "Outer Ring Road", lat: 17.388, lng: 78.356 },
  { name: "Manikonda", area: "Puppalaguda", lat: 17.4027, lng: 78.387 },
  { name: "Kukatpally", area: "KPHB Colony", lat: 17.4948, lng: 78.3996 },
  { name: "Miyapur", area: "Allwyn Colony", lat: 17.4968, lng: 78.3614 },
  { name: "Hafeezpet", area: "Serilingampally", lat: 17.4826, lng: 78.354 },
  { name: "Bachupally", area: "Nizampet", lat: 17.5447, lng: 78.364 },
  { name: "Jubilee Hills", area: "Road No. 36", lat: 17.4325, lng: 78.4071 },
  { name: "Banjara Hills", area: "Road No. 12", lat: 17.4156, lng: 78.4347 },
  { name: "Ameerpet", area: "SR Nagar", lat: 17.4375, lng: 78.4482 },
  { name: "Begumpet", area: "Prakash Nagar", lat: 17.4447, lng: 78.4664 },
  { name: "Secunderabad", area: "Paradise", lat: 17.4399, lng: 78.4983 },
  { name: "Tolichowki", area: "Shaikpet", lat: 17.399, lng: 78.415 },
  { name: "Mehdipatnam", area: "Rethibowli", lat: 17.395, lng: 78.44 },
  { name: "Uppal", area: "Ramanthapur", lat: 17.4058, lng: 78.5591 },
  { name: "Dilsukhnagar", area: "Kothapet", lat: 17.3688, lng: 78.5247 },
  { name: "LB Nagar", area: "Vanasthalipuram", lat: 17.3457, lng: 78.5522 },
  { name: "Shamshabad", area: "RGI Airport", lat: 17.2403, lng: 78.4294 },
] as const;

type Place = (typeof PLACES)[number];

const ROAD_FACTOR = 1.35; // straight-line distance to typical road distance
const CITY_KMH = 22; // peak-hour city streets, the first 10 km
const ORR_KMH = 40; // longer trips mostly run on the Outer Ring Road
const MAX_SEATS = 3;

function roadKm(a: Place, b: Place) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  const km = 2 * 6371 * Math.asin(Math.sqrt(h)) * ROAD_FACTOR;
  return Math.max(1, Math.round(km * 10) / 10);
}

function tripMinutes(km: number) {
  const city = Math.min(km, 10);
  return Math.round((city / CITY_KMH + (km - city) / ORR_KMH) * 60) + 4;
}

function findPlace(text: string) {
  const t = text.trim().toLowerCase();
  return PLACES.find((p) => p.name.toLowerCase() === t);
}

/** The hero card: pick a pickup and drop-off, and the fare is worked out as you go. */
export function HeroFareCard() {
  const [from, setFrom] = useState("Madhapur");
  const [to, setTo] = useState("Gachibowli");
  const [seats, setSeats] = useState(1);

  const a = findPlace(from);
  const b = findPlace(to);
  const same = a && b && a.name === b.name;
  const trip = useMemo(() => {
    if (!a || !b || a.name === b.name) return null;
    const km = roadKm(a, b);
    const fare = computeFare(km, seats);
    const cab = computeCabFare(km);
    return {
      km,
      minutes: tripMinutes(km),
      fare,
      perSeat: Math.round(fare / seats),
      cab,
      save: Math.max(0, cab - fare),
      working: fareBreakdown(km, seats).text,
    };
  }, [a, b, seats]);

  return (
    <div className="relative mx-auto w-full max-w-sm xl:justify-self-end">
      <div className="animate-float rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-xl hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-on-dark/85">
            <span
              className={cn(
                "size-2 rounded-pill",
                trip ? "animate-pulse-ring bg-good-bright" : "bg-honey",
              )}
            />
            {trip ? "Match found" : "Plan your trip"}
          </p>
          <p
            key={trip ? `${trip.km}` : "none"}
            className="animate-page-in rounded-pill bg-white/10 px-2.5 py-1 text-xs text-on-dark/75 tabular-nums"
          >
            {trip
              ? `${trip.km} km · approx. ${trip.minutes} min`
              : same
                ? "Choose two different places"
                : "Enter both places"}
          </p>
        </div>

        <div className="relative mt-5">
          <span
            className="absolute top-7 bottom-7 left-[7px] border-l-2 border-dashed border-white/25"
            aria-hidden
          />
          <PlaceField
            label="Pickup"
            value={from}
            onChange={setFrom}
            place={a}
            marker={<span className="size-4 rounded-pill border-[3px] border-on-dark bg-navy" />}
          />
          <button
            type="button"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            aria-label="Swap pickup and drop-off"
            className="absolute top-1/2 right-0 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-pill bg-white/10 text-on-dark/80 ring-1 ring-white/20 transition-colors hover:bg-white/20 hover:text-on-dark"
          >
            <ArrowUpDown className="size-4" />
          </button>
          <PlaceField
            label="Drop-off"
            value={to}
            onChange={setTo}
            place={b}
            marker={<MapPin className="size-4 text-sky" />}
          />
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-navy/70 p-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-pill bg-brand-gradient">
            <UserRound className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug font-semibold">Verified colleague</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-on-dark/60">
              <button
                type="button"
                onClick={() => setSeats((s) => Math.max(1, s - 1))}
                disabled={seats === 1}
                aria-label="One seat fewer"
                className="grid size-6 place-items-center rounded-pill bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-40"
              >
                <Minus className="size-3" />
              </button>
              <span className="min-w-12 text-center tabular-nums" aria-live="polite">
                {seats} {seats === 1 ? "seat" : "seats"}
              </span>
              <button
                type="button"
                onClick={() => setSeats((s) => Math.min(MAX_SEATS, s + 1))}
                disabled={seats === MAX_SEATS}
                aria-label="One seat more"
                className="grid size-6 place-items-center rounded-pill bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-40"
              >
                <Plus className="size-3" />
              </button>
            </div>
          </div>
          <div className="text-right" aria-live="polite">
            <p
              key={trip ? `${trip.fare}` : "none"}
              className="animate-page-in text-lg font-bold tabular-nums"
            >
              {trip ? formatInr(trip.fare) : "—"}
            </p>
            <p className="text-[0.65rem] text-on-dark/55">
              {seats > 1 && trip ? `${formatInr(trip.perSeat)} per seat` : "your fare"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-lg bg-white/8 py-2">
            <p className="text-on-dark/60">Typical app cab</p>
            <p className="mt-0.5 font-semibold text-on-dark/80 line-through tabular-nums">
              {trip ? formatInr(trip.cab) : "—"}
            </p>
          </div>
          <div className="rounded-lg bg-good-bright/15 py-2 ring-1 ring-good-bright/30">
            <p className="text-on-dark/75">You save</p>
            <p
              key={trip ? `${trip.save}` : "none"}
              className="mt-0.5 animate-page-in font-semibold text-good-bright tabular-nums"
            >
              {trip ? formatInr(trip.save) : "—"}
            </p>
          </div>
        </div>
        <p className="mt-3 min-h-4 text-center text-[0.7rem] text-on-dark/50 tabular-nums">
          {same
            ? "Pickup and drop-off are the same place."
            : trip
              ? trip.working
              : "Choose a locality from the suggestions."}
        </p>
      </div>
    </div>
  );
}

/** A text field with locality suggestions, keyboard friendly (arrows, Enter, Escape). */
function PlaceField({
  label,
  value,
  onChange,
  place,
  marker,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  place: Place | undefined;
  marker: React.ReactNode;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);

  const q = value.trim().toLowerCase();
  const matches = (
    place
      ? PLACES
      : PLACES.filter((p) => p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q))
  ).slice(0, 6);

  const pick = (p: Place) => {
    onChange(p.name);
    setOpen(false);
  };

  return (
    <div className="relative flex gap-3 py-1.5 pr-11">
      <span className="relative mt-[1.6rem] grid w-4 shrink-0 place-items-center">{marker}</span>
      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className="text-[0.7rem] font-semibold tracking-wider text-on-dark/50 uppercase"
        >
          {label}
        </label>
        <input
          ref={input}
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setHi(0);
          }}
          onFocus={(e) => {
            e.target.select();
            setOpen(true);
            setHi(0);
          }}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (!open || matches.length === 0) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHi((h) => (h + 1) % matches.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHi((h) => (h - 1 + matches.length) % matches.length);
            } else if (e.key === "Enter") {
              e.preventDefault();
              pick(matches[hi]!);
              input.current?.blur();
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Type a locality"
          className="mt-0.5 w-full rounded-lg bg-transparent px-0 py-0.5 text-base font-semibold text-on-dark outline-none placeholder:font-normal placeholder:text-on-dark/40 focus:bg-white/5 focus:px-2"
        />
        <p className="text-xs text-on-dark/60">
          {place ? `${place.area}, Hyderabad` : value ? "Pick from the list" : " "}
        </p>
      </div>

      {open && matches.length > 0 ? (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="absolute top-full right-0 left-7 z-30 mt-1 max-h-60 overflow-auto rounded-xl bg-[#1f1915]/95 p-1 shadow-card ring-1 ring-white/15 backdrop-blur-xl"
        >
          {matches.map((p, i) => (
            <li
              key={p.name}
              role="option"
              aria-selected={i === hi}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(p);
              }}
              onMouseEnter={() => setHi(i)}
              className={cn(
                "flex cursor-pointer items-baseline justify-between gap-3 rounded-lg px-3 py-2 text-sm",
                i === hi ? "bg-white/10 text-on-dark" : "text-on-dark/80",
              )}
            >
              <span className="font-semibold">{p.name}</span>
              <span className="truncate text-xs text-on-dark/50">{p.area}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
