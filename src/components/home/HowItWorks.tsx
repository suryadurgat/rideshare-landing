import { useEffect, useRef, useState, type ReactNode } from "react";
import { BadgeCheck, KeyRound, MapPinned, Route, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { computeFare, formatInr, SAMPLE_TRIP } from "@/lib/fare";
import { APP_SCREENS } from "./PhoneFrame";
import { Reveal } from "./Reveal";

const STEP_MS = 4500;

// A background mood for each step: deep teal, deep indigo, warm ember. Each has a soft glow.
const MOODS = [
  "radial-gradient(40rem 30rem at 72% 45%, rgba(253, 186, 116, 0.22), transparent 65%), linear-gradient(135deg, #17120f 0%, #2a1d16 100%)",
  "radial-gradient(40rem 30rem at 72% 45%, rgba(251, 146, 60, 0.26), transparent 65%), linear-gradient(135deg, #1c1410 0%, #3a2216 100%)",
  "radial-gradient(40rem 30rem at 72% 45%, rgba(234, 88, 12, 0.3), transparent 65%), linear-gradient(135deg, #21130c 0%, #4a2412 100%)",
];

// Where each step sits around the phone on large screens: a zigzag that follows the journey.
const POSITIONS = [
  "lg:col-start-1 lg:row-start-1 lg:self-end",
  "lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:self-center",
  "lg:col-start-1 lg:row-start-2 lg:self-start",
];

const STEPS: {
  icon: typeof KeyRound;
  title: string;
  body: string;
  screen: { src: string; alt: string };
  tag: ReactNode;
}[] = [
  {
    icon: KeyRound,
    title: "Sign in with your work email",
    body: "Your organisation and campus are linked to your account automatically, so every member you meet is a verified employee.",
    screen: APP_SCREENS.passengerHome,
    tag: (
      <>
        <BadgeCheck className="size-4 text-good-bright" />
        Verified work account
      </>
    ),
  },
  {
    icon: MapPinned,
    title: "Tell us where you are going",
    body: "Choose your pickup point, destination and how long you can wait. Driving instead? Offer your spare seats in a single tap.",
    screen: APP_SCREENS.pickRoute,
    tag: (
      <>
        <Route className="size-4 text-sky" />
        Fastest route · 14 min
      </>
    ),
  },
  {
    icon: Wallet,
    title: "Travel together, then pay",
    body: "Follow the live route and arrival time, then pay the calculated fare directly to your driver. No wallet and no intermediary.",
    screen: APP_SCREENS.driverNavigation,
    tag: (
      <>
        <Wallet className="size-4 text-honey" />
        {formatInr(computeFare(SAMPLE_TRIP.km))} · {SAMPLE_TRIP.pickup.place} → {SAMPLE_TRIP.drop.place}
      </>
    ),
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Start the loop only while the section is on screen.
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    // "In view" once the section crosses the middle of the screen, whatever its height.
    const io = new IntersectionObserver(([e]) => setInView(Boolean(e?.isIntersecting)), {
      rootMargin: "-35% 0px -35% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Advance one step at a time, then start again.
  useEffect(() => {
    if (!inView || paused || reduced) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % STEPS.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [active, inView, paused, reduced]);

  const running = inView && !paused && !reduced;

  return (
    <section
      id="how"
      ref={ref}
      className="relative isolate overflow-hidden bg-charcoal py-section text-on-dark"
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" && !paused) setPaused(true);
      }}
      onMouseLeave={() => setPaused(false)}
    >
      {/* One background per step; they cross-fade as the story moves on */}
      {MOODS.map((m, i) => (
        <div
          key={i}
          className="how-mood absolute inset-0 -z-10"
          style={{ background: m, opacity: i === active ? 1 : 0 }}
          aria-hidden
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-dotgrid text-on-dark opacity-20" aria-hidden />

      <div className="relative mx-auto max-w-wide px-gutter">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-sky">How it works</p>
            <h2 className="mt-4 text-title">
              From sign-in to drop-off, in three simple <span className="font-accent">steps</span>.
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-2 lg:gap-x-12 lg:gap-y-6">
          {/* The steps */}
          <ol className="order-2 space-y-3 lg:contents">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.title} className={POSITIONS[i]}>
                  <button
                    type="button"
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-current={on ? "step" : undefined}
                    className={cn(
                      "group relative w-full overflow-hidden rounded-3xl p-5 text-left ring-1 transition-[background-color,box-shadow,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-6",
                      on
                        ? "bg-white/12 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] ring-white/25"
                        : "bg-white/[0.03] ring-white/10 hover:bg-white/[0.06]",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={cn(
                          "grid size-12 shrink-0 place-items-center rounded-2xl transition-colors duration-700",
                          on ? "bg-brand-gradient text-on-dark" : "bg-white/8 text-on-dark/60",
                        )}
                      >
                        <s.icon className="size-5" strokeWidth={1.9} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold tracking-wider text-on-dark/50 uppercase tabular-nums">
                          Step {i + 1}
                        </p>
                        <h3
                          className={cn(
                            "mt-1 text-lg font-semibold tracking-tight transition-colors duration-700 md:text-xl",
                            on ? "text-on-dark" : "text-on-dark/70",
                          )}
                        >
                          {s.title}
                        </h3>
                        {/* Always laid out, so hovering never shifts the cards; only the emphasis changes */}
                        <p
                          className={cn(
                            "pt-2 text-sm leading-relaxed transition-colors duration-700",
                            on ? "text-on-dark-muted" : "text-on-dark/40",
                          )}
                        >
                          {s.body}
                        </p>
                      </div>
                    </div>

                    {/* Progress for the active step */}
                    <span className="absolute inset-x-5 bottom-0 h-0.5 overflow-hidden rounded-pill bg-white/10 md:inset-x-6">
                      {on ? (
                        <span
                          key={`${active}-${running}`}
                          className={cn(
                            "block h-full origin-left bg-brand-gradient",
                            running ? "animate-[tab-progress_linear_both]" : "scale-x-100 opacity-40",
                          )}
                          style={running ? { animationDuration: `${STEP_MS}ms` } : undefined}
                        />
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* The phone, changing with each step */}
          <div className="order-1 self-center lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="relative mx-auto w-[240px] md:w-[270px]">
              <div className="rounded-[2.4rem] bg-ink p-2.5 shadow-phone ring-1 ring-white/10">
                <div className="relative aspect-[717/1600] overflow-hidden rounded-[1.9rem]">
                  {STEPS.map((s, i) => (
                    <img
                      key={s.title}
                      src={s.screen.src}
                      alt={i === active ? s.screen.alt : ""}
                      aria-hidden={i !== active}
                      loading="lazy"
                      decoding="async"
                      className={cn(
                        "absolute inset-0 size-full object-cover object-top transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]",
                        i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                      )}
                    />
                  ))}
                </div>
              </div>
              <div
                key={active}
                className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 animate-page-in items-center gap-2 rounded-pill bg-navy-2 px-4 py-2 text-sm font-semibold whitespace-nowrap text-on-dark shadow-card ring-1 ring-white/15"
              >
                {STEPS[active].tag}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
