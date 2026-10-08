import { cn } from "@/lib/utils";
import { APP_SCREENS } from "./PhoneFrame";
import { Reveal } from "./Reveal";

type Screen = { src: string; alt: string };
type Slide = { screen: Screen; eyebrow: string; title: string; bg: string; dark?: boolean };

const PHONE_SLIDES: Slide[] = [
  { screen: APP_SCREENS.passengerHome, eyebrow: "Passenger", title: "Search your destination.", bg: "#f6ede3" },
  { screen: APP_SCREENS.pickRoute, eyebrow: "Maps", title: "Choose your route on Google Maps.", bg: "#fbe9e7" },
  { screen: APP_SCREENS.driverHome, eyebrow: "Driver", title: "Offer your spare seats.", bg: "#efece8" },
  { screen: APP_SCREENS.driverNavigation, eyebrow: "Driver", title: "Live navigation, turn by turn.", bg: "#fdf3d9" },
  { screen: APP_SCREENS.sos, eyebrow: "Safety", title: "One-tap SOS, backed by Cyberabad Police.", bg: "#3a1416", dark: true },
  { screen: APP_SCREENS.myRides, eyebrow: "Passenger", title: "A complete ride history.", bg: "#f3efe9" },
  { screen: APP_SCREENS.driverCollectFare, eyebrow: "Driver", title: "Collect the calculated fare.", bg: "#1c1917", dark: true },
];

const WINDOW_SLIDES: Slide[] = [
  {
    screen: { src: "/images/dashboards/super-admin.jpg", alt: "Platform overview dashboard." },
    eyebrow: "Super administrator",
    title: "The whole platform at a glance.",
    bg: "#1c1917",
    dark: true,
  },
  {
    screen: { src: "/images/dashboards/analytics.jpg", alt: "Matching analytics dashboard." },
    eyebrow: "Matching analytics",
    title: "Evidence that matching works.",
    bg: "#fdf3d9",
  },
  {
    screen: { src: "/images/dashboards/police-admin.jpg", alt: "Police console with active SOS alerts." },
    eyebrow: "Police administrator",
    title: "City-wide safety oversight.",
    bg: "#3a1416",
    dark: true,
  },
  {
    screen: { src: "/images/dashboards/corporate-admin.jpg", alt: "Organisation insights dashboard." },
    eyebrow: "Corporate administrator",
    title: "Your organisation's commute, understood.",
    bg: "#f3efe9",
  },
];

export function Showcase() {
  return (
    <section id="showcase" className="overflow-hidden bg-paper py-section" aria-label="Product highlights">
      <div className="mx-auto max-w-wide px-gutter">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow w-full justify-center text-accent">A closer look</p>
            <h2 className="mt-4 text-title">
              The RideShare experience, screen by{" "}
              <span className="font-accent text-accent">screen</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lead text-ink-soft">
              From a passenger's first search to an administrator's live dashboard, every screen
              shown here comes from the working platform.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-14 space-y-4 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <Row slides={PHONE_SLIDES} variant="phone" duration="320s" />
        <Row slides={WINDOW_SLIDES} variant="window" duration="310s" reverse />
      </div>
    </section>
  );
}

function Row({
  slides,
  variant,
  duration,
  reverse = false,
}: {
  slides: Slide[];
  variant: "phone" | "window";
  duration: string;
  reverse?: boolean;
}) {
  // Four copies: the marquee moves by half the list, and half must still be wider than the
  // screen for the loop to be seamless. Only the first copy is exposed to assistive tech.
  const loop = [...slides, ...slides, ...slides, ...slides];
  return (
    <div className="group/row">
      <ul
        className={cn(
          "flex w-max gap-4 pr-4 animate-marquee will-change-transform [backface-visibility:hidden] group-hover/row:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ animationDuration: duration }}
      >
        {loop.map((s, i) => (
          <li key={`${s.screen.src}-${i}`} aria-hidden={i >= slides.length || undefined} className="py-2">
            <SlideTile slide={s} variant={variant} decorative={i >= slides.length} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SlideTile({ slide, variant, decorative }: { slide: Slide; variant: "phone" | "window"; decorative: boolean }) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl p-6 ring-1 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(28,25,23,0.55)]",
        variant === "phone" ? "h-[22rem] w-64" : "h-[17rem] w-[30rem] max-w-[85vw]",
        slide.dark ? "text-on-dark ring-white/10" : "text-ink ring-black/5",
      )}
      style={{ background: slide.bg }}
    >
      <p className={cn("text-xs font-semibold tracking-wider uppercase", slide.dark ? "text-[#fcd34d]" : "text-accent")}>
        {slide.eyebrow}
      </p>
      <h3
        className={cn(
          "relative z-10 mt-2 font-display leading-snug font-semibold tracking-tight",
          variant === "phone" ? "text-lg" : "max-w-[13rem] text-lg",
        )}
      >
        {slide.title}
      </h3>

      {variant === "phone" ? (
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <div className="w-[66%] translate-y-[14%] rounded-t-[1.7rem] bg-ink p-1.5 pb-0 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-[8%]">
            <img
              src={slide.screen.src}
              alt={decorative ? "" : slide.screen.alt}
              width={717}
              height={1600}
              loading="lazy"
              decoding="async"
              className="block aspect-[717/1150] w-full rounded-t-[1.35rem] object-cover object-top"
            />
          </div>
        </div>
      ) : (
        <div className="absolute right-[-3%] bottom-[-6%] w-[62%] overflow-hidden rounded-xl bg-paper shadow-[0_25px_55px_-20px_rgba(0,0,0,0.5)] ring-1 ring-black/10 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1.5 group-hover:-translate-y-1.5">
          <div className="flex items-center gap-1.5 border-b border-line bg-paper-2 px-2.5 py-1.5" aria-hidden>
            <span className="size-1.5 rounded-pill bg-[#f87171]" />
            <span className="size-1.5 rounded-pill bg-[#fbbf24]" />
            <span className="size-1.5 rounded-pill bg-[#a3a3a3]" />
          </div>
          <img
            src={slide.screen.src}
            alt={decorative ? "" : slide.screen.alt}
            width={1535}
            height={782}
            loading="lazy"
            decoding="async"
            className="block aspect-[1535/782] w-full object-cover object-top"
          />
        </div>
      )}
    </article>
  );
}
