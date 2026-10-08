import { useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, History, MapPin, Route, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Decoration for the app carousel's side space: a live-journey feed on the left and a
 * mini map on the right, both following the carousel's active stage (0 search, 1 route,
 * 2 record), over faint street lines. They drift slightly with scroll for depth. Only
 * rendered where there is room beside the phones.
 */
export function JourneyWidgets({ active }: { active: number }) {
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);

  // Eased scroll parallax: the two sides drift in opposite directions.
  useEffect(() => {
    const a = left.current;
    const b = right.current;
    const section = a?.closest("section");
    if (!a || !b || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let current = 0;
    let frame = 0;
    const goal = () => {
      const r = section.getBoundingClientRect();
      const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      return Math.min(1, Math.max(0, p)) - 0.5;
    };
    const tick = () => {
      frame = 0;
      const g = goal();
      current += (g - current) * 0.1;
      if (Math.abs(g - current) < 0.0005) current = g;
      a.style.transform = `translate3d(0, ${current * -70}px, 0)`;
      b.style.transform = `translate3d(0, ${current * 70}px, 0)`;
      if (current !== g) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    current = goal();
    tick();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden>
      <StreetLines />
      <div
        ref={left}
        className="absolute top-1/2 right-[calc(50%+19rem)] w-60 will-change-transform"
      >
        <div className="-translate-y-1/2">
          <JourneyFeed active={active} />
        </div>
      </div>
      <div
        ref={right}
        className="absolute top-1/2 left-[calc(50%+19rem)] w-60 will-change-transform"
      >
        <div className="-translate-y-1/2 space-y-4">
          <LiveMap active={active} />
          <ColleaguesChip />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------- */

const DESTINATION = "Mindspace, Raidurg";

function JourneyFeed({ active }: { active: number }) {
  const typed = useTyping(DESTINATION, active === 0);
  const list = useRef<HTMLOListElement>(null);
  const [line, setLine] = useState<{ stops: number[] } | null>(null);

  // Centre of each dot within the list, so the line runs exactly dot to dot.
  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const measure = () => {
      const top = ol.getBoundingClientRect().top;
      const stops = [...ol.querySelectorAll<HTMLElement>("[data-node]")].map((n) => {
        const r = n.getBoundingClientRect();
        return r.top - top + r.height / 2;
      });
      setLine({ stops });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ol);
    return () => ro.disconnect();
  }, []);

  const items: { icon: typeof Search; label: string; title: ReactNode; meta: string }[] = [
    {
      icon: Search,
      label: "Search",
      title: (
        <>
          {typed}
          {active === 0 && typed.length < DESTINATION.length ? (
            <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-ember" />
          ) : null}
        </>
      ),
      meta: "Destination set · 3 colleagues nearby",
    },
    {
      icon: Route,
      label: "Route",
      title: "12.4 km via ORR",
      meta: "28 min · pickup at Kondapur 9:14",
    },
    {
      icon: History,
      label: "Record",
      title: "Ride saved · ₹70",
      meta: "With Priya S. · 38 min · rated 5.0",
    },
  ];

  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.18em] text-ember uppercase">
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-pill bg-ember/50" />
          <span className="relative size-2 rounded-pill bg-ember" />
        </span>
        Live journey
      </p>
      <ol ref={list} className="relative space-y-3 pl-6">
        {/* The timeline, drawn between the first and last dots and filled to the active one. */}
        {line ? (
          <>
            <span
              className="absolute left-[7px] w-0.5 rounded-pill bg-line"
              style={{ top: line.stops[0], height: line.stops[2]! - line.stops[0]! }}
            />
            <span
              className="absolute left-[7px] w-0.5 rounded-pill bg-brand-gradient transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ top: line.stops[0], height: line.stops[active]! - line.stops[0]! }}
            />
          </>
        ) : null}
        {items.map((it, i) => {
          const on = i === active;
          const done = i < active;
          return (
            <li key={it.label} className="relative">
              <span
                data-node
                className={cn(
                  "absolute top-1/2 -left-6 grid size-4 -translate-y-1/2 place-items-center rounded-pill ring-4 ring-cream transition-colors duration-500",
                  on || done ? "bg-ember" : "bg-line",
                )}
              >
                {done ? <span className="size-1.5 rounded-pill bg-paper" /> : null}
              </span>
              <div
                className={cn(
                  "rounded-2xl p-3.5 transition-[opacity,transform,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  on
                    ? "translate-x-1 bg-paper opacity-100 shadow-card ring-1 ring-ember/25"
                    : "bg-paper/60 opacity-55 ring-1 ring-line",
                )}
              >
                <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-wider text-muted uppercase">
                  <it.icon className={cn("size-3.5", on ? "text-ember" : "text-muted")} />
                  {it.label}
                </p>
                <p className="mt-1 min-h-5 text-sm font-semibold text-ink">{it.title}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{it.meta}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Types `text` out while `run` is true; shows it whole otherwise or with reduced motion. */
function useTyping(text: string, run: boolean) {
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (!run || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      return;
    }
    setN(0);
    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) window.clearInterval(t);
    }, 75);
    return () => window.clearInterval(t);
  }, [text, run]);
  return text.slice(0, n);
}

/* -------------------------------------------------------------------------------------- */

const ROUTE = "M34 148 C 70 146, 78 112, 108 104 S 150 92, 162 66 S 190 34, 210 30";

function LiveMap({ active }: { active: number }) {
  const drawn = active >= 1;
  const [reduced, setReduced] = useState(true);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return (
    <div className="overflow-hidden rounded-3xl bg-[#1b1714] p-2 shadow-phone ring-1 ring-black/10">
      <div className="relative">
        <svg viewBox="0 0 240 176" className="block w-full rounded-2xl bg-[#231d19]">
          {/* Streets */}
          <g stroke="#3a312b" strokeLinecap="round" fill="none">
            <path d="M-10 40 L250 20" strokeWidth="6" />
            <path d="M-10 118 C 60 100, 140 130, 250 96" strokeWidth="7" />
            <path d="M60 -10 L 90 190" strokeWidth="5" />
            <path d="M170 -10 C 150 60, 190 120, 160 190" strokeWidth="6" />
            <path d="M-10 164 L 250 150" strokeWidth="4" />
            <path d="M120 -10 L 128 190" strokeWidth="3" />
            <path d="M-10 80 L 250 64" strokeWidth="3" />
          </g>
          <circle cx="196" cy="140" r="22" fill="#2b3a2a" opacity="0.7" />
          <circle cx="30" cy="30" r="16" fill="#1f2e3a" opacity="0.8" />

          {/* Route: faint preview, then drawn in when a route is chosen */}
          <path
            d={ROUTE}
            fill="none"
            stroke="#fb923c"
            strokeOpacity="0.2"
            strokeWidth="4"
            strokeDasharray="2 6"
            strokeLinecap="round"
          />
          <path
            d={ROUTE}
            fill="none"
            stroke="url(#journey-route)"
            strokeWidth="4"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            style={{
              strokeDashoffset: drawn ? 0 : 1,
              transition: "stroke-dashoffset 1.4s cubic-bezier(0.65,0,0.35,1)",
            }}
          />
          <defs>
            <linearGradient id="journey-route" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>

          {/* Start */}
          <circle cx="34" cy="148" r="6" fill="#fff" />
          <circle cx="34" cy="148" r="3" fill="#1b1714" />

          {/* The car driving the route on the second stage */}
          {active === 1 && !reduced ? (
            <g>
              <circle r="9" fill="#fff" opacity="0.18" />
              <circle r="6" fill="#fff" />
              <circle r="3.2" fill="#ea580c" />
              <animateMotion
                dur="3.6s"
                begin="0.9s"
                fill="freeze"
                repeatCount="indefinite"
                path={ROUTE}
                keyPoints="0;0;1;1"
                keyTimes="0;0.08;0.88;1"
                calcMode="spline"
                keySplines="0 0 1 1;0.45 0 0.25 1;0 0 1 1"
              />
            </g>
          ) : null}
        </svg>

        {/* Destination pin, with a search pulse on the first stage */}
        <span
          className="absolute"
          style={{ left: `${(210 / 240) * 100}%`, top: `${(30 / 176) * 100}%` }}
        >
          {active === 0 ? (
            <span className="absolute size-10 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-pill bg-ember/40" />
          ) : null}
          <MapPin className="absolute size-6 -translate-x-1/2 -translate-y-full fill-ember text-[#1b1714]" />
        </span>

        {/* Status chip */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-pill bg-black/55 px-2.5 py-1 text-[0.7rem] font-semibold text-on-dark backdrop-blur-md">
          {active === 0 ? (
            <>
              <Search className="size-3 text-honey" /> Finding colleagues…
            </>
          ) : active === 1 ? (
            <>
              <span className="size-1.5 animate-pulse rounded-pill bg-good-bright" /> On route · ETA
              9:42
            </>
          ) : (
            <>
              <CheckCircle2 className="size-3 text-good-bright" /> Arrived · ₹70
            </>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between px-2 pt-2.5 pb-1 text-[0.7rem] text-on-dark/60">
        <span>Kondapur</span>
        <span className="h-px flex-1 mx-2 bg-white/15" />
        <span>Raidurg</span>
      </div>
    </div>
  );
}

function ColleaguesChip() {
  return (
    <div className="ml-6 flex w-fit animate-float items-center gap-3 rounded-2xl bg-paper px-3.5 py-2.5 shadow-card ring-1 ring-line">
      <div className="flex -space-x-1.5">
        {[
          ["PS", "#c2410c"],
          ["AR", "#0c2a78"],
          ["KM", "#08a06b"],
        ].map(([t, c]) => (
          <span
            key={t}
            className="grid size-7 place-items-center rounded-pill text-[0.6rem] font-bold text-white ring-2 ring-paper"
            style={{ background: c }}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="leading-tight">
        <p className="text-xs font-semibold text-ink">3 colleagues</p>
        <p className="text-[0.7rem] text-muted">on your route today</p>
      </div>
    </div>
  );
}

/** Faint street lines in both side margins, fading toward the centre. */
function StreetLines() {
  const roads = (
    <g fill="none" stroke="#c2410c" strokeLinecap="round">
      <path d="M-20 120 C 120 90, 180 200, 420 150" strokeOpacity="0.1" strokeWidth="10" />
      <path d="M-20 420 C 140 380, 220 520, 420 470" strokeOpacity="0.08" strokeWidth="14" />
      <path d="M90 -20 C 70 200, 160 400, 110 720" strokeOpacity="0.08" strokeWidth="8" />
      <path d="M260 -20 C 300 220, 220 420, 300 720" strokeOpacity="0.06" strokeWidth="6" />
      <path d="M-20 600 L 420 560" strokeOpacity="0.07" strokeWidth="6" />
      <path d="M-20 260 L 420 300" strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="4 8" />
      <path d="M180 -20 L 200 720" strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="4 8" />
    </g>
  );
  return (
    <div className="absolute inset-0 [mask-image:linear-gradient(transparent,black_18%,black_82%,transparent)]">
      <svg
        viewBox="0 0 400 700"
        preserveAspectRatio="xMinYMid slice"
        className="absolute inset-y-0 left-0 h-full w-[34%] [mask-image:linear-gradient(90deg,black_30%,transparent)]"
      >
        {roads}
      </svg>
      <svg
        viewBox="0 0 400 700"
        preserveAspectRatio="xMinYMid slice"
        className="absolute inset-y-0 right-0 h-full w-[34%] -scale-x-100 [mask-image:linear-gradient(90deg,black_30%,transparent)]"
      >
        {roads}
      </svg>
    </div>
  );
}
