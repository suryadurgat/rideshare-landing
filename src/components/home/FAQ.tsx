import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus, Search, X } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
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
  SAMPLE_TRIP,
  SHORT_HOP_KM,
} from "@/lib/fare";
import { Reveal } from "./Reveal";

type Item = { q: string; brief: string; a: string };
type Group = { id: string; label: string; note: string; items: Item[] };

const sampleFare = computeFare(SAMPLE_TRIP.km);
const sampleCab = computeCabFare(SAMPLE_TRIP.km);

const GROUPS: Group[] = [
  {
    id: "start",
    label: "Getting started",
    note: "Eligibility, registration and matching",
    items: [
      {
        q: "Who is eligible to join RideShare?",
        brief: "Verified employees only.",
        a: "RideShare is available exclusively to employees of registered organisations. You sign in with your work email address, and your organisation and campus are linked to your account automatically. As there is no public registration, every person you travel with is a verified colleague.",
      },
      {
        q: "How can my organisation adopt RideShare?",
        brief: "It begins with a single conversation.",
        a: "Ask your HR, facilities or transport team to contact us, or write to us directly through the contact page. We then configure your organisation's campuses, administrators and safety team, and support you in introducing the programme to employees.",
      },
      {
        q: "Do I need a car to use RideShare?",
        brief: "No. Most members travel as passengers.",
        a: "Most members travel as passengers. If you drive, you can switch to driver mode at any time and offer the spare seats on a journey you are already making.",
      },
      {
        q: "How long does it take to find a match?",
        brief: "Usually a matter of minutes.",
        a: "RideShare matches you with colleagues travelling the same route shortly after you submit a request, so there is no need to book in advance. An on-screen countdown shows how long your request remains open.",
      },
    ],
  },
  {
    id: "fares",
    label: "Fares and payment",
    note: "How fares are calculated and paid",
    items: [
      {
        q: "How is the fare calculated?",
        brief: `${formatInr(FARE_RATE_PER_KM_INR)} per kilometre, per seat.`,
        a: `Every fare follows a published formula: ${formatInr(FARE_RATE_PER_KM_INR)} per kilometre, per seat, with a minimum of ${formatInr(FARE_MIN_SHORT_INR)} for trips of up to ${SHORT_HOP_KM} km and ${formatInr(FARE_MIN_INR)} for longer trips. These are the platform defaults, and each organisation may set its own. The rates in force are recorded with every payment, so any fare can be explained precisely, even months later.`,
      },
      {
        q: "How much can I save compared with an app cab?",
        brief: `${formatInr(sampleFare)} instead of about ${formatInr(sampleCab)}.`,
        a: `A journey from ${SAMPLE_TRIP.pickup.place} to ${SAMPLE_TRIP.drop.place} (${SAMPLE_TRIP.km} km) costs ${formatInr(sampleFare)} with RideShare, compared with approximately ${formatInr(sampleCab)} by app cab. Our cab estimate (${formatInr(CAB_BASE_INR)} for the first ${CAB_BASE_KM} km, then ${formatInr(CAB_PER_KM_INR)} per km) excludes surge pricing, so savings at peak hours are typically greater.`,
      },
      {
        q: "How do I pay the driver?",
        brief: "Directly by UPI, with no commission.",
        a: "You pay the driver directly at the end of the journey, using the UPI ID shown on their profile. There is no wallet to top up, and RideShare takes no share of the fare.",
      },
      {
        q: "What if the driver takes a longer route?",
        brief: "You pay only for your own distance.",
        a: "Your fare is based on the distance between your own pickup and drop-off points, not on the driver's total journey. A detour to collect another passenger never increases your fare.",
      },
      {
        q: "Why is the fare lower than a taxi fare?",
        brief: "Drivers share costs; they do not profit.",
        a: "Drivers are colleagues making a journey they would make in any case. The fare simply recovers part of their fuel, toll and vehicle costs, which is why it is a fraction of a commercial fare.",
      },
    ],
  },
  {
    id: "safety",
    label: "Safety and trust",
    note: "SOS, privacy and fair matching",
    items: [
      {
        q: "What should I do if I feel unsafe during a ride?",
        brief: "Tap SOS, available on every screen.",
        a: "Tap SOS from any screen. After a single confirmation, your live location and ride details are sent immediately to the Cyberabad Police console and to your organisation's safety team, and the alert is tracked until it is resolved.",
      },
      {
        q: "Is there a women-only option?",
        brief: "Yes, for women drivers.",
        a: "Women drivers can enable women-only passengers in their settings, so that they are matched exclusively with women colleagues. The setting applies when driving and does not affect who collects you when you travel as a passenger.",
      },
      {
        q: "Can I choose who I travel with?",
        brief: "Colleagues only, and blocking is permanent.",
        a: "You travel only with verified colleagues from your own organisation. You may also block any member permanently, in both directions, without giving a reason, and the two of you will never be matched again.",
      },
      {
        q: "What information can my employer see?",
        brief: "Programme data for your organisation only.",
        a: "Your organisation's administrators see programme figures for their own organisation and campuses, such as rides completed, seats shared, participation and the most active drivers, together with SOS alerts and the audit record. Their access does not extend beyond your organisation.",
      },
      {
        q: "How are seats allocated fairly?",
        brief: "Waiting time carries the most weight.",
        a: "Waiting passengers are ranked by waiting time (50%), detour distance (35%) and rating (15%). Because waiting time carries the greatest weight, no one is repeatedly passed over in favour of more convenient passengers.",
      },
    ],
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);

export function FAQ() {
  const [groupId, setGroupId] = useState(GROUPS[0].id);
  const [open, setOpen] = useState<string | null>(GROUPS[0].items[0].q);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const group = GROUPS.find((g) => g.id === groupId) ?? GROUPS[0];
  const list: (Item & { group: string })[] = searching
    ? GROUPS.flatMap((g) =>
        g.items
          .filter((i) => `${i.q} ${i.brief} ${i.a}`.toLowerCase().includes(q))
          .map((i) => ({ ...i, group: g.label })),
      )
    : group.items.map((i) => ({ ...i, group: group.label }));

  function selectGroup(id: string) {
    setGroupId(id);
    setQuery("");
    setOpen(GROUPS.find((g) => g.id === id)?.items[0]?.q ?? null);
  }

  return (
    <section id="faq" className="relative isolate overflow-hidden bg-navy py-section text-on-dark">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(44rem_30rem_at_8%_10%,rgba(253,186,116,0.14),transparent_65%),radial-gradient(40rem_30rem_at_100%_100%,rgba(251,191,36,0.08),transparent_60%)]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -right-6 -bottom-24 font-accent text-[22rem] leading-none text-white/[0.03] select-none"
        aria-hidden
      >
        ?
      </span>

      <div className="mx-auto grid max-w-site gap-12 px-gutter lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] lg:gap-16">
        {/* Heading, search and topics */}
        <Reveal className="min-w-0">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-accent-bright">Frequently asked questions</p>
            <h2 className="mt-4 text-title">
              Questions, clearly <span className="font-accent text-accent-bright">answered</span>.
            </h2>
            <p className="mt-4 max-w-md text-on-dark/65">
              {TOTAL} answers to the questions we hear most often from employees and the
              organisations they work for.
            </p>

            <label className="relative mt-8 block max-w-md">
              <span className="sr-only">Search the questions</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-on-dark/45" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(null);
                }}
                placeholder="Search, e.g. UPI, SOS, women-only"
                className="h-12 w-full rounded-pill bg-white/[0.06] pr-11 pl-11 text-sm text-on-dark ring-1 ring-white/10 transition-shadow outline-none placeholder:text-on-dark/40 focus:bg-white/[0.09] focus:ring-2 focus:ring-accent-bright [&::-webkit-search-cancel-button]:hidden"
              />
              {searching ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-pill text-on-dark/60 hover:bg-white/10 hover:text-on-dark"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </label>

            <div
              className={cn(
                "mt-6 flex flex-col gap-1 transition-opacity duration-300",
                searching && "opacity-40",
              )}
              role="tablist"
              aria-label="Question topics"
            >
              {GROUPS.map((g, i) => {
                const active = !searching && g.id === groupId;
                return (
                  <button
                    key={g.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => selectGroup(g.id)}
                    className={cn(
                      "group relative flex w-full items-center gap-4 rounded-2xl px-4 py-2.5 text-left transition-colors duration-300 lg:py-3",
                      active ? "bg-white/[0.07]" : "hover:bg-white/[0.04]",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-y-3 left-0 w-0.5 origin-center rounded-pill bg-accent-bright transition-transform duration-500",
                        active ? "scale-y-100" : "scale-y-0",
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        "font-display text-2xl font-semibold tabular-nums transition-colors duration-300",
                        active ? "text-accent-bright" : "text-on-dark/25 group-hover:text-on-dark/45",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className={cn("block text-sm font-semibold whitespace-nowrap", active ? "text-on-dark" : "text-on-dark/70")}>
                        {g.label}
                      </span>
                      <span className="hidden text-xs text-on-dark/45 lg:block">
                        {g.note} · {g.items.length} questions
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <Link
              to="/contact"
              className="group mt-8 inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-bright underline-offset-4 hover:underline"
            >
              Still have a question? Speak to our team
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>

        {/* Questions and answers */}
        <div key={searching ? `search-${q}` : group.id} className="min-w-0">
          <p className="mb-4 text-xs font-semibold tracking-wider text-on-dark/45 uppercase" aria-live="polite">
            {searching
              ? `${list.length} ${list.length === 1 ? "result" : "results"} for “${query.trim()}”`
              : `${group.label} · ${group.items.length} questions`}
          </p>

          {list.length === 0 ? (
            <div className="animate-page-in rounded-3xl bg-white/[0.04] p-8 text-center ring-1 ring-white/10">
              <p className="font-semibold">No answers match your search.</p>
              <p className="mt-2 text-sm text-on-dark/60">
                Try a different word, or{" "}
                <Link to="/contact" className="font-semibold text-accent-bright underline underline-offset-4">
                  ask our team directly
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {list.map((item, i) => (
                <li key={item.q} className="animate-page-in" style={{ animationDelay: `${i * 70}ms` }}>
                  <QA
                    item={item}
                    index={i}
                    tag={searching ? item.group : undefined}
                    query={q}
                    open={open === item.q}
                    onToggle={() => setOpen((cur) => (cur === item.q ? null : item.q))}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function QA({
  item,
  index,
  tag,
  query,
  open,
  onToggle,
}: {
  item: Item;
  index: number;
  tag?: string;
  query: string;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  return (
    <div
      className={cn(
        "rounded-3xl ring-1 transition-[background-color,box-shadow] duration-500",
        open
          ? "bg-[#f7efe6] text-ink shadow-[0_30px_70px_-35px_rgba(0,0,0,0.9)] ring-transparent"
          : "bg-white/[0.04] ring-white/10 hover:bg-white/[0.07]",
      )}
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex w-full items-center gap-4 px-5 py-5 text-left md:px-7"
        >
          <span
            className={cn(
              "w-8 shrink-0 font-display text-sm font-semibold tabular-nums transition-colors duration-500",
              open ? "text-accent" : "text-on-dark/35",
            )}
          >
            Q{String(index + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1">
            {tag ? (
              <span
                className={cn(
                  "mb-1 block text-[0.7rem] font-semibold tracking-wider uppercase",
                  open ? "text-[#9a3412]" : "text-accent-bright/80",
                )}
              >
                {tag}
              </span>
            ) : null}
            <span className="block font-semibold tracking-tight md:text-lg">
              <Highlight text={item.q} query={query} />
            </span>
          </span>
          <span
            aria-hidden
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-pill transition-[transform,background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              open ? "rotate-45 bg-[#1c1917] text-accent-bright" : "bg-white/[0.07] text-on-dark/70",
            )}
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>

      {/* Smooth height: the grid row animates from 0fr to 1fr */}
      <div
        id={id}
        role="region"
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "px-5 pb-7 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:pr-20 md:pl-[4.75rem]",
              open ? "translate-y-0" : "-translate-y-2",
            )}
          >
            <p className="font-accent text-2xl leading-snug text-[#9a3412] md:text-[1.7rem]">
              <Highlight text={item.brief} query={query} />
            </p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
              <Highlight text={item.a} query={query} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Marks every occurrence of the search term. */
function Highlight({ text, query }: { text: string; query: string }): ReactNode {
  if (!query) return text;
  const parts: ReactNode[] = [];
  const lower = text.toLowerCase();
  let from = 0;
  let at = lower.indexOf(query);
  while (at !== -1) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(
      <mark key={at} className="rounded bg-accent-bright/60 px-0.5 text-inherit">
        {text.slice(at, at + query.length)}
      </mark>,
    );
    from = at + query.length;
    at = lower.indexOf(query, from);
  }
  parts.push(text.slice(from));
  return parts;
}
