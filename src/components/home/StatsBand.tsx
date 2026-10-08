import { useEffect, useRef, useState } from "react";
import { shouldRenderStats, visibleStats } from "@/lib/stats";
import { Reveal } from "./Reveal";

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(to);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const start = performance.now();
        const dur = 900;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - (1 - p) ** 3;
          setN(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("en-IN")}
    </span>
  );
}

export function StatsBand() {
  if (!shouldRenderStats()) return null;
  const tiles = visibleStats();

  return (
    <section className="bg-navy pt-6 pb-16 text-on-dark md:pb-20" aria-label="Platform figures">
      <div className="mx-auto max-w-wide px-gutter">
        <div className="grid grid-cols-1 divide-y divide-white/10 rounded-2xl bg-navy-2 ring-1 ring-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {tiles.map((tile, i) => (
            <Reveal key={tile.id} delay={i * 90}>
              <div className="px-6 py-8 text-center md:py-10">
                <p className="text-5xl font-bold tracking-tight text-brand-gradient md:text-6xl">
                  <Count to={tile.value} />
                </p>
                <p className="mt-2 text-sm font-medium text-on-dark-muted">{tile.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-on-dark/45">
          Figures are drawn live from the platform and shown only once they reach a meaningful threshold.
        </p>
      </div>
    </section>
  );
}
