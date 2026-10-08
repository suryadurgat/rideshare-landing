import { BadgeCheck, Calculator, HandCoins } from "lucide-react";

const POINTS = [
  { icon: BadgeCheck, title: "Work email only", body: "No public sign-up, ever" },
  { icon: Calculator, title: "Fare by formula", body: "Nobody types an amount in" },
  { icon: HandCoins, title: "Paid to the driver", body: "No wallet, no platform cut" },
];

/** A quiet band between the hero and the argument. It should never grow into a feature section. */
export function TrustStrip() {
  return (
    <section aria-label="Key facts" className="border-b border-line bg-paper">
      <ul className="mx-auto grid max-w-site divide-y divide-line px-gutter sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {POINTS.map((p) => (
          <li key={p.title} className="flex items-center justify-center gap-3 py-5 sm:px-4">
            <p.icon className="size-5 shrink-0 text-primary" strokeWidth={1.75} />
            <p className="text-sm">
              <span className="font-semibold text-ink">{p.title}</span>
              <span className="text-ink-soft"> · {p.body}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
