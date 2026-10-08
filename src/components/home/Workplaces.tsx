import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  ClipboardList,
  KeyRound,
  LineChart,
  MapPinned,
  Siren,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

const STEP_MS = 2600;

const CAPABILITIES = [
  {
    icon: KeyRound,
    title: "Scoped administration",
    body: "Organisation, campus and user roles across six permission levels, checked on every request rather than trusted from a session.",
  },
  {
    icon: Siren,
    title: "A staffed SOS console",
    body: "Alerts arrive graded by severity, with an acknowledge-and-resolve workflow so that nothing goes unseen.",
  },
  {
    icon: ClipboardList,
    title: "A complete audit record",
    body: "Every significant action is recorded with who performed it, whom it affected and what changed.",
  },
  {
    icon: LineChart,
    title: "Reporting you can stand behind",
    body: "Completed rides, seats shared and vehicle trips avoided, with the calculation method shown beside every figure.",
  },
];

const ROLLOUT = [
  {
    icon: Building2,
    title: "Set up your organisation",
    body: "We create your organisation and campuses. Nothing is shared with any other organisation.",
  },
  {
    icon: Users,
    title: "Invite your people",
    body: "Upload a spreadsheet or invite colleagues by work-email domain, with roles assigned from the start.",
  },
  {
    icon: MapPinned,
    title: "Start with one campus",
    body: "Matching improves with density, so we begin with a single site and shift pattern.",
  },
  {
    icon: BarChart3,
    title: "Measure, then expand",
    body: "Review the match rate and seats shared, then open the next campus on evidence.",
  },
];

const ROLES = ["Super admin", "Admin", "Police", "Corporate admin", "Corporate user", "Member"];

/** Small, illustrative previews of the console, one per capability. */
const PREVIEWS = [
  <div key="roles" className="flex max-w-[15rem] flex-wrap justify-center gap-1.5 px-3" aria-hidden>
    {ROLES.map((r, i) => (
      <span
        key={r}
        className="rounded-pill bg-paper px-2.5 py-1 text-[0.65rem] font-semibold text-ink-soft ring-1 ring-line transition-[background-color,color] duration-500 group-hover:bg-ink group-hover:text-on-dark"
        style={{ transitionDelay: `${i * 60}ms` }}
      >
        {r}
      </span>
    ))}
  </div>,
  <div key="sos" className="w-full max-w-[14rem] rounded-xl bg-paper p-3 shadow-card" aria-hidden>
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-xs font-semibold">
        <span className="size-2 rounded-pill bg-sos" />
        SOS alert
      </span>
      <span className="rounded-pill bg-sos/10 px-2 py-0.5 text-[0.6rem] font-bold text-sos uppercase">
        High
      </span>
    </div>
    <div className="mt-2 flex items-center justify-between text-[0.65rem] text-muted">
      <span>Live location attached</span>
      <span className="relative grid">
        <span className="col-start-1 row-start-1 rounded-pill bg-paper-2 px-2 py-0.5 font-semibold text-ink-soft transition-opacity duration-500 group-hover:opacity-0">
          New
        </span>
        <span className="col-start-1 row-start-1 rounded-pill bg-[#fef3c7] px-2 py-0.5 font-semibold whitespace-nowrap text-[#92400e] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          Acknowledged ✓
        </span>
      </span>
    </div>
  </div>,
  <ul
    key="audit"
    className="w-full max-w-[14rem] space-y-1.5 px-2 font-mono text-[0.6rem] text-ink-soft"
    aria-hidden
  >
    {["Admin updated a campus", "Role changed to Driver", "SOS alert resolved"].map((line, i) => (
      <li
        key={line}
        className="flex items-center gap-2 rounded-lg bg-paper px-2 py-1 ring-1 ring-line transition-transform duration-500 group-hover:translate-x-1"
        style={{ transitionDelay: `${i * 80}ms` }}
      >
        <span className="size-1.5 rounded-pill bg-[#ea580c]" />
        {line}
      </li>
    ))}
  </ul>,
  <div key="report" className="flex h-16 items-end gap-2" aria-hidden>
    {[38, 52, 46, 68, 74, 90].map((h, i) => (
      <span
        key={i}
        className="w-4 origin-bottom rounded-t-md bg-ink/80 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-110"
        style={{
          height: `${h}%`,
          transitionDelay: `${i * 50}ms`,
          background: i === 5 ? "#ea580c" : undefined,
        }}
      />
    ))}
  </div>,
];

