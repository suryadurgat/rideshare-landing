import { useEffect, useRef, useState } from "react";
import { BarChart3, Building2, Check, LayoutDashboard, Siren } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

const AUTO_MS = 7000;

type Dashboard = {
  id: string;
  tab: string;
  role: string;
  icon: typeof LayoutDashboard;
  image: { src: string; alt: string };
  summary: string;
  body: string;
  stats: { label: string; value: string; note?: string }[];
  features: string[];
};

const DASHBOARDS: Dashboard[] = [
  {
    id: "super-admin",
    tab: "Platform overview",
    role: "Super administrator",
    icon: LayoutDashboard,
    image: {
      src: "/images/dashboards/super-admin.jpg",
      alt: "RideShare super administrator dashboard showing organisations, campuses, employees, total rides, carpool utilisation and a platform overview chart.",
    },
    summary: "The whole platform at a glance.",
    body: "Monitor every organisation, campus and employee from one place, and run auto-matching to pair the day's drivers with passengers.",
    stats: [
      { label: "Organisations", value: "3" },
      { label: "Campuses", value: "3" },
      { label: "Employees", value: "31", note: "28 active" },
      { label: "Carpool utilisation", value: "155%", note: "across 48 rides" },
    ],
    features: [
      "Scheduled auto-matching in a single action",
      "Trips made against passengers carried, over 7, 30 or 90 days",
      "Management of organisations, campuses, users, rides and vehicles",
    ],
  },
  {
    id: "analytics",
    tab: "Matching analytics",
    role: "Super administrator",
    icon: BarChart3,
    image: {
      src: "/images/dashboards/analytics.jpg",
      alt: "RideShare analytics dashboard showing participation, seat occupancy, match rate, time to match and a request funnel.",
    },
    summary: "Evidence that matching works.",
    body: "Follow every request from submission to completed trip, see how quickly riders are matched and identify the hours when demand outpaces drivers.",
    stats: [
      { label: "Participation", value: "32.3%", note: "10 of 31 active" },
      { label: "Seat occupancy", value: "21.1%", note: "28 of 133 seats" },
      { label: "Match rate", value: "31.5%", note: "of resolved requests" },
      { label: "Time to match", value: "11s", note: "median" },
    ],
    features: [
      "A request funnel from requested to completed",
      "The outcome of every request: completed, cancelled or expired",
      "Demand against supply, hour by hour",
    ],
  },
  {
    id: "police-admin",
    tab: "Police console",
    role: "Police administrator",
    icon: Siren,
    image: {
      src: "/images/dashboards/police-admin.jpg",
      alt: "RideShare police administrator dashboard with an alert banner for active SOS alerts and city-wide transport metrics.",
    },
    summary: "City-wide safety oversight.",
    body: "Active SOS alerts appear the moment they are raised, alongside city-wide transport and carpooling metrics for every organisation.",
    stats: [
      { label: "Organisations", value: "3" },
      { label: "Employees", value: "31" },
      { label: "Total rides", value: "48" },
      { label: "Utilisation", value: "155%" },
    ],
    features: [
      "A prominent banner for every active SOS alert",
      "Acknowledge-and-resolve tracking for each alert",
      "Ride and utilisation trends over 7, 30 or 90 days",
    ],
  },
  {
    id: "corporate-admin",
    tab: "Organisation insights",
    role: "Corporate administrator",
    icon: Building2,
    image: {
      src: "/images/dashboards/corporate-admin.jpg",
      alt: "RideShare corporate administrator analytics showing the busiest pickup and drop-off areas, rides by day of the week and top contributors.",
    },
    summary: "Your organisation's commute, understood.",
    body: "See where employees travel, which days are busiest and who is keeping the most cars off the road.",
    stats: [
      { label: "Active drivers", value: "6" },
      { label: "Active riders", value: "6" },
      { label: "Busiest area", value: "30", note: "rides" },
      { label: "Top driver", value: "25", note: "passengers carried" },
    ],
    features: [
      "The busiest pickup and drop-off areas, grouped by location",
      "Rides by day of the week",
      "Top drivers ranked by passengers carried, not trips made",
    ],
  },
];

