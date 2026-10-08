import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import type { ReactNode } from "react";

export type LegalSection = { id: string; title: string; body: ReactNode };

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <main className="bg-paper pt-32 pb-section">
      <div className="mx-auto max-w-site px-gutter">
        <header className="max-w-3xl animate-page-in">
          <p className="eyebrow text-primary">{eyebrow}</p>
          <h1 className="mt-4 text-title">{title}</h1>
          <p className="mt-4 text-lead text-ink-soft">{intro}</p>
          <p className="mt-4 text-sm text-muted">Last updated: {updated}</p>
          <div className="mt-6 flex gap-3 rounded-2xl bg-[#fff8eb] p-4 text-sm leading-relaxed text-[#7a4a00] ring-1 ring-[#f5d9a8]">
            <FileText className="mt-0.5 size-4 shrink-0" />
            <p>
              <strong className="font-semibold">Draft for legal review.</strong> This document
              describes how RideShare works today. It will be finalised, with our registered
              company details, after review by our legal advisers.
            </p>
          </div>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs font-semibold tracking-wider text-muted uppercase">On this page</p>
            <ol className="mt-3 space-y-1 border-l border-line">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-px flex min-h-9 items-center gap-2 border-l-2 border-transparent pl-3 text-sm text-ink-soft hover:border-primary hover:text-ink"
                  >
                    <span className="text-xs text-muted tabular-nums">{i + 1}.</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="legal max-w-3xl">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="border-b border-line py-8 first:pt-0 last:border-0">
                <h2 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  <span className="mr-2 text-primary tabular-nums">{i + 1}.</span>
                  {s.title}
                </h2>
                <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">{s.body}</div>
              </section>
            ))}
            <p className="mt-6 text-sm text-muted">
              Questions about this document? Please{" "}
              <Link to="/contact" className="font-semibold text-primary underline underline-offset-4">
                contact our team
              </Link>
              .
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-primary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
