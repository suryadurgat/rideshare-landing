import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({ component: ContactPage });

function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main className="bg-paper pt-28 pb-20">
      <div className="mx-auto grid max-w-site animate-page-in gap-12 px-gutter lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            For workplaces
          </p>
          <h1 className="mt-3 text-title">Bring RideShare to your campus</h1>
          <p className="mt-4 max-w-copy text-lead text-ink-soft">
            RideShare is available by invitation only, with no public sign-up. If you manage
            commuting for a campus, or would like your organisation to offer RideShare, share a
            few details and our team will be in touch.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ink-soft">
            <li>Role-based administration across organisations and campuses.</li>
            <li>A dedicated SOS console to acknowledge and resolve alerts.</li>
            <li>Transparent, formula-based fares that are never set manually.</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-paper-2 p-6 shadow-card md:p-8">
          {sent ? (
            <div className="animate-page-in py-8">
              <h2 className="text-xl font-semibold tracking-tight">Thank you. We have received your message.</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                A member of our team will reply to the work email address you provided. If
                your organisation already uses RideShare, please sign in with that email instead.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              <Field label="Your name" name="name" autoComplete="name" required />
              <Field
                label="Work email"
                name="email"
                type="email"
                autoComplete="email"
                required
                hint="Please use your company email address, not a personal one."
              />
              <Field label="Organisation" name="org" required />
              <label className="grid gap-1.5">
                <span className="text-sm font-medium">Number of campuses to start with</span>
                <select
                  name="campuses"
                  className="h-11 rounded-lg bg-paper px-3 text-sm text-ink shadow-[0_0_0_1px_rgba(17,19,24,0.1)] outline-none focus:shadow-[0_0_0_2px_var(--color-primary)]"
                  defaultValue="1"
                >
                  <option value="1">One campus</option>
                  <option value="2-5">Two to five</option>
                  <option value="6+">Six or more</option>
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium">How can we help?</span>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="rounded-lg bg-paper px-3 py-2 text-sm text-ink shadow-[0_0_0_1px_rgba(17,19,24,0.1)] outline-none focus:shadow-[0_0_0_2px_var(--color-primary)]"
                />
              </label>
              <Button type="submit" variant="dark" className="mt-2 w-full">
                Send message
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  hint,
  ...props
}: {
  label: string;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        {...props}
        className="h-11 rounded-lg bg-paper px-3 text-sm text-ink shadow-[0_0_0_1px_rgba(17,19,24,0.1)] outline-none focus:shadow-[0_0_0_2px_var(--color-primary)]"
      />
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}
