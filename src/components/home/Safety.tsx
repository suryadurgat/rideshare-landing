import { Ban, BellRing, CheckCircle2, ClipboardList, Info, MapPin, MapPinned, ShieldCheck, Siren, UserRoundCheck, Hand } from "lucide-react";
import { APP_SCREENS, AppScreenshot } from "./PhoneFrame";
import { Reveal } from "./Reveal";

const ALERT_PATH = [
  { icon: Hand, title: "Tap SOS", body: "Available from the top bar on every screen." },
  { icon: CheckCircle2, title: "Confirm", body: "A single confirmation prevents accidental alerts." },
  { icon: MapPin, title: "Location shared", body: "Your live location and ride details are attached." },
  {
    icon: Siren,
    title: "Police console alerted",
    body: "The Cyberabad Police console and your organisation's safety team are notified at once.",
  },
  { icon: BellRing, title: "Acknowledged and resolved", body: "Every alert is tracked until it is closed." },
];

const ITEMS = [
  {
    icon: UserRoundCheck,
    title: "Women-only driver mode",
    body: "A female driver can choose to be matched with women passengers only. The preference applies only when the account holder is female, so it cannot be enabled speculatively.",
  },
  {
    icon: MapPinned,
    title: "Live tracking from the match",
    body: "Passengers see the driver's position, route and estimated arrival in real time, from the moment of the match until the journey ends.",
  },
  {
    icon: Ban,
    title: "Mutual blocking",
    body: "Either person can block the other, and a blocked pair is never matched again. No explanation is required.",
  },
  {
    icon: ClipboardList,
    title: "A complete audit trail",
    body: "Every significant action is recorded with who performed it, whom it affected and what changed, so any incident can be reviewed accurately.",
  },
];

const LIMITS = [
  "We do not run criminal background checks.",
  "We do not place cameras in vehicles.",
  "We do not claim that a shared employer makes someone safe; it makes them accountable, traceable and known to people who can act.",
];

export function Safety() {
  return (
    <section id="safety" className="relative isolate overflow-hidden bg-navy py-section text-on-dark">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_32rem_at_20%_45%,rgba(229,39,62,0.18),transparent_60%),radial-gradient(40rem_28rem_at_90%_10%,rgba(245,158,11,0.10),transparent_60%)]"
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-dotgrid text-on-dark opacity-10" aria-hidden />

      <div className="mx-auto max-w-site px-gutter">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="eyebrow text-accent-bright">Safety</p>
              <h2 className="mt-4 text-title">
                Safety, built into every <span className="font-accent text-accent-bright">journey</span>.
              </h2>
            </div>
            <p className="max-w-copy text-lead text-on-dark/70">
              For commuters in India, and for women in particular, safety decides whether a service
              can be used at all. RideShare treats it as the foundation, not a feature.
            </p>
          </div>
        </Reveal>

        {/* 01 · SOS, backed by Cyberabad Police */}
        <Reveal delay={80}>
          <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-white/[0.03] p-6 ring-1 ring-white/10 md:p-10">
            <div className="grid items-center gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14">
              {/* The real SOS screen, with alert rings */}
              <div className="relative mx-auto grid place-items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="sos-ring absolute size-56 rounded-pill border-2 border-sos/50"
                    style={{ animationDelay: `${i * 0.9}s` }}
                    aria-hidden
                  />
                ))}
                <AppScreenshot screen={APP_SCREENS.sos} className="relative w-[200px]" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-display text-5xl font-semibold text-white/15 tabular-nums">01</span>
                  <img
                    src="/images/partners/cyberabad-police.png"
                    alt="Cyberabad Police Commissionerate emblem"
                    width={56}
                    height={56}
                    className="size-14 rounded-2xl bg-white object-contain p-1.5"
                  />
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-accent-bright uppercase">
                      Under the Cyberabad Police Commissionerate
                    </p>
                    <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                      SOS, backed by Cyberabad Police
                    </h3>
                  </div>
                </div>
                <p className="mt-4 max-w-2xl leading-relaxed text-on-dark/70">
                  RideShare is an initiative of the Cyberabad Police Commissionerate and the Society
                  for Cyberabad Security Council. When you raise an SOS, it goes straight to a dedicated
                  police console as well as your organisation's safety team, so help is never more
                  than one tap away.
                </p>

                {/* The path an alert takes */}
                <ol className="relative mt-8 grid gap-4 xl:grid-cols-5 xl:gap-3">
                  <span
                    className="absolute top-6 right-[10%] left-[10%] hidden h-0.5 overflow-hidden rounded-pill bg-white/10 xl:block"
                    aria-hidden
                  >
                    <span className="sos-signal absolute inset-y-0 w-24 bg-linear-to-r from-transparent via-sos to-transparent" />
                  </span>
                  {ALERT_PATH.map((step, i) => (
                    <li key={step.title} className="relative flex gap-4 xl:flex-col xl:items-center xl:text-center">
                      <span
                        className="sos-step relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl bg-[#221819] text-accent-bright ring-1 ring-white/10"
                        style={{ animationDelay: `${i * 1.2}s` }}
                      >
                        <step.icon className="size-5" strokeWidth={1.9} />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-on-dark/45 tabular-nums">Step {i + 1}</p>
                        <p className="mt-0.5 font-semibold">{step.title}</p>
                        <p className="mt-1 text-sm leading-snug text-on-dark/60">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 02–05 · The other mechanisms */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={100 + i * 70}>
              <article className="group relative h-full overflow-hidden rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 transition-[transform,background-color] duration-500 hover:-translate-y-1 hover:bg-white/[0.06]">
                <span
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-sos to-[#f59e0b] transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden
                />
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-2xl bg-[#221819] text-accent-bright ring-1 ring-white/10">
                    <item.icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-display text-3xl font-semibold text-white/15 tabular-nums">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-dark/65">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* What it does not claim */}
        <Reveal delay={120}>
          <div className="mt-4 grid gap-6 rounded-3xl bg-white/[0.02] p-6 ring-1 ring-white/10 md:grid-cols-[auto_1fr] md:p-8">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#221819] text-[#fcd34d] ring-1 ring-white/10">
              <Info className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                <ShieldCheck className="size-5 text-[#fcd34d]" />
                What RideShare does not claim
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-dark/65">
                RideShare reduces risk; it cannot remove it entirely. We would rather be clear about
                where the line is than let you discover it.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-on-dark/75 md:grid-cols-3">
                {LIMITS.map((l) => (
                  <li key={l} className="rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/10">
                    {l}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-on-dark/65">
                If your organisation requires background verification, it carries this out on its side,
                and RideShare will report against it.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
