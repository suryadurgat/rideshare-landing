import { useEffect, useRef, useState } from "react";
import { History, Route, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { JourneyWidgets } from "./JourneyWidgets";
import { APP_SCREENS } from "./PhoneFrame";
import { Reveal } from "./Reveal";

const ROTATE_MS = 4000;

const SCREENS = [
  {
    icon: Search,
    title: "Search your destination",
    body: "Find where you are going in seconds, with suggestions as you type.",
    screen: APP_SCREENS.passengerHome,
  },
  {
    icon: Route,
    title: "Choose your route",
    body: "Compare routes on a live map, with travel time and arrival for each.",
    screen: APP_SCREENS.pickRoute,
  },
  {
    icon: History,
    title: "Review every ride",
    body: "Keep a complete record of your journeys, ready whenever you need it.",
    screen: APP_SCREENS.myRides,
  },
];

/** Position of each phone relative to the active one: centre stage, or fanned out behind. */
function placement(offset: number) {
  if (offset === 0) return "z-30 [transform:translateX(0)_scale(1)_rotateY(0deg)] opacity-100";
  if (offset < 0)
    return "z-20 cursor-pointer [transform:translateX(-66%)_scale(0.8)_rotateY(22deg)] opacity-60 hover:opacity-90 sm:[transform:translateX(-58%)_scale(0.8)_rotateY(22deg)]";
  return "z-20 cursor-pointer [transform:translateX(66%)_scale(0.8)_rotateY(-22deg)] opacity-60 hover:opacity-90 sm:[transform:translateX(58%)_scale(0.8)_rotateY(-22deg)]";
}

export function ProductStrip() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(Boolean(e?.isIntersecting)), {
      rootMargin: "-30% 0px -30% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused || reduced) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % SCREENS.length), ROTATE_MS);
    return () => window.clearTimeout(t);
  }, [active, inView, paused, reduced]);

  const current = SCREENS[active];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-cream py-section"
      aria-label="The RideShare app"
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" && !paused) setPaused(true);
      }}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-wide px-gutter">
        <Reveal>
          <p className="eyebrow w-full justify-center text-primary">The app</p>
          <h2 className="mt-4 text-center text-title">
            Every journey, from first search to final <span className="font-accent">record</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-copy text-center text-lead text-ink-soft">
            Find your destination, choose your route on a live map and keep a complete record of
            every ride. Every screen shown here is from the RideShare app.
          </p>
        </Reveal>
      </div>

      {/* The phone carousel */}
      <div className="relative mt-14">
        <JourneyWidgets active={active} />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-pill bg-brand-gradient opacity-20 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto h-[490px] max-w-3xl [perspective:1600px] sm:h-[570px] md:h-[610px]">
          {SCREENS.map((s, i) => {
            let offset = i - active;
            if (offset > 1) offset -= SCREENS.length;
            if (offset < -1) offset += SCREENS.length;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show: ${s.title}`}
                aria-current={offset === 0 ? "true" : undefined}
                className={cn(
                  "absolute top-0 left-1/2 -ml-[105px] w-[210px] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] sm:-ml-[125px] sm:w-[250px] md:-ml-[135px] md:w-[270px]",
                  placement(offset),
                )}
              >
                <div
                  className={cn(
                    "rounded-[2.4rem] bg-ink p-2.5 ring-1 ring-black/5 transition-shadow duration-700",
                    offset === 0
                      ? "shadow-[0_40px_90px_-20px_rgba(23,18,15,0.55)]"
                      : "shadow-phone",
                  )}
                >
                  <img
                    src={s.screen.src}
                    alt={offset === 0 ? s.screen.alt : ""}
                    width={717}
                    height={1600}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-[717/1600] w-full rounded-[1.9rem] object-cover object-top"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* The journey: three stages, with the caption for the active screen */}
      <div className="relative mx-auto mt-10 max-w-4xl px-gutter">
        <ol className="flex items-center justify-center gap-2 sm:gap-3">
          {SCREENS.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.title} className="flex items-center gap-2 sm:gap-3">
                {i > 0 ? (
                  <span
                    className={cn(
                      "h-0.5 w-6 rounded-pill transition-colors duration-700 sm:w-12",
                      i <= active ? "bg-primary" : "bg-line",
                    )}
                    aria-hidden
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  aria-current={on ? "step" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-2 rounded-pill px-3 text-sm font-semibold transition-[background-color,color,box-shadow] duration-500 sm:px-4",
                    on
                      ? "bg-ink text-on-dark shadow-card"
                      : "bg-paper text-ink-soft ring-1 ring-line hover:text-ink",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6 place-items-center rounded-pill text-xs tabular-nums",
                      on ? "bg-brand-gradient text-on-dark" : "bg-paper-2 text-ink",
                    )}
                  >
                    {i + 1}
                  </span>
                  <s.icon className="hidden size-4 sm:block" />
                  <span className="hidden whitespace-nowrap lg:inline">{s.title}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div key={active} className="mt-6 animate-page-in text-center" aria-live="polite">
          <h3 className="font-display text-2xl font-semibold tracking-tight">{current.title}</h3>
          <p className="mx-auto mt-2 max-w-md text-ink-soft">{current.body}</p>
        </div>
      </div>
    </section>
  );
}