/** Counts a figure up from zero whenever it changes, keeping its decimals and suffix. */
function CountUp({ value }: { value: string }) {
  const match = value.match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;
  const suffix = match ? match[2] : "";
  const [n, setN] = useState(target);

  useEffect(() => {
    if (!match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      setN(target * (1 - (1 - p) ** 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!match) return <>{value}</>;
  return (
    <>
      {n.toFixed(decimals)}
      {suffix}
    </>
  );
}

export function Dashboards() {
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const d = DASHBOARDS[index];

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
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % DASHBOARDS.length), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [index, inView, paused, reduced]);

  const running = inView && !paused && !reduced;

  return (
    <section
      id="dashboards"
      ref={ref}
      className="relative isolate overflow-hidden bg-navy py-section text-on-dark"
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" && !paused) setPaused(true);
      }}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_36rem_at_70%_30%,rgba(253,186,116,0.14),transparent_60%),radial-gradient(40rem_30rem_at_5%_100%,rgba(212,163,115,0.12),transparent_60%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-dotgrid text-on-dark opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        aria-hidden
      />

      <div className="mx-auto max-w-wide px-gutter">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="eyebrow text-accent-bright">Dashboards</p>
              <h2 className="mt-4 text-title">
                Every role sees exactly what it{" "}
                <span className="font-accent text-gold-gradient pr-1">needs</span>.
              </h2>
            </div>
            <p className="max-w-copy text-lead text-on-dark/65">
              Platform, police and corporate administrators each work from a dedicated dashboard,
              built on live data from the RideShare platform.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-8">
          {/* The playlist of dashboards */}
          <Reveal delay={60}>
            <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1" role="tablist" aria-label="Dashboards">
              {DASHBOARDS.map((item, i) => {
                const on = i === index;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setIndex(i)}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setIndex(i)}
                      onFocus={() => setIndex(i)}
                      className={cn(
                        "relative w-full overflow-hidden rounded-2xl p-4 text-left ring-1 transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        on
                          ? "bg-white/[0.07] shadow-[0_20px_50px_-25px_rgba(253,186,116,0.5)] ring-accent-bright/40"
                          : "bg-white/[0.02] ring-white/10 hover:bg-white/[0.05]",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-500",
                            on ? "bg-gold-gradient text-[#1a1712]" : "bg-white/8 text-on-dark/60",
                          )}
                        >
                          <item.icon className="size-[1.1rem]" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[0.7rem] font-semibold tracking-wider text-on-dark/50 uppercase">
                            {item.role}
                          </p>
                          <p className={cn("font-semibold", on ? "text-on-dark" : "text-on-dark/75")}>
                            {item.tab}
                          </p>
                        </div>
                      </div>
                      <p
                        className={cn(
                          "mt-2 text-sm transition-colors duration-500",
                          on ? "text-on-dark/70" : "text-on-dark/40",
                        )}
                      >
                        {item.summary}
                      </p>
                      <span
                        className="absolute inset-x-4 bottom-0 h-0.5 overflow-hidden rounded-pill bg-white/5"
                        aria-hidden
                      >
                        {on ? (
                          <span
                            key={`${index}-${running}`}
                            className={cn(
                              "block h-full origin-left bg-gold-gradient",
                              running ? "animate-[tab-progress_linear_both]" : "scale-x-100 opacity-40",
                            )}
                            style={running ? { animationDuration: `${AUTO_MS}ms` } : undefined}
                          />
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          {/* The dashboard, its figures and features */}
          <Reveal delay={120}>
            <figure className="overflow-hidden rounded-3xl bg-[#1b1a1f] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-pill bg-white/20" />
                  <span className="size-2.5 rounded-pill bg-white/20" />
                  <span className="size-2.5 rounded-pill bg-white/20" />
                </span>
                <span className="min-w-0 flex-1 truncate rounded-pill bg-white/5 px-3 py-1 text-center text-xs text-on-dark/55">
                  RideShare · {d.role} · {d.tab}
                </span>
                <span className="hidden items-center gap-1.5 rounded-pill bg-accent-bright/15 px-2.5 py-1 text-[0.65rem] font-semibold text-accent-bright sm:flex">
                  <span className="size-1.5 animate-pulse rounded-pill bg-accent-bright" />
                  Live data
                </span>
              </div>
              <div className="relative aspect-[1535/782] bg-[#0e0d10]">
                {DASHBOARDS.map((item, i) => (
                  <img
                    key={item.id}
                    src={item.image.src}
                    alt={i === index ? item.image.alt : ""}
                    aria-hidden={i !== index}
                    width={1535}
                    height={782}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "absolute inset-0 size-full object-cover object-top transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      i === index ? "scale-100 opacity-100 blur-0" : "scale-[1.03] opacity-0 blur-sm",
                    )}
                  />
                ))}
              </div>
            </figure>

            <div key={d.id} className="mt-5 grid animate-page-in gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <div>
                <p className="font-display text-2xl font-semibold tracking-tight">{d.summary}</p>
                <p className="mt-2 leading-relaxed text-on-dark/65">{d.body}</p>
                <ul className="mt-4 space-y-2">
                  {d.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-on-dark/75">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent-bright" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <dl className="grid grid-cols-2 gap-3 self-start">
                {d.stats.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/10">
                    <dt className="text-xs text-on-dark/55">{s.label}</dt>
                    <dd className="mt-1 font-display text-2xl font-semibold text-gold-gradient tabular-nums">
                      <CountUp value={s.value} />
                    </dd>
                    {s.note ? <dd className="text-xs text-on-dark/45">{s.note}</dd> : null}
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
