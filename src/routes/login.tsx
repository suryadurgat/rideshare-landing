import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: LoginPage });

export function LoginPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="relative min-h-dvh bg-navy">
      <img
        src="/images/hero.jpg"
        alt=""
        className="absolute inset-0 size-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-navy/70" />
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-gutter py-28">
        <div className="animate-page-in rounded-2xl bg-paper p-7 shadow-card md:p-8">
          <img src="/logo.png" alt="" className="h-12 w-11 object-contain" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Sign in with your work email</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            RideShare is a corporate carpooling platform available by invitation only. There is
            no public sign-up.
          </p>

          {submitted ? (
            <div className="mt-6 animate-page-in rounded-xl bg-paper-2 p-4 text-sm leading-relaxed text-ink-soft">
              <p className="font-semibold text-ink">This email address is not registered with RideShare.</p>
              <p className="mt-2">
                We could not find <span className="font-medium text-ink">{email}</span> among
                our verified organisations. If your workplace already uses RideShare, please
                contact the administrator who invited you. Otherwise, you can{" "}
                <Link to="/contact" className="font-semibold text-primary underline">
                  bring RideShare to your campus
                </Link>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 grid gap-4">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium">Work email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-11 rounded-lg bg-paper-2 px-3 text-sm text-ink shadow-[0_0_0_1px_rgba(17,19,24,0.1)] outline-none focus:shadow-[0_0_0_2px_var(--color-primary)]"
                />
              </label>
              <Button type="submit" variant="dark" className="w-full">
                Continue
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
