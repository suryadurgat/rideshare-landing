import { Building2, ShieldCheck, Timer, Wallet } from "lucide-react";
import {
  computeCabFare,
  computeFare,
  FARE_RATE_PER_KM_INR,
  formatInr,
  MONTHLY_COMMUTE_KM,
} from "@/lib/fare";
import { cn } from "@/lib/utils";
import { APP_SCREENS, AppScreenshot } from "./PhoneFrame";
import { Reveal } from "./Reveal";
import { SideRoutes } from "./SideRoutes";

type Feature = {
  icon: typeof Building2;
  title: string;
  body: string;
};

const LEFT: Feature[] = [
  {
    icon: Building2,
    title: "Built for many organisations",
    body: "One platform serves many organisations, each with its own private network. Matching always stays within your organisation, a rule enforced by the system itself rather than by the app alone.",
  },
  {
    icon: Timer,
    title: "Matched within minutes",
    body: "No need to book the day before. Plans made the previous evening often change, so RideShare finds you a colleague in the minutes before you leave.",
  },
];

const RIGHT: Feature[] = [
  {
    icon: Wallet,
    title: "Transparent, formula-based fares",
    body: `${formatInr(FARE_RATE_PER_KM_INR)} per kilometre, per seat, subject to a minimum fare and calculated from your actual pickup and drop-off points. Nobody sets prices by hand.`,
  },
  {
    icon: ShieldCheck,
    title: "Safety built in from the start",
    body: "Dedicated safety features protect every rider, from the moment you are matched until you reach your destination.",
  },
];

const ROW_ONE = [
  "Share rides",
  "Brighter commutes",
  "Fewer cars at the gate",
  "Colleagues, not strangers",
];
const ROW_TWO = ["Same road", "Same gate", "One car", "Fair fares", "Safer journeys"];

function MarqueeWords({ words, reverse = false }: { words: string[]; reverse?: boolean }) {
  // Two identical halves so the loop is seamless; the marquee moves by exactly half.
  const half = [...words, ...words];
  return (
    <div className="overflow-hidden">
      <div
        className={cn("why-marquee flex w-max", reverse && "[animation-direction:reverse]")}
        style={{ animationDuration: reverse ? "400s" : "540s" }}
      >
        {[0, 1].map((copy) => (
          <p key={copy} className="flex shrink-0 items-center">
            {half.map((w, i) => (
              <span key={i} className="flex items-center">
                <span className="why-outline px-8 font-display text-[clamp(4rem,10vw,8.5rem)] leading-none font-semibold whitespace-nowrap">
                  {w}
                </span>
                <span className="size-3 rounded-pill bg-[#ecd5c1]" />
              </span>
            ))}
          </p>
        ))}
      </div>
    </div>
  );
}

export function Why() {
  return (
    <section id="why" className="relative isolate overflow-hidden bg-paper py-section">
      <SideRoutes variant="route" />
      {/* Large outlined words drifting slowly behind the content. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 space-y-4"
        aria-hidden
      >
        <MarqueeWords words={ROW_ONE} />
        <MarqueeWords words={ROW_TWO} reverse />
      </div>
      <div className="mx-auto max-w-wide px-gutter">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-primary">Why RideShare</p>
            <h2 className="mt-4 text-title text-ink">
              A better way to commute, with your{" "}
              <span className="font-accent text-brand-ink pr-1">colleagues</span>.
            </h2>
            <p className="mt-4 text-lead text-ink-soft">
              RideShare connects you with verified colleagues from your own organisation who
              already travel your route. Commuting together costs less than a cab, offers greater
              peace of mind than travelling with strangers and reduces congestion at the campus
              gate.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid items-start gap-12 sm:grid-cols-2 sm:gap-x-10 xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:gap-10">
          <div className="order-2 space-y-10 xl:order-1 xl:space-y-16">
            {LEFT.map((f, i) => (
              <Reveal key={f.title} delay={120 + i * 100}>
                <FeatureItem {...f} side="left" />
              </Reveal>
            ))}
          </div>

          <Reveal className="order-1 sm:col-span-2 xl:order-2 xl:col-span-1" delay={60}>
            <div className="relative mx-auto grid place-items-center px-6 py-6">
              {/* The logo's ring, drawn behind the phone. */}
              <div
                className="absolute size-[22rem] rounded-pill bg-brand-gradient opacity-95 md:size-[26rem]"
                aria-hidden
              />
              <div
                className="absolute size-[17rem] rounded-pill bg-paper md:size-[20rem]"
                aria-hidden
              />
              <div
                className="absolute size-[30rem] rounded-pill border border-dashed border-primary/20 md:size-[34rem]"
                aria-hidden
              />
              <div className="relative">
                <AppScreenshot screen={APP_SCREENS.driverHome} />
                <div className="absolute top-4 -left-24 hidden animate-float rounded-2xl bg-paper px-3.5 py-2.5 shadow-card xl:block">
                  <p className="text-[0.7rem] font-medium text-muted">Matching</p>
                  <p className="text-sm font-semibold text-ink">Verified colleagues only</p>
                </div>
                <div
                  className="absolute -right-24 bottom-6 hidden animate-float rounded-2xl bg-navy px-3.5 py-2.5 text-on-dark shadow-card xl:block"
                  style={{ animationDelay: "-3s" }}
                >
                  <p className="text-[0.7rem] font-medium text-on-dark-muted">
                    You save on a {MONTHLY_COMMUTE_KM} km commute
                  </p>
                  <p className="text-sm font-semibold text-good-bright">
                    {formatInr(
                      computeCabFare(MONTHLY_COMMUTE_KM) - computeFare(MONTHLY_COMMUTE_KM),
                    )}{" "}
                    per trip
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="order-3 space-y-10 xl:space-y-16">
            {RIGHT.map((f, i) => (
              <Reveal key={f.title} delay={160 + i * 100}>
                <FeatureItem {...f} side="right" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon: Icon, title, body, side }: Feature & { side: "left" | "right" }) {
  return (
    <article
      className={cn(
        "group flex items-start gap-4",
        side === "left" && "xl:flex-row-reverse xl:text-right",
      )}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/8 text-primary ring-1 ring-primary/10 transition-[background-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:bg-primary group-hover:text-primary-fg">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <div className="max-w-xs">
        <h3 className="text-lg font-semibold tracking-tight text-ink">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{body}</p>
      </div>
    </article>
  );
}
