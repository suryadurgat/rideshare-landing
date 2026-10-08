import { useEffect, useRef, useState } from "react";
import { Car, Hand, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_SCREENS } from "./PhoneFrame";
import { Reveal } from "./Reveal";

type Point = {
  /** Position inside the screenshot, as a percentage of its width and height. */
  x: number;
  y: number;
  /** Centre of the feature the lens should magnify, if different from the dot. */
  fx?: number;
  fy?: number;
  title: string;
  body: string;
  stats?: { label: string; value: string }[];
};

type Screen = {
  id: string;
  tab: string;
  image: { src: string; alt: string };
  points: Point[];
};

type Mode = "passenger" | "driver";

const TOUR: Record<Mode, { label: string; icon: typeof UserRound; screens: Screen[] }> = {
  passenger: {
    label: "Passenger",
    icon: UserRound,
    screens: [
      {
        id: "home",
        tab: "Home",
        image: APP_SCREENS.passengerHome,
        points: [
          {
            x: 84,
            y: 16,
            fx: 29,
            fy: 16,
            title: "Search your destination",
            body: "Enter where you are going. RideShare looks for colleagues who are already driving that way.",
          },
          {
            x: 84,
            y: 28,
            fx: 18,
            fy: 25,
            title: "Track ongoing rides",
            body: "Any journey in progress appears here with its live status, so you always know where your ride is.",
          },
          {
            x: 50,
            y: 41,
            fx: 43,
            fy: 42,
            title: "Your commute record",
            body: "See your rides taken, rating, trust score and completed trips in one place.",
            stats: [
              { label: "Rides taken", value: "9" },
              { label: "Rating", value: "5.0" },
              { label: "Trust score", value: "100" },
              { label: "Completed", value: "9" },
            ],
          },
          {
            x: 88,
            y: 51,
            fx: 50,
            fy: 51,
            title: "Recent rides",
            body: "Your latest completed journeys, with the route and the colleague you travelled with.",
          },
        ],
      },
      {
        id: "route",
        tab: "Route",
        image: APP_SCREENS.pickRoute,
        points: [
          {
            x: 50,
            y: 25,
            fx: 57,
            fy: 28,
            title: "Routes on a live map",
            body: "Every route option is drawn on a Google map, so you can see exactly which roads your journey will take.",
          },
          {
            x: 88,
            y: 48,
            fx: 32,
            fy: 48,
            title: "Compare route options",
            body: "Each option shows its travel time, distance and expected arrival time, with the fastest route highlighted.",
            stats: [
              { label: "Fastest", value: "14 min" },
              { label: "Distance", value: "4.6 km" },
              { label: "Second option", value: "15 min" },
              { label: "Third option", value: "17 min" },
            ],
          },
          {
            x: 88,
            y: 76,
            fx: 51,
            fy: 76,
            title: "Confirm and continue",
            body: "Choose the route that suits you and continue. Colleagues travelling along it can then be matched with you.",
          },
        ],
      },
      {
        id: "match",
        tab: "Live map",
        image: APP_SCREENS.driverRoute,
        points: [
          {
            x: 50,
            y: 22,
            fx: 50,
            fy: 22,
            title: "Your journey on Google Maps",
            body: "The route is drawn on a live Google map, so you can see exactly which roads your journey will take.",
          },
          {
            x: 88,
            y: 48,
            fx: 36,
            fy: 49,
            title: "Travel time and arrival",
            body: "Each route shows its travel time, distance and expected arrival, with the fastest option highlighted.",
            stats: [
              { label: "Fastest", value: "125 min" },
              { label: "Distance", value: "102.8 km" },
              { label: "Arrive by", value: "11:20 am" },
              { label: "Alternative", value: "166 min" },
            ],
          },
          {
            x: 88,
            y: 66,
            fx: 50,
            fy: 69,
            title: "Confirm and set off",
            body: "Continue with the route that suits you, and colleagues travelling along it can be matched with you.",
          },
        ],
      },
      {
        id: "rides",
        tab: "My rides",
        image: APP_SCREENS.myRides,
        points: [
          {
            x: 90,
            y: 12,
            fx: 42,
            fy: 12,
            title: "Filter by status",
            body: "Switch between ongoing, completed and cancelled journeys with a single tap.",
          },
          {
            x: 90,
            y: 25,
            fx: 23,
            fy: 22,
            title: "Complete ride history",
            body: "Every journey is recorded with its route and driver, giving you a clear record of your commute.",
          },
          {
            x: 82,
            y: 58,
            fx: 50,
            fy: 58,
            title: "Rate your ride",
            body: "Ratings contribute to fair seat allocation and help keep the community trustworthy.",
          },
        ],
      },
      {
        id: "sos",
        tab: "SOS",
        image: APP_SCREENS.sos,
        points: [
          {
            x: 86,
            y: 41,
            fx: 50,
            fy: 41,
            title: "Confirmation before sending",
            body: "A short confirmation step prevents accidental alerts while keeping help one tap away.",
          },
          {
            x: 84,
            y: 56,
            fx: 50,
            fy: 56,
            title: "One-tap emergency alert",
            body: "Your current location is shared immediately with your organisation's safety team.",
          },
        ],
      },
    ],
  },
  driver: {
    label: "Driver",
    icon: Car,
    screens: [
      {
        id: "driver-home",
        tab: "Home",
        image: APP_SCREENS.driverHome,
        points: [
          {
            x: 48,
            y: 21,
            fx: 18,
            fy: 21,
            title: "Driver mode",
            body: "Switch between passenger and driver from the same account, depending on how you travel that day.",
          },
          {
            x: 86,
            y: 56,
            fx: 26,
            fy: 56,
            title: "Set your route",
            body: "Tell RideShare where you are driving, and colleagues heading the same way can be matched to your spare seats.",
          },
          {
            x: 50,
            y: 81,
            fx: 49,
            fy: 83,
            title: "Your driving record",
            body: "Seats offered, your rating, trust score and completed trips, updated after every journey.",
            stats: [
              { label: "Rides offered", value: "16" },
              { label: "Rating", value: "4.5" },
              { label: "Trust score", value: "90" },
              { label: "Completed", value: "1" },
            ],
          },
        ],
      },
      {
        id: "driver-destination",
        tab: "Destination",
        image: APP_SCREENS.driverDestination,
        points: [
          {
            x: 88,
            y: 17,
            fx: 24,
            fy: 17,
            title: "Search your destination",
            body: "Type where you are heading. Place suggestions appear as you type, so you rarely need the full address.",
          },
          {
            x: 88,
            y: 40,
            fx: 51,
            fy: 41,
            title: "Pick from suggestions",
            body: "Each suggestion shows the locality and area, so you can be sure you have chosen the right place.",
          },
        ],
      },
      {
        id: "driver-route",
        tab: "Route",
        image: APP_SCREENS.driverRoute,
        points: [
          {
            x: 50,
            y: 25,
            fx: 50,
            fy: 25,
            title: "Routes on a live map",
            body: "Every route option is drawn on a Google map, so you can see exactly which roads you will take.",
          },
          {
            x: 88,
            y: 48,
            fx: 34,
            fy: 48,
            title: "Compare route options",
            body: "Each option shows its travel time, distance and expected arrival time, with the fastest route highlighted.",
            stats: [
              { label: "Fastest", value: "125 min" },
              { label: "Distance", value: "102.8 km" },
              { label: "Arrive by", value: "11:20 am" },
              { label: "Alternative", value: "166 min" },
            ],
          },
          {
            x: 88,
            y: 67,
            fx: 51,
            fy: 67,
            title: "Confirm your route",
            body: "Continue with the route you prefer. Passengers are matched along it, so nobody asks you to change your plans.",
          },
        ],
      },
      {
        id: "driver-seats",
        tab: "Seats",
        image: APP_SCREENS.driverSeats,
        points: [
          {
            x: 50,
            y: 18,
            fx: 36,
            fy: 16,
            title: "Offer your spare seats",
            body: "Choose how many passengers you can take, from one to four. Only the seats you offer are ever filled.",
          },
          {
            x: 88,
            y: 34,
            fx: 49,
            fy: 34,
            title: "Start the ride",
            body: "Once you start, colleagues waiting along your route can be matched to your car.",
          },
        ],
      },
      {
        id: "driver-active",
        tab: "Driving",
        image: APP_SCREENS.driverActive,
        points: [
          {
            x: 88,
            y: 60,
            fx: 24,
            fy: 62,
            title: "Your ride at a glance",
            body: "Your active ride stays on the home screen, showing the destination, how many passengers are aboard and your arrival time.",
            stats: [
              { label: "Destination", value: "Gachibowli Stadium" },
              { label: "Aboard", value: "0 of 3" },
              { label: "Distance", value: "111.7 km" },
              { label: "Arrival", value: "2:04 pm" },
            ],
          },
          {
            x: 50,
            y: 80,
            fx: 45,
            fy: 77,
            title: "Your record updates",
            body: "Your seats offered, rating and completed trips update automatically after each drive.",
          },
        ],
      },
      {
        id: "driver-navigation",
        tab: "Navigate",
        image: APP_SCREENS.driverNavigation,
        points: [
          {
            x: 90,
            y: 14,
            fx: 49,
            fy: 15,
            title: "Turn-by-turn directions",
            body: "Built-in navigation guides you to each pickup and then to your destination, with the next turn always in view.",
          },
          {
            x: 70,
            y: 74,
            fx: 27,
            fy: 74,
            title: "Live seat count",
            body: "See at a glance how many of your offered seats are filled.",
          },
          {
            x: 62,
            y: 86,
            fx: 54,
            fy: 86,
            title: "Passenger status",
            body: "Each passenger shows as waiting or aboard, so you know exactly who you still need to collect.",
          },
          {
            x: 80,
            y: 93,
            fx: 48,
            fy: 94,
            title: "Trip progress",
            body: "The distance left, driving time and arrival time update continuously.",
            stats: [
              { label: "Distance left", value: "6.2 km" },
              { label: "Drive time", value: "15 min" },
              { label: "Arrival", value: "11:46 am" },
              { label: "Seats", value: "1 of 3" },
            ],
          },
        ],
      },
      {
        id: "driver-fare",
        tab: "Collect fare",
        image: APP_SCREENS.driverCollectFare,
        points: [
          {
            x: 82,
            y: 27,
            fx: 50,
            fy: 28,
            title: "The calculated fare",
            body: "At drop-off, the fare calculated by the formula is shown clearly, so there is nothing to negotiate.",
          },
          {
            x: 86,
            y: 50,
            fx: 34,
            fy: 50,
            title: "Pickup and drop-off confirmed",
            body: "The recorded pickup and drop-off points are shown alongside the fare.",
          },
          {
            x: 88,
            y: 69,
            fx: 50,
            fy: 69,
            title: "Slide to confirm payment",
            body: "Slide to confirm only after you have received payment. This closes the ride for that passenger.",
          },
        ],
      },
      {
        id: "driver-drives",
        tab: "My drives",
        image: APP_SCREENS.driverDrives,
        points: [
          {
            x: 90,
            y: 12,
            fx: 49,
            fy: 12,
            title: "Filter by status",
            body: "Switch between ongoing, completed and cancelled drives with a single tap.",
          },
          {
            x: 50,
            y: 22,
            fx: 49,
            fy: 20,
            title: "Every drive recorded",
            body: "Each drive lists its destination and the number of passengers carried.",
          },
        ],
      },
      {
        id: "driver-women-only",
        tab: "Women-only",
        image: APP_SCREENS.driverWomenOnly,
        points: [
          {
            x: 88,
            y: 27,
            fx: 41,
            fy: 28,
            title: "Women-only passengers",
            body: "Women drivers can choose to be matched only with women passengers. The setting applies when driving and does not change who picks them up as a passenger.",
          },
          {
            x: 86,
            y: 61,
            fx: 50,
            fy: 61,
            title: "Save your preference",
            body: "Once saved, only women passengers are offered to you. Expect fewer matches in return for the added assurance.",
          },
        ],
      },
      {
        id: "driver-sos",
        tab: "SOS",
        image: APP_SCREENS.driverSos,
        points: [
          {
            x: 88,
            y: 43,
            fx: 50,
            fy: 43,
            title: "SOS for drivers too",
            body: "Drivers have the same one-tap emergency alert as passengers, with a quick confirmation to prevent accidental alerts.",
          },
          {
            x: 86,
            y: 58,
            fx: 50,
            fy: 58,
            title: "Location shared immediately",
            body: "Your current location goes straight to your organisation's safety team.",
          },
        ],
      },
    ],
  },
};

