import { Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";

export type Review = {
  name: string;
  /** For example "Software engineer, Gachibowli campus". */
  role: string;
  quote: string;
  /** Whole stars, 1 to 5. */
  rating: number;
};

/**
 * Real reviews only, published with the reviewer's permission. The section stays hidden
 * while this list is empty, and the summary card is calculated from these entries, so it
 * can never show a rating or review count that the list does not support.
 */
export const REVIEWS: Review[] = [];

export function Reviews() {
  if (REVIEWS.length === 0) return null;

  const average = REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;

  return (
    <section id="reviews" className="bg-paper py-section">
      <div className="mx-auto max-w-wide px-gutter">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-primary">What members say</p>
            <h2 className="mt-4 text-title">
              Heard from our <span className="font-accent">riders</span>.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-4 [&>*]:mb-4">
          <Reveal className="break-inside-avoid">
            <div className="rounded-3xl bg-navy p-7 text-center text-on-dark">
              <Stars rating={Math.round(average)} />
              <p className="mt-3 text-5xl font-bold tracking-tight tabular-nums">
                {average.toFixed(1)}
              </p>
              <p className="mt-1 text-sm text-on-dark/70">
                Average of {REVIEWS.length} {REVIEWS.length === 1 ? "review" : "reviews"}
              </p>
            </div>
          </Reveal>
          {REVIEWS.map((r, i) => (
            <Reveal key={`${r.name}-${i}`} className="break-inside-avoid" delay={(i % 4) * 70}>
              <figure className="rounded-3xl bg-paper-2 p-6 ring-1 ring-line">
                <Quote className="size-6 text-primary/40" />
                <blockquote className="mt-3 leading-relaxed text-ink">{r.quote}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-pill bg-brand-gradient text-sm font-bold text-on-dark">
                    {r.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{r.name}</span>
                    <span className="block text-xs text-muted">{r.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex justify-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={i < rating ? "size-5 fill-sky text-sky" : "size-5 text-on-dark/25"}
        />
      ))}
    </div>
  );
}
