import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, IndianRupee, ShieldCheck, UsersRound } from "lucide-react";
import { PARTNERS } from "@/components/layout/Partners";
import { Reveal } from "./Reveal";

const PROMISES = [
  { icon: UsersRound, label: "Verified colleagues only" },
  { icon: IndianRupee, label: "Fares set by a published formula" },
  { icon: ShieldCheck, label: "SOS backed by Cyberabad Police" },
];

export function ClosingCta() {
  return (
    <section className="bg-paper px-gutter py-section">
      <Reveal>
        <div className="relative isolate mx-auto max-w-wide overflow-hidden rounded-[2.5rem] bg-[linear-gradient(160deg,#fff8f0_0%,#ffedd5_55%,#fecdd3_100%)] px-6 pt-16 pb-24 text-center text-ink ring-1 ring-[#f5dcc4] md:pt-24 md:pb-32">
          {/* Warm light and a faint road winding behind the content */}
          <div
            className="absolute -top-40 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-pill bg-accent-bright/35 blur-3xl"
            aria-hidden
          />
          <svg
            className="absolute inset-x-0 bottom-0 -z-10 h-48 w-full text-accent/15 md:h-64"
            viewBox="0 0 1200 260"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path
              d="M-20 255 C 260 200, 420 265, 640 230 S 1000 185, 1220 210"
              stroke="currentColor"
              strokeWidth="46"
              strokeLinecap="round"
            />
            <path
              d="M-20 255 C 260 200, 420 265, 640 230 S 1000 185, 1220 210"
              stroke="#fff8f0"
              strokeOpacity="0.9"
              strokeWidth="3"
              strokeDasharray="22 22"
              className="closing-road"
            />
          </svg>

          <div className="relative mx-auto max-w-3xl">
            {/* The RideShare mark, with rings travelling outwards */}
            <div className="relative mx-auto grid size-36 place-items-center md:size-40">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="sos-ring absolute inset-0 rounded-pill border-2 border-[#ea580c]/40"
                  style={{ animationDelay: `${i * 1.1}s` }}
                  aria-hidden
                />
              ))}
              <span className="relative grid size-full place-items-center rounded-pill bg-white shadow-[0_25px_60px_-20px_rgba(194,65,12,0.45)] ring-1 ring-[#f5dcc4]">
                <img
                  src="/logo.png"
                  alt="RideShare"
                  width={985}
                  height={1154}
                  className="h-[68%] w-auto object-contain"
                />
              </span>
            </div>

            {/* Partners */}
            <p className="mt-9 text-xs font-semibold tracking-[0.2em] text-[#9a3412] uppercase">
              An initiative of
            </p>
            <ul className="mt-4 flex flex-wrap items-stretch justify-center gap-3">
              {PARTNERS.map((p) => (
                <li
                  key={p.name}
                  className="flex items-center gap-3 rounded-2xl bg-white/80 py-2 pr-5 pl-2 text-left shadow-[0_12px_30px_-18px_rgba(124,45,18,0.5)] ring-1 ring-[#f5dcc4] backdrop-blur"
                >
                  <img
                    src={p.logo}
                    alt=""
                    width={64}
                    height={64}
                    className="size-14 rounded-xl bg-white object-contain p-1 md:size-16"
                  />
                  <span className="max-w-44 text-sm leading-tight font-semibold text-ink">{p.name}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-12 text-display">
              Your colleagues are already heading{" "}
              <span className="font-accent pr-1 text-accent">your way</span>.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lead text-ink-soft">
              Every morning, people from the same neighbourhoods drive to the same campus, often
              with empty seats beside them. RideShare turns those separate journeys into shared
              ones: calmer, more affordable and in good company.
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                to="/login"
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-pill bg-[#1c1917] px-7 font-semibold text-white shadow-[0_18px_40px_-18px_rgba(28,25,23,0.7)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-accent"
              >
                Sign in with your work email
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-pill bg-white/70 px-7 font-semibold text-ink ring-1 ring-[#e9c9ab] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                <Building2 className="size-4 text-accent" />
                Register your organisation
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted">
              Not on RideShare yet? Registration begins with a single conversation.
            </p>

            <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-[#f0d3b8] pt-8">
              {PROMISES.map((p) => (
                <li key={p.label} className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                  <p.icon className="size-4 text-accent" />
                  {p.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
