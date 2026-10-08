import { useEffect, useId, useRef } from "react";

/**
 * Two roads in a section's side margins, each with a small car that drives as the page
 * scrolls: down on the left, up on the right. "lane" is a straight dashed lane; "route"
 * winds gently, fills in behind the car and ends at a destination pin. Motion is eased
 * toward the scroll position every frame, so it glides rather than jumps. Only shown where
 * the margins are wide enough; with reduced motion the cars rest at their destinations.
 *
 * Render it as the first child of a `relative isolate` section.
 */
export function SideRoutes({ variant }: { variant: "lane" | "route" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const section = root?.parentElement;
    if (!root || !section) return;

    const tracks = [...root.querySelectorAll<HTMLElement>("[data-track]")].map((el) => ({
      el,
      down: el.dataset.track === "down",
      base: el.querySelector<SVGPathElement>("[data-base]")!,
      fill: el.querySelector<SVGPathElement>("[data-fill]"),
      car: el.querySelector<HTMLElement>("[data-car]")!,
      pin: el.querySelector<HTMLElement>("[data-pin]"),
      length: 0,
    }));

    const amplitude = variant === "route" ? 16 : 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Build each path in pixels so the car never distorts, heading in its travel direction.
    const layout = () => {
      for (const t of tracks) {
        const h = t.el.clientHeight;
        const cx = t.el.clientWidth / 2;
        const pts: string[] = [];
        for (let i = 0; i <= h; i += 6) {
          const y = t.down ? i : h - i;
          const x = cx + amplitude * Math.sin((y / 360) * Math.PI * 2 + (t.down ? 0 : Math.PI));
          pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        const d = `M${pts.join(" L")}`;
        t.base.setAttribute("d", d);
        t.fill?.setAttribute("d", d);
        t.length = t.base.getTotalLength();
        if (t.fill) t.fill.style.strokeDasharray = `${t.length}`;
        if (t.pin) {
          const end = t.base.getPointAtLength(t.length);
          t.pin.style.transform = `translate(${end.x}px, ${end.y}px)`;
        }
      }
    };

    const place = (p: number) => {
      for (const t of tracks) {
        const at = Math.max(0.01, p * t.length);
        const pt = t.base.getPointAtLength(at);
        const back = t.base.getPointAtLength(Math.max(0, at - 4));
        const angle = (Math.atan2(pt.y - back.y, pt.x - back.x) * 180) / Math.PI + 90;
        t.car.style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -50%) rotate(${angle}deg)`;
        if (t.fill) t.fill.style.strokeDashoffset = `${t.length * (1 - p)}`;
      }
    };

    const target = () => {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      return Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    };

    let current = reduce ? 1 : target();
    let frame = 0;
    const tick = () => {
      frame = 0;
      const goal = target();
      current += (goal - current) * 0.12;
      if (Math.abs(goal - current) < 0.0005) current = goal;
      place(current);
      if (current !== goal) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onResize = () => {
      layout();
      place(current);
    };

    layout();
    place(current);
    if (reduce) {
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [variant]);

  const id = useId();
  // Centre of the side margin: half of ((section − content width) / 2 + gutter).
  const inset = "calc(((100% - var(--max-width-wide)) / 2 + var(--spacing-gutter)) / 2 - 2rem)";
  const route = variant === "route";

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 hidden min-[1320px]:block"
      aria-hidden
    >
      {(["down", "up"] as const).map((dir) => (
        <div
          key={dir}
          data-track={dir}
          className="absolute top-[var(--spacing-section)] bottom-[var(--spacing-section)] w-16"
          style={dir === "down" ? { left: inset } : { right: inset }}
        >
          <svg className="absolute inset-0 size-full overflow-visible">
            <defs>
              <linearGradient id={`${id}-${dir}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
            </defs>
            <path
              data-base
              fill="none"
              stroke="rgba(194,65,12,0.28)"
              strokeWidth={route ? 1.5 : 2}
              strokeDasharray={route ? "2 7" : "10 12"}
              strokeLinecap="round"
            />
            {route && (
              <path
                data-fill
                fill="none"
                stroke={`url(#${id}-${dir})`}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
          </svg>

          {route && (
            <>
              {/* Start: a hollow ring where the road begins. */}
              <span
                className="absolute left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-pill border-2 border-ember/60 bg-paper"
                style={
                  dir === "down" ? { top: 0 } : { bottom: 0, transform: "translate(-50%, 50%)" }
                }
              />
              {/* Destination: a pin with a soft pulse. */}
              <span data-pin className="absolute top-0 left-0">
                <span className="absolute size-6 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-pill bg-ember/25" />
                <span className="absolute grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-pill bg-ember ring-4 ring-ember/15">
                  <span className="size-1.5 rounded-pill bg-paper" />
                </span>
              </span>
            </>
          )}

          <div data-car className="absolute top-0 left-0 will-change-transform">
            <LaneCar />
          </div>
        </div>
      ))}
    </div>
  );
}

/** A small car seen from above, nose pointing up. */
function LaneCar() {
  return (
    <svg viewBox="0 0 22 38" className="block h-10 w-6 drop-shadow-md">
      <rect x="1" y="1" width="20" height="36" rx="8" fill="#c2410c" />
      <rect x="4" y="7" width="14" height="8" rx="3" fill="#fde6d6" />
      <rect x="4" y="24" width="14" height="6" rx="2.5" fill="#fde6d6" opacity="0.75" />
      <rect x="3" y="2.5" width="4" height="2" rx="1" fill="#fcd34d" />
      <rect x="15" y="2.5" width="4" height="2" rx="1" fill="#fcd34d" />
    </svg>
  );
}
