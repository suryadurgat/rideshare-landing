import { Clock } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { SideRoutes } from "./SideRoutes";

const POINTS: { visual: ReactNode; title: string; body: string }[] = [
  {
    visual: <SeatsVisual />,
    title: "Four seats, one person",
    body: "Most cars on the way to campus carry only their driver. That uses roughly four times the road space, fuel and parking the journey really needs.",
  },
  {
    visual: <RoutesVisual />,
    title: "Same road, minutes apart",
    body: "A colleague two streets away is heading to the same gate at the same time. The route is already shared; the car simply is not.",
  },
  {
    visual: <AloneVisual />,
    title: "Everyone decides alone",
    body: "Each extra car adds minutes to everyone's journey, yet nobody can coordinate with the others. RideShare makes that coordination effortless.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative isolate bg-cream py-section">
      <SideRoutes variant="lane" />
      <div className="mx-auto max-w-wide px-gutter">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="eyebrow text-primary">The everyday commute</p>
              <h2 className="mt-4 text-title text-ink">
                Every morning, the same road. Thousands of{" "}
                <span className="font-accent text-brand-ink pr-1">empty</span> seats.
              </h2>
            </div>
            <p className="max-w-copy text-lead text-ink-soft">
              Picture the drive to work: colleagues heading to the same gate within the same ninety
              minutes, most of them alone, many on the very same roads. Nobody planned it this way.
              It is simply what happens when everyone travels separately.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-6 lg:row-span-3" delay={60}>
            <figure className="relative h-full min-h-80 overflow-hidden rounded-3xl">
              <img
                src="/images/traffic.jpg"
                alt="Morning traffic on the approach to a tech park, with most cars carrying a single person."
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy/90 via-navy/25 to-transparent" />
              <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-pill bg-paper/90 px-3.5 py-1.5 text-xs font-semibold text-ink backdrop-blur-sm">
                <Clock className="size-3.5 text-primary" />
                8:45 am · On the way to campus
              </span>
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-on-dark md:p-8">
                <p className="max-w-md text-2xl font-semibold tracking-tight md:text-3xl">
                  One gate. Ninety minutes. Thousands of cars already sharing a road.
                </p>
              </figcaption>
            </figure>
          </Reveal>

          {POINTS.map((p, i) => (
            <Reveal key={p.title} className="lg:col-span-6" delay={100 + i * 80}>
              <article className="group flex h-full flex-col gap-4 rounded-3xl bg-paper p-5 shadow-card transition-transform duration-300 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:gap-5 md:p-6">
                <div className="grid h-28 w-full shrink-0 place-items-center rounded-2xl bg-[#fbeee2] p-2 sm:h-24 sm:w-28 sm:p-0">
                  {p.visual}
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-ink">{p.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-lead text-ink">
            What if those empty seats went to the colleagues already on your road?{" "}
            <span className="font-semibold text-primary">That is the idea behind RideShare.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** A car seen from above, centred on its own origin with the nose pointing up. */
function TopCar({
  x,
  y,
  angle = 0,
  color,
  braking = false,
}: {
  x: number;
  y: number;
  angle?: number;
  color: string;
  braking?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x="-7.5" y="-12.5" width="15" height="25" rx="5.5" fill={color} />
      <path
        d="M-5.5 -6.5 Q0 -9 5.5 -6.5 L4.8 -3.2 Q0 -4.6 -4.8 -3.2 Z"
        fill="#2b2320"
        opacity="0.8"
      />
      <path d="M-4.8 6.2 Q0 7.4 4.8 6.2 L5.2 9 Q0 10.6 -5.2 9 Z" fill="#2b2320" opacity="0.55" />
      {/* The lone driver (right-hand drive) */}
      <circle
        cx="2.4"
        cy="0.6"
        r="2.3"
        fill="#fde6d6"
        stroke="#2b2320"
        strokeOpacity="0.25"
        strokeWidth="0.6"
      />
      <rect x="-6" y="-12.8" width="3" height="1.6" rx="0.8" fill="#fcd34d" />
      <rect x="3" y="-12.8" width="3" height="1.6" rx="0.8" fill="#fcd34d" />
      <rect
        x="-6"
        y="11.4"
        width="3"
        height="1.5"
        rx="0.75"
        fill={braking ? "#ef4444" : "#7c2d12"}
      />
      <rect
        x="3"
        y="11.4"
        width="3"
        height="1.5"
        rx="0.75"
        fill={braking ? "#ef4444" : "#7c2d12"}
      />
    </g>
  );
}

/** A small rounded tag with a label, for times and counts. */
function Tag({
  x,
  y,
  w,
  text,
  dark = false,
}: {
  x: number;
  y: number;
  w: number;
  text: string;
  dark?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height="14"
        rx="7"
        fill={dark ? "#c2410c" : "#fff"}
        stroke={dark ? "none" : "#f3d9c4"}
      />
      <text
        x={x + w / 2}
        y={y + 9.8}
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="700"
        fill={dark ? "#fff" : "#9a3412"}
      >
        {text}
      </text>
    </g>
  );
}

/** Four seats seen from above: the driver's seat taken, three empty. */
function SeatsVisual() {
  const seat = (x: number, y: number, taken = false) => (
    <rect
      x={x}
      y={y}
      width="11"
      height="12"
      rx="3.5"
      fill={taken ? "#fbd5bf" : "none"}
      stroke={taken ? "#c2410c" : "#f0a878"}
      strokeWidth="1.4"
      strokeDasharray={taken ? undefined : "2.4 2"}
    />
  );
  return (
    <svg viewBox="0 0 96 80" className="size-full p-1" aria-hidden>
      {/* Wheels and mirrors */}
      <g fill="#3f3631">
        <rect x="28" y="15" width="4" height="11" rx="2" />
        <rect x="64" y="15" width="4" height="11" rx="2" />
        <rect x="28" y="54" width="4" height="11" rx="2" />
        <rect x="64" y="54" width="4" height="11" rx="2" />
      </g>
      <rect x="25.5" y="28" width="5" height="3" rx="1.5" fill="#e8956a" />
      <rect x="65.5" y="28" width="5" height="3" rx="1.5" fill="#e8956a" />
      {/* Body */}
      <rect
        x="31"
        y="5"
        width="34"
        height="70"
        rx="13"
        fill="#fff"
        stroke="#f3c3a3"
        strokeWidth="1.5"
      />
      <path d="M36 20 Q48 14 60 20 L58 26 Q48 23 38 26 Z" fill="#2b2320" opacity="0.85" />
      <path d="M38 63 Q48 66 58 63 L59 68 Q48 71.5 37 68 Z" fill="#2b2320" opacity="0.5" />
      {/* Seats: driver on the right, three empty */}
      {seat(35.5, 30)}
      {seat(49.5, 30, true)}
      {seat(35.5, 46)}
      {seat(49.5, 46)}
      <path d="M50.5 42 Q55 37.5 59.5 42" fill="#c2410c" />
      <circle cx="55" cy="35.4" r="3.6" fill="#c2410c" />
      <Tag x={62} y={60} w={31} text="3 empty" dark />
    </svg>
  );
}

/** Two colleagues on the same road to the same gate, three minutes apart. */
function RoutesVisual() {
  const road = "M2 74 C 26 72, 30 46, 48 40 S 74 26, 84 12";
  return (
    <svg viewBox="0 0 96 80" className="size-full p-1" aria-hidden>
      <path d={road} fill="none" stroke="#3f3631" strokeWidth="12" strokeLinecap="round" />
      <path
        d={road}
        fill="none"
        stroke="#fff"
        strokeOpacity="0.75"
        strokeWidth="1.2"
        strokeDasharray="3 3.5"
      />
      <TopCar x={22} y={63} angle={52} color="#c2410c" />
      <TopCar x={62} y={31} angle={42} color="#e8956a" />
      <Tag x={2} y={40} w={25} text="8:40" />
      <Tag x={68} y={40} w={25} text="8:43" />
      {/* The shared destination */}
      <path
        d="M84 2.5 a6 6 0 0 1 6 6 c0 4.5 -6 10.5 -6 10.5 s-6 -6 -6 -10.5 a6 6 0 0 1 6 -6 z"
        fill="#c2410c"
      />
      <circle cx="84" cy="8.5" r="2.2" fill="#fff" />
    </svg>
  );
}

/** Three cars, three lone drivers, all braking in the same queue. */
function AloneVisual() {
  return (
    <svg viewBox="0 0 96 80" className="size-full p-1" aria-hidden>
      <rect x="6" y="20" width="84" height="58" rx="10" fill="#3f3631" />
      <g stroke="#fff" strokeOpacity="0.6" strokeWidth="1.2" strokeDasharray="4 4">
        <path d="M34 24 V76" />
        <path d="M62 24 V76" />
      </g>
      <TopCar x={20} y={52} color="#c2410c" braking />
      <TopCar x={48} y={46} color="#e8956a" braking />
      <TopCar x={76} y={55} color="#f5b98f" braking />
      <Tag x={30} y={3} w={36} text="+4 min" dark />
      <path d="M48 17 v3" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