export function Workplaces() {
  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(Boolean(e?.isIntersecting)), {
      rootMargin: "-25% 0px -25% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduced) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % ROLLOUT.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [step, inView, reduced]);

  const shown = reduced ? ROLLOUT.length - 1 : step;

  return (
    <section id="workplaces" className="relative isolate overflow-hidden bg-paper py-section">
      <div
        className="absolute inset-0 -z-10 bg-dotgrid text-ink opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_65%)]"
        aria-hidden
      />
      <div
        className="absolute -top-32 right-[-10rem] -z-10 size-[34rem] rounded-pill bg-accent-bright/30 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto max-w-wide px-gutter">
        {/* Header */}
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <p className="eyebrow text-accent">For organisations</p>
              <h2 className="mt-4 max-w-2xl text-title">
                Run a commute programme you can{" "}
                <span className="relative inline-block font-accent text-accent">
                  answer for
                  <svg
                    className="work-underline absolute -bottom-2 left-0 h-3 w-full"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d="M2 9 C 50 3, 120 3, 198 7"
                      fill="none"
                      stroke="#ea580c"
                      strokeWidth="3"
                      strokeLinecap="round"
                      pathLength={1}
                    />
                  </svg>
                </span>
                .
              </h2>
            </div>
            <div>
              <p className="text-lead text-ink-soft">
                RideShare gives your administrators full control: scoped access, a staffed SOS
                console, a complete audit record and reporting you can stand behind.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex min-h-12 items-center gap-2 rounded-pill bg-ink px-6 font-semibold text-on-dark transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Register your organisation
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="/#dashboards"
                  className="inline-flex min-h-12 items-center rounded-pill px-6 font-semibold text-ink ring-1 ring-line transition-colors duration-200 hover:bg-paper-2"
                >
                  See the dashboards
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Capabilities, each with a small preview of the console */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.title} delay={80 + i * 70}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-paper/80 p-6 ring-1 ring-line backdrop-blur-sm transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(28,25,23,0.45)] hover:ring-[#ea580c]/40">
                <div className="flex h-28 items-center justify-center rounded-2xl bg-paper-2 ring-1 ring-line">
                  {PREVIEWS[i]}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-on-dark transition-transform duration-500 group-hover:-rotate-6">
                    <c.icon className="size-[1.1rem]" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-lg leading-tight font-semibold tracking-tight">{c.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{c.body}</p>
                <span
                  className="absolute inset-x-6 bottom-0 h-0.5 origin-left scale-x-0 bg-[#ea580c] transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden
                />
              </article>
            </Reveal>
          ))}
        </div>

        {/* Rollout */}
        <Reveal delay={120}>
          <div className="mt-16 rounded-[2rem] bg-paper-2 p-6 ring-1 ring-line md:p-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-accent uppercase">
                  Rollout
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                  What getting started involves
                </h3>
              </div>
              <p className="max-w-sm text-sm text-ink-soft">
                Four clear steps, with our team alongside you from the first campus onwards.
              </p>
            </div>

            <ol ref={ref} className="relative mt-10 grid gap-6 md:grid-cols-4 md:gap-4">
              {/* The progress line behind the steps */}
              <span
                className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-0.5 rounded-pill bg-line md:block"
                aria-hidden
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-pill bg-ink transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ width: `${(shown / (ROLLOUT.length - 1)) * 100}%` }}
                />
              </span>
              {ROLLOUT.map((r, i) => {
                const done = i <= shown;
                const current = i === shown;
                return (
                  <li
                    key={r.title}
                    className="relative flex gap-4 md:flex-col md:items-center md:text-center"
                  >
                    <button
                      type="button"
                      onClick={() => setStep(i)}
                      aria-current={current ? "step" : undefined}
                      aria-label={`Step ${i + 1}: ${r.title}`}
                      className={cn(
                        "relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl ring-1 transition-[background-color,color,transform,box-shadow] duration-500",
                        done ? "bg-ink text-on-dark ring-ink" : "bg-paper text-muted ring-line",
                        current && "scale-110 shadow-[0_0_0_6px_rgba(234,88,12,0.18)]",
                      )}
                    >
                      <r.icon className="size-5" strokeWidth={1.75} />
                    </button>
                    <div>
                      <p
                        className={cn(
                          "text-xs font-semibold tabular-nums",
                          done ? "text-accent" : "text-muted",
                        )}
                      >
                        Step {i + 1}
                      </p>
                      <p className="mt-1 font-semibold tracking-tight">{r.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>

        {/* Registration */}
        <Reveal delay={160}>
          <div className="relative mt-4 overflow-hidden rounded-[2rem] bg-ink p-8 text-on-dark md:p-12">
            <div
              className="absolute -top-24 -right-24 size-[26rem] rounded-pill bg-[#ea580c]/30 blur-3xl"
              aria-hidden
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <h3 className="max-w-xl font-display text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                  Bring RideShare to your organisation.
                </h3>
                <p className="mt-3 max-w-xl text-on-dark/70">
                  Book a thirty-minute walkthrough of the console, the SOS workflow and the
                  reporting, shown against your own campus rather than a sandbox.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  to="/contact"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-pill bg-paper px-7 font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Register your organisation
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <p className="text-center text-xs text-on-dark/55">
                  We reply within one working day.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
