import type { ReactNode } from "react";
import {
  ArrowRight,
  Ban,
  Building2,
  HandCoins,
  IndianRupee,
  Route,
  Users,
  Wallet,
} from "lucide-react";
import {
  CAB_BASE_INR,
  CAB_BASE_KM,
  CAB_PER_KM_INR,
  computeCabFare,
  computeFare,
  FARE_MIN_INR,
  FARE_MIN_SHORT_INR,
  FARE_RATE_PER_KM_INR,
  formatInr,
  SHORT_HOP_KM,
} from "@/lib/fare";
import { FareJourney } from "./FareJourney";
import { Reveal } from "./Reveal";

const TABLE_KM = [5, 10, 20, 30, 40];

const MONEY = [
  {
    icon: HandCoins,
    title: "Directly to the driver",
    body: "The full fare goes to your driver at the end of the journey, with nothing deducted along the way.",
  },
  {
    icon: Wallet,
    title: "No wallet to manage",
    body: "There is no balance to top up, no money held on your behalf and nothing to reclaim if you stop using RideShare.",
  },
  {
    icon: Building2,
    title: "No commission for us",
    body: "Your organisation pays for the platform, so we take no share of any fare and have no reason to raise it.",
  },
];

export function Costs() {
  return (
    <section id="costs" className="bg-cream py-section">
      <div className="mx-auto max-w-site px-gutter">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-primary">Pricing</p>
            <h2 className="mt-4 text-title">
              A formula, published in <span className="font-accent">full</span>.
            </h2>
            <p className="mt-4 text-lead text-ink-soft">
              Everyone pays by the same formula, calculated from the actual pickup and drop-off
              points. No one sets an amount by hand, so there is nothing to negotiate and nothing to
              dispute.
            </p>
          </div>
        </Reveal>

        {/* The formula, as a visual equation */}
        <Reveal delay={60}>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6">
            <div className="@container rounded-3xl bg-paper p-6 shadow-card ring-1 ring-line md:p-10">
              <p className="text-center text-xs font-semibold tracking-wider text-primary uppercase">
                How every fare is calculated
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-2 @xl:flex-row @xl:gap-4">
                <Token
                  icon={<Route className="size-4" />}
                  label="Distance"
                  hint="pickup to drop-off"
                />
                <Operator>×</Operator>
                <Token
                  icon={<IndianRupee className="size-4" />}
                  label={`${formatInr(FARE_RATE_PER_KM_INR)} per km`}
                  hint="the rate"
                  highlight
                />
                <Operator>×</Operator>
                <Token icon={<Users className="size-4" />} label="Seats" hint="how many you take" />
              </div>

              <div className="mx-auto mt-6 flex max-w-md items-center gap-4 text-sm text-muted">
                <span className="h-px flex-1 bg-line" />
                <span className="text-center">or the minimum fare, whichever is higher</span>
                <span className="h-px flex-1 bg-line" />
              </div>

              <dl className="mt-6 grid gap-3 sm:grid-cols-3">
                <Default value={formatInr(FARE_RATE_PER_KM_INR)} label="per km, per seat" />
                <Default
                  value={formatInr(FARE_MIN_SHORT_INR)}
                  label={`minimum, trips up to ${SHORT_HOP_KM} km`}
                />
                <Default
                  value={formatInr(FARE_MIN_INR)}
                  label={`minimum, trips over ${SHORT_HOP_KM} km`}
                />
              </dl>

              <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted">
                Platform defaults; your organisation may set its own. The rate in force is saved
                with every payment, and the minimum is charged once per trip, however many seats you
                take.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Calculator: drag the car, tap the seats, read the receipt */}
        <Reveal delay={100}>
          <FareJourney />
        </Reveal>

        {/* Comparison: one card per distance, bars to scale */}
        <Reveal delay={140}>
          <div className="mt-20 text-center">
            <p className="eyebrow text-primary">Compare</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              How RideShare compares, trip by trip
            </h3>
            <p className="mt-2 text-ink-soft">
              One seat, one way, at the platform's default rates.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5 [&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-1" aria-hidden>
            {TABLE_KM.map((d, i) => {
              const cab = computeCabFare(d);
              const us = computeFare(d);
              const top = computeCabFare(TABLE_KM[TABLE_KM.length - 1]);
              return (
                <div
                  key={d}
                  className={
                    "flex flex-col rounded-3xl bg-paper p-5 shadow-card ring-1 ring-line" +
                    (i === TABLE_KM.length - 1 ? " col-span-2 sm:col-span-1" : "")
                  }
                >
                  <p className="font-display text-2xl font-semibold tracking-tight tabular-nums">
                    {d} <span className="text-base font-medium text-muted">km</span>
                  </p>
                  <div className="mt-5 flex h-36 items-end justify-center gap-3">
                    <CompareBar value={cab} max={top} tone="cab" />
                    <CompareBar value={us} max={top} tone="us" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                    <div>
                      <p className="text-muted">App cab</p>
                      <p className="mt-0.5 font-semibold text-ink-soft tabular-nums">
                        {formatInr(cab)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">RideShare</p>
                      <p className="mt-0.5 font-bold text-primary tabular-nums">{formatInr(us)}</p>
                    </div>
                  </div>
                  <p className="mt-4 rounded-pill bg-amber-wash py-1.5 text-center text-sm font-semibold text-amber-ink tabular-nums">
                    You save {formatInr(cab - us)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* The same figures as a table, for screen readers */}
          <div className="sr-only">
            <table>
              <caption>
                RideShare fares compared with an estimated app-cab fare, one seat, one way
              </caption>
              <thead>
                <tr>
                  <th scope="col">Distance</th>
                  <th scope="col">App cab (estimate)</th>
                  <th scope="col">RideShare</th>
                  <th scope="col">You save</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_KM.map((d) => (
                  <tr key={d}>
                    <th scope="row">{d} km</th>
                    <td>{formatInr(computeCabFare(d))}</td>
                    <td>{formatInr(computeFare(d))}</td>
                    <td>{formatInr(computeCabFare(d) - computeFare(d))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-3xl bg-paper p-6 ring-1 ring-line">
              <p className="font-semibold text-ink">An app cab may also charge</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {["Surge pricing at peak hours", "Per-minute time charges", "Waiting charges"].map(
                  (x) => (
                    <li key={x} className="flex items-center gap-2.5">
                      <span className="grid size-5 place-items-center rounded-pill bg-paper-2 text-xs font-bold text-muted">
                        +
                      </span>
                      {x}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-navy p-6 text-on-dark">
              <div className="absolute inset-0 bg-dotgrid text-on-dark opacity-25" aria-hidden />
              <p className="relative flex items-center gap-2 font-semibold">
                <ArrowRight className="size-4 text-sky" />
                What RideShare charges
              </p>
              <p className="relative mt-3 text-sm leading-relaxed text-on-dark/80">
                The published formula, and nothing more. No surge pricing, no wallet and no
                commission, at any hour of the day.
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-muted">
            App-cab figures are estimates based on {formatInr(CAB_BASE_INR)} for the first{" "}
            {CAB_BASE_KM} km and {formatInr(CAB_PER_KM_INR)} per km thereafter. They exclude surge
            and time charges, so the real difference at peak hours is usually greater.
          </p>
        </Reveal>

        {/* Where your fare goes */}
        <Reveal delay={160}>
          <h3 className="mt-16 text-center text-2xl font-semibold tracking-tight md:text-3xl">
            Where your fare goes
          </h3>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {MONEY.map((m) => (
              <article key={m.title} className="rounded-3xl bg-paper p-6 ring-1 ring-line">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-on-dark">
                  <m.icon className="size-5" />
                </span>
                <h4 className="mt-5 text-lg font-semibold tracking-tight">{m.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-soft">
            <Ban className="size-4 text-primary" />
            Transparent by design: every rupee you pay goes to the colleague who drove you.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function CompareBar({ value, max, tone }: { value: number; max: number; tone: "cab" | "us" }) {
  return (
    <div className="flex h-full w-9 items-end overflow-hidden rounded-xl bg-paper-2">
      <div
        className={
          "w-full origin-bottom rounded-xl transition-transform duration-700 ease-out " +
          (tone === "us" ? "bg-brand-gradient" : "bg-ink/20")
        }
        style={{ height: `${Math.max(6, (value / max) * 100)}%` }}
      />
    </div>
  );
}

function Default({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col rounded-2xl bg-[#f7f9fc] px-5 py-4 text-center ring-1 ring-line">
      <dt className="order-2 mt-1 text-sm text-ink-soft">{label}</dt>
      <dd className="order-1 font-display text-3xl font-semibold tracking-tight text-brand-ink tabular-nums">
        {value}
      </dd>
    </div>
  );
}

function Token({
  icon,
  label,
  hint,
  highlight = false,
}: {
  icon: ReactNode;
  label: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "flex items-center gap-3 rounded-2xl bg-brand-gradient px-4 py-3 whitespace-nowrap text-on-dark shadow-[0_10px_30px_-10px_rgba(194,65,12,0.6)]"
          : "flex items-center gap-3 rounded-2xl bg-[#fbeee2] px-4 py-3 whitespace-nowrap text-ink ring-1 ring-[#f3d9c4]"
      }
    >
      <span
        className={
          highlight
            ? "grid size-8 place-items-center rounded-xl bg-white/20"
            : "grid size-8 place-items-center rounded-xl bg-paper text-primary"
        }
      >
        {icon}
      </span>
      <span className="text-left leading-tight">
        <span className="block font-semibold">{label}</span>
        <span className={highlight ? "block text-xs text-on-dark/80" : "block text-xs text-muted"}>
          {hint}
        </span>
      </span>
    </div>
  );
}

function Operator({ children }: { children: ReactNode }) {
  return (
    <span className="text-3xl font-light text-muted/70 select-none">
      <span aria-hidden>{children}</span>
      <span className="sr-only">times</span>
    </span>
  );
}
