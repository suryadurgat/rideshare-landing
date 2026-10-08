import { useEffect, useRef, useState } from "react";
import { Car, Clock, Route, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

const STEP_MS = 3600;

/** The published weights. */
const WEIGHTS = [
  { key: "wait", label: "Waiting time", value: 50, color: "#d97706", note: "How long the passenger has been waiting" },
  { key: "detour", label: "Detour distance", value: 35, color: "#ea580c", note: "How little the driver has to go out of their way" },
  { key: "rating", label: "Passenger rating", value: 15, color: "#a8a29e", note: "Their rating from previous rides" },
] as const;

type Passenger = { id: string; wait: number; detour: number; rating: number; status?: "new" | "matched" };

/**
 * A simplified illustration of the published weights. Each factor is scaled to 0–1
 * (waiting time up to 15 minutes, detour up to 5 km, rating out of 5) before weighting.
 */
function score(p: Passenger) {
  const wait = Math.min(p.wait / 15, 1) * 0.5;
  const detour = Math.max(1 - p.detour / 5, 0) * 0.35;
  const rating = (p.rating / 5) * 0.15;
  return { wait, detour, rating, total: wait + detour + rating };
}

const STORY: { caption: string; passengers: Passenger[] }[] = [
  {
    caption:
      "Three colleagues are waiting. Each is scored on waiting time, detour and rating, and the highest score gets the seat.",
    passengers: [
      { id: "A", wait: 9, detour: 2.4, rating: 4.6 },
      { id: "B", wait: 3, detour: 0.6, rating: 4.9 },
      { id: "C", wait: 6, detour: 1.5, rating: 4.2 },
    ],
  },
  {
    caption:
      "A more convenient passenger joins, with a shorter detour and a perfect rating. Passenger A has waited longest, so A keeps the lead.",
    passengers: [
      { id: "A", wait: 10, detour: 2.4, rating: 4.6 },
      { id: "B", wait: 4, detour: 0.6, rating: 4.9 },
      { id: "C", wait: 7, detour: 1.5, rating: 4.2 },
      { id: "D", wait: 0, detour: 0.3, rating: 5, status: "new" },
    ],
  },
  {
    caption:
      "Passenger A is matched. Everyone else keeps the time they have already waited, so nobody starts again from zero.",
    passengers: [
      { id: "A", wait: 10, detour: 2.4, rating: 4.6, status: "matched" },
      { id: "B", wait: 5, detour: 0.6, rating: 4.9 },
      { id: "C", wait: 8, detour: 1.5, rating: 4.2 },
      { id: "D", wait: 1, detour: 0.3, rating: 5 },
    ],
  },
];

const ROW_H = 76;

export function FairSeat() {
  const [step, setStep] = useState(0);
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
    const t = window.setTimeout(() => setStep((s) => (s + 1) % STORY.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [step, inView, paused, reduced]);

  const scene = STORY[step];
  // Waiting passengers ranked by score; a matched passenger stays on top, marked as matched.
  const ranked = [...scene.passengers].sort((a, b) => {
    if (a.status === "matched") return -1;
    if (b.status === "matched") return 1;
    return score(b).total - score(a).total;
  });
  const leader = ranked[0];
  const all = ["A", "B", "C", "D"];

  return (
    <section
      id="fair-seat"
      ref={ref}
      className="relative overflow-hidden bg-cream py-section"
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" && !paused) setPaused(true);
      }}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="absolute -top-40 -right-40 size-[36rem] rounded-pill bg-[#fcd34d]/25 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-wide items-center gap-12 px-gutter lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        {/* The rule */}
        <Reveal>
          <p className="eyebrow text-accent">Fair matching</p>
          <h2 className="mt-4 text-title">
            Who gets the <span className="font-accent text-accent">seat</span>?
          </h2>
          <p className="mt-4 text-lead text-ink-soft">
            Most platforms keep their matching rules secret. RideShare publishes its rule in full.
          </p>

          <div className="mt-8">
            <div className="flex h-4 overflow-hidden rounded-pill ring-1 ring-black/5">
              {WEIGHTS.map((w) => (
                <span key={w.key} style={{ width: `${w.value}%`, background: w.color }} />
              ))}
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-3">
              {WEIGHTS.map((w) => (
                <div key={w.key}>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="size-3 rounded-pill" style={{ background: w.color }} />
                    {w.label}
                  </dt>
                  <dd className="mt-1 font-display text-4xl font-semibold tracking-tight tabular-nums">
                    {w.value}%
                  </dd>
                  <dd className="mt-1 text-xs leading-snug text-muted">{w.note}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-8 border-l-2 border-[#d97706] pl-4 leading-relaxed text-ink-soft">
            Waiting time carries the most weight by design, so a steady stream of more convenient
            passengers can never leave someone behind. A request that expires unmatched keeps its
            waiting time for the next attempt.
          </p>
        </Reveal>

        {/* The live example */}
        <Reveal delay={100}>
          <div className="rounded-[2rem] bg-[#1c1917] p-5 text-on-dark shadow-[0_40px_90px_-30px_rgba(28,25,23,0.7)] md:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#d97706]">
                  <Car className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">Driver leaving Gachibowli</p>
                  <p className="text-xs text-on-dark/60">1 seat free · colleagues waiting on the route</p>
                </div>
              </div>
              <span className="rounded-pill bg-white/10 px-3 py-1 text-[0.7rem] font-semibold tracking-wider text-on-dark/70 uppercase">
                Illustrative example
              </span>
            </div>

            {/* Ranked queue; rows glide to their new positions */}
            <div className="relative mt-5" style={{ height: ROW_H * 4 }}>
              {all.map((id) => {
                const p = scene.passengers.find((x) => x.id === id);
                const rank = ranked.findIndex((x) => x.id === id);
                const s = p ? score(p) : null;
                const matched = p?.status === "matched";
                const isLeader = p && leader.id === id;
                return (
                  <div
                    key={id}
                    className={cn(
                      "absolute inset-x-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      p ? "opacity-100" : "pointer-events-none opacity-0",
                    )}
                    style={{ transform: `translateY(${(p ? rank : 3) * ROW_H}px)`, height: ROW_H - 8 }}
                  >
                    <div
                      className={cn(
                        "flex h-full items-center gap-3 rounded-2xl px-3 ring-1 transition-colors duration-700 md:gap-4 md:px-4",
                        matched
                          ? "bg-[#d97706]/20 ring-[#d97706]"
                          : isLeader
                            ? "bg-white/10 ring-[#fcd34d]/60"
                            : "bg-white/[0.04] ring-white/10",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-pill font-display font-semibold",
                          matched || isLeader ? "bg-[#fcd34d] text-[#1c1917]" : "bg-white/10",
                        )}
                      >
                        {id}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-on-dark/70 tabular-nums">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            {p ? `${p.wait} min` : "–"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Route className="size-3.5" />
                            {p ? `${p.detour} km` : "–"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="size-3.5" />
                            {p ? p.rating.toFixed(1) : "–"}
                          </span>
                          {p?.status === "new" ? (
                            <span className="rounded-pill bg-white/15 px-2 py-0.5 text-[0.65rem] font-semibold text-on-dark">
                              Just joined
                            </span>
                          ) : null}
                        </div>
                        {/* Score, split into the three weighted factors */}
                        <div className="mt-2 flex h-2.5 overflow-hidden rounded-pill bg-white/10">
                          {s
                            ? [s.wait, s.detour, s.rating].map((v, k) => (
                                <span
                                  key={k}
                                  className="transition-[width] duration-700 ease-out"
                                  style={{ width: `${v * 100}%`, background: WEIGHTS[k].color }}
                                />
                              ))
                            : null}
                        </div>
                      </div>
                      <div className="w-20 shrink-0 text-right">
                        {matched ? (
                          <span className="rounded-pill bg-[#d97706] px-2.5 py-1 text-[0.7rem] font-bold whitespace-nowrap">
                            Matched
                          </span>
                        ) : isLeader ? (
                          <span className="rounded-pill bg-[#fcd34d] px-2.5 py-1 text-[0.7rem] font-bold whitespace-nowrap text-[#1c1917]">
                            Gets the seat
                          </span>
                        ) : (
                          <span className="font-display text-lg font-semibold tabular-nums">
                            {s ? Math.round(s.total * 100) : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Caption and story controls */}
            <div className="mt-2 flex items-start gap-4 border-t border-white/10 pt-5">
              <div className="flex shrink-0 gap-1.5 pt-1.5" role="tablist" aria-label="Example steps">
                {STORY.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === step}
                    aria-label={`Step ${i + 1}`}
                    onClick={() => setStep(i)}
                    className={cn(
                      "relative h-2.5 rounded-pill transition-[width,background-color] duration-500 after:absolute after:-inset-x-1 after:-inset-y-4",
                      i === step ? "w-7 bg-[#fcd34d]" : "w-2.5 bg-white/25 hover:bg-white/50",
                    )}
                  />
                ))}
              </div>
              <p key={step} className="min-h-[3.75rem] animate-page-in text-sm leading-relaxed text-on-dark/80" aria-live="polite">
                {scene.caption}
              </p>
            </div>
            <p className="mt-3 text-[0.7rem] leading-relaxed text-on-dark/45">
              Simplified illustration of the published weights: each factor is scaled from 0 to 1
              before weighting (waiting up to 15 minutes, detour up to 5 km, rating out of 5).
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