/* Phone and lens geometry for large screens (the lens is hidden on small screens). */
const PHONE_W = 300;
const SCREEN_W = PHONE_W - 20;
const SCREEN_H = (SCREEN_W * 1600) / 717;
const AUTO_MS = 5000;
const LENS = 190;
const ZOOM = 1.9;

export function AppTour() {
  const [mode, setMode] = useState<Mode>("passenger");
  const [screenIndex, setScreenIndex] = useState(0);
  const [pointIndex, setPointIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const screens = TOUR[mode].screens;
  const screen = screens[screenIndex] ?? screens[0];
  const point = screen.points[pointIndex] ?? screen.points[0];

  function selectMode(next: Mode) {
    setMode(next);
    setScreenIndex(0);
    setPointIndex(0);
  }

  function selectScreen(i: number) {
    setScreenIndex(i);
    setPointIndex(0);
  }

  // Where the magnifying lens sits, and which part of the screen it shows.
  const px = (point.x / 100) * SCREEN_W;
  const py = (point.y / 100) * SCREEN_H;
  const lensTop = Math.min(Math.max(py + 10 - LENS / 2, 0), SCREEN_H + 20 - LENS);
  // The lens magnifies the feature itself, which can sit away from its numbered dot.
  const fx = ((point.fx ?? point.x) / 100) * SCREEN_W;
  const fy = ((point.fy ?? point.y) / 100) * SCREEN_H;
  const bgX = -(fx * ZOOM - LENS / 2);
  const bgY = -(fy * ZOOM - LENS / 2);
  const roles = Object.keys(TOUR) as Mode[];

  // Play the tour automatically once it is on screen.
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(Boolean(e?.isIntersecting)), {
      rootMargin: "-30% 0px -30% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Every few seconds: next point, then next screen, then the other role, and round again.
  useEffect(() => {
    if (!inView || paused || reduced) return;
    const t = window.setTimeout(() => {
      if (pointIndex + 1 < screen.points.length) {
        setPointIndex(pointIndex + 1);
      } else if (screenIndex + 1 < screens.length) {
        selectScreen(screenIndex + 1);
      } else {
        selectMode(mode === "passenger" ? "driver" : "passenger");
      }
    }, AUTO_MS);
    return () => window.clearTimeout(t);
  }, [
    inView,
    paused,
    reduced,
    pointIndex,
    screenIndex,
    mode,
    screen.points.length,
    screens.length,
  ]);

  const running = inView && !paused && !reduced;

  return (
    <section
      id="app"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-navy py-section text-on-dark"
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" && !paused) setPaused(true);
      }}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(55rem_38rem_at_78%_45%,rgba(234,88,12,0.26),transparent_60%),radial-gradient(40rem_30rem_at_10%_90%,rgba(249,115,22,0.16),transparent_60%)]"
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-dotgrid text-on-dark opacity-15" aria-hidden />

      <div className="mx-auto max-w-wide px-gutter">
        <div className="grid items-center gap-12 xl:grid-cols-[minmax(0,1fr)_auto] xl:gap-10">
          {/* Info, on the left */}
          <div>
            <Reveal>
              <p className="eyebrow text-accent-bright">Inside the app</p>
              <h2 className="mt-4 text-title">
                A guided tour of{" "}
                <span className="font-accent text-rose-gradient pr-1">RideShare</span>
              </h2>
              <p className="mt-4 max-w-copy text-lead text-on-dark/70">
                Select passenger or driver, then choose any highlighted point on the phone to see
                how each feature works.
              </p>
            </Reveal>

            {/* Role switch with a sliding highlight */}
            <div
              className="relative mt-8 inline-grid grid-cols-2 rounded-pill bg-white/5 p-1 ring-1 ring-white/10"
              role="tablist"
              aria-label="Role"
            >
              <span
                className={cn(
                  "absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-pill bg-rose-gradient shadow-[0_8px_24px_-8px_rgba(234,88,12,0.7)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  mode === "driver" && "translate-x-full",
                )}
                aria-hidden
              />
              {roles.map((m) => {
                const Icon = TOUR[m].icon;
                return (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => selectMode(m)}
                    className={cn(
                      "relative z-10 flex min-h-11 items-center justify-center gap-2 px-6 text-sm font-semibold transition-colors duration-300",
                      mode === m ? "text-on-dark" : "text-on-dark/60 hover:text-on-dark",
                    )}
                  >
                    <Icon className="size-4" />
                    {TOUR[m].label}
                  </button>
                );
              })}
            </div>

            {/* Filmstrip of the real screens */}
            {screens.length > 1 ? (
              <ol
                className="mt-6 flex gap-3 overflow-x-auto pb-2"
                aria-label={`${TOUR[mode].label} screens`}
              >
                {screens.map((s, i) => {
                  const on = i === screenIndex;
                  return (
                    <li key={s.id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => selectScreen(i)}
                        onPointerEnter={(e) => e.pointerType === "mouse" && !on && selectScreen(i)}
                        onFocus={() => !on && selectScreen(i)}
                        aria-current={on ? "step" : undefined}
                        className="group flex w-16 flex-col items-center gap-2"
                      >
                        <span
                          className={cn(
                            "block overflow-hidden rounded-xl ring-2 transition-[transform,box-shadow,opacity] duration-500",
                            on
                              ? "-translate-y-1 opacity-100 ring-accent-bright shadow-[0_12px_30px_-10px_rgba(251,146,60,0.7)]"
                              : "opacity-50 ring-white/10 group-hover:opacity-90",
                          )}
                        >
                          <img
                            src={s.image.src}
                            alt=""
                            width={64}
                            height={143}
                            loading="lazy"
                            className="block h-[6.5rem] w-16 object-cover object-top"
                          />
                        </span>
                        <span
                          className={cn(
                            "text-center text-[0.7rem] leading-tight font-semibold",
                            on ? "text-on-dark" : "text-on-dark/55",
                          )}
                        >
                          {s.tab}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            ) : null}

            {/* The active point, with a large outlined number */}
            <div
              key={`${mode}-${screen.id}-${pointIndex}`}
              className="relative mt-6 animate-page-in overflow-hidden rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10 md:p-8"
              aria-live="polite"
            >
              {/* Time until the tour moves on */}
              <span className="absolute inset-x-0 bottom-0 h-1 bg-white/5" aria-hidden>
                <span
                  className={cn(
                    "block h-full origin-left bg-rose-gradient",
                    running ? "animate-[tab-progress_linear_both]" : "scale-x-0",
                  )}
                  style={running ? { animationDuration: `${AUTO_MS}ms` } : undefined}
                />
              </span>
              <span
                className="tour-number pointer-events-none absolute -top-4 right-4 font-display text-[7rem] leading-none font-semibold tabular-nums select-none"
                aria-hidden
              >
                {String(pointIndex + 1).padStart(2, "0")}
              </span>
              <p className="relative text-xs font-semibold tracking-wider text-accent-bright uppercase">
                {TOUR[mode].label} · {screen.tab}
              </p>
              <h3 className="relative mt-3 max-w-md font-display text-2xl font-semibold tracking-tight md:text-3xl">
                {point.title}
              </h3>
              <p className="relative mt-3 max-w-lg leading-relaxed text-on-dark/70">{point.body}</p>
              {point.stats ? (
                <dl className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {point.stats.map((st) => (
                    <div
                      key={st.label}
                      className="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
                    >
                      <dt className="text-xs text-on-dark/55">{st.label}</dt>
                      <dd className="mt-1 font-semibold text-on-dark tabular-nums">{st.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {/* Points on this screen */}
              <div className="relative mt-6 flex flex-wrap items-center gap-2">
                {screen.points.map((p, i) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => setPointIndex(i)}
                    aria-pressed={i === pointIndex}
                    aria-label={`${i + 1}. ${p.title}`}
                    className={cn(
                      "grid size-9 place-items-center rounded-pill text-xs font-bold tabular-nums transition-[background-color,color,transform] duration-300",
                      i === pointIndex
                        ? "scale-110 bg-rose-gradient text-on-dark"
                        : "bg-white/8 text-on-dark/70 ring-1 ring-white/15 hover:bg-white/15",
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                <span className="ml-2 text-sm text-on-dark/50">
                  Point {pointIndex + 1} of {screen.points.length}
                </span>
              </div>
            </div>
          </div>

          {/* The phone, with its magnifying lens */}
          <Reveal delay={60}>
            <div className="relative mx-auto w-[260px] md:w-[300px]">
              {/* Lens and its connector (large screens only) */}
              <div
                className="pointer-events-none absolute right-[calc(100%+2.5rem)] z-20 hidden transition-[top] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] xl:block"
                style={{ top: lensTop, width: LENS, height: LENS }}
                aria-hidden
              >
                <div
                  key={screen.image.src}
                  className="size-full rounded-pill bg-no-repeat shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] ring-4 ring-white/90 transition-[background-position] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    backgroundImage: `url(${screen.image.src})`,
                    backgroundSize: `${SCREEN_W * ZOOM}px auto`,
                    backgroundPosition: `${bgX}px ${bgY}px`,
                  }}
                />
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-pill bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-semibold tracking-wider whitespace-nowrap text-on-dark/80 uppercase backdrop-blur">
                  {ZOOM}× zoom
                </span>
              </div>
              <div
                className="pointer-events-none absolute z-10 hidden border-t-2 border-dashed border-white/40 transition-[top,width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] xl:block"
                style={{ top: lensTop + LENS / 2, right: "100%", width: 40 }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute z-10 hidden border-t-2 border-dashed border-white/40 transition-[top,width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] xl:block"
                style={{ top: py + 10, left: 0, width: px + 10 }}
                aria-hidden
              />

              <div
                className="absolute top-1/2 left-1/2 -z-10 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-pill bg-[#ea580c]/25 blur-3xl"
                aria-hidden
              />
              <div className="rounded-[2.6rem] bg-ink p-2.5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/15">
                <div className="relative overflow-hidden rounded-[2.1rem]">
                  <img
                    key={screen.image.src}
                    src={screen.image.src}
                    alt={screen.image.alt}
                    width={717}
                    height={1600}
                    className="block aspect-[717/1600] w-full animate-page-in object-cover object-top"
                  />
                  {screen.points.map((p, i) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() => setPointIndex(i)}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setPointIndex(i)}
                      aria-label={`${i + 1}. ${p.title}`}
                      aria-pressed={i === pointIndex}
                      className={cn(
                        "absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-pill text-xs font-bold tabular-nums shadow-card transition-transform duration-300 after:absolute after:-inset-1.5",
                        i === pointIndex
                          ? "scale-110 bg-ink text-on-dark ring-4 ring-accent-bright/70"
                          : "animate-pulse-rose bg-rose-gradient text-on-dark hover:scale-110",
                      )}
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-4 flex items-center justify-center gap-2 text-sm text-on-dark/55">
                <Hand className="size-4" />
                Point at a number to explore
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
