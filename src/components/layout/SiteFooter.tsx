import { Link } from "@tanstack/react-router";
import { ArrowUp, ArrowUpRight, Car, Mail } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { PARTNERS } from "./Partners";
import { Wordmark } from "./Wordmark";

const EXPLORE = [
  { href: "/#why", label: "Why RideShare" },
  { href: "/#how", label: "How it works" },
  { href: "/#app", label: "Inside the app" },
  { href: "/#costs", label: "Pricing" },
  { href: "/#safety", label: "Safety" },
] as const;

const WORKPLACE = [
  { href: "/#workplaces", label: "For workplaces" },
  { href: "/#dashboards", label: "Dashboards" },
  { href: "/#faq", label: "FAQs" },
  { href: "/#feedback", label: "Share your feedback" },
] as const;

/** Hyderabad time, and what the city's commute is doing at that hour. */
function useCommuteClock() {
  const [now, setNow] = useState<{ time: string; mood: string } | null>(null);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const time = d.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const hour = Number(
        d.toLocaleString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false }),
      );
      const mood =
        hour >= 7 && hour < 11
          ? "The morning commute is under way"
          : hour >= 16 && hour < 21
            ? "The evening commute is under way"
            : hour >= 11 && hour < 16
              ? "Colleagues are planning the journey home"
              : "Tomorrow's shared rides are taking shape";
      setNow({ time, mood });
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function SiteFooter() {
  const clock = useCommuteClock();

  return (
    <footer className="relative isolate overflow-hidden bg-navy text-on-dark">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_30rem_at_85%_0%,rgba(251,146,60,0.16),transparent_65%),radial-gradient(40rem_26rem_at_0%_100%,rgba(244,63,94,0.12),transparent_65%)]"
        aria-hidden
      />

      {/* The road along the top edge, with a car making its way across */}
      <div className="relative h-14" aria-hidden>
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
        <div className="footer-lane absolute inset-x-0 top-1/2 h-px" />
        <span className="footer-car absolute top-1/2 grid size-9 place-items-center rounded-pill bg-accent-bright text-[#1c1917] shadow-[0_0_30px_rgba(253,186,116,0.55)]">
          <Car className="size-4" />
        </span>
      </div>

      <div className="mx-auto max-w-wide px-gutter pt-10 md:pt-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)] lg:gap-16">
          {/* Brand and partners */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label="RideShare home">
              <span className="grid size-14 place-items-center rounded-2xl bg-white">
                <img src="/logo.png" alt="" width={985} height={1154} className="h-10 w-auto object-contain" />
              </span>
              <Wordmark tone="plain" className="text-4xl" />
            </Link>
            <p className="mt-5 max-w-sm leading-relaxed text-on-dark/65">
              Shared journeys between colleagues, from the first search to the final record.
              Calmer commutes, fairer fares and fewer cars at the gate.
            </p>

            <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-accent-bright uppercase">
              An initiative of
            </p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {PARTNERS.map((p) => (
                <li
                  key={p.name}
                  className="flex items-center gap-3 rounded-2xl bg-white/[0.05] py-2 pr-4 pl-2 ring-1 ring-white/10"
                >
                  <img
                    src={p.logo}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 rounded-xl bg-white object-contain p-1"
                  />
                  <span className="max-w-36 text-xs leading-snug font-medium text-on-dark/80">{p.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            <FooterColumn title="Explore">
              {EXPLORE.map((l) => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
            </FooterColumn>
            <FooterColumn title="Workplace">
              {WORKPLACE.map((l) => (
                <FooterLink key={l.href} href={l.href}>
                  {l.label}
                </FooterLink>
              ))}
              <FooterLink to="/contact">Register your organisation</FooterLink>
            </FooterColumn>
            <FooterColumn title="Legal">
              <FooterLink to="/privacy">Privacy policy</FooterLink>
              <FooterLink to="/terms">Terms and conditions</FooterLink>
              <li className="pt-4">
                <Link
                  to="/login"
                  className="group inline-flex min-h-11 items-center gap-2 rounded-pill bg-accent-bright px-5 text-sm font-semibold text-[#1c1917] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#fed7aa]"
                >
                  Sign in
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            </FooterColumn>
          </div>
        </div>

        {/* Live commute clock, contact and back to top */}
        <div className="mt-14 flex flex-col gap-5 rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 lg:flex-row lg:items-center lg:justify-between lg:px-7">
          <div className="flex items-center gap-4">
            <span className="relative grid size-11 shrink-0 place-items-center rounded-pill bg-accent-bright/15">
              <span className="absolute size-2.5 animate-ping rounded-pill bg-accent-bright/70" />
              <span className="size-2.5 rounded-pill bg-accent-bright" />
            </span>
            <div aria-live="off">
              <p className="text-sm font-semibold">
                Hyderabad{clock ? <span className="text-on-dark/60 tabular-nums"> · {clock.time}</span> : null}
              </p>
              <p className="text-sm text-on-dark/60">{clock?.mood ?? "Shared rides, every working day"}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="group inline-flex min-h-11 items-center gap-2 rounded-pill px-4 text-sm font-medium text-on-dark/85 ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:text-on-dark"
            >
              <Mail className="size-4 text-accent-bright" />
              Contact our team
            </Link>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group inline-flex min-h-11 items-center gap-2 rounded-pill px-4 text-sm font-medium text-on-dark/85 ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:text-on-dark"
            >
              <ArrowUp className="size-4 text-accent-bright transition-transform duration-300 group-hover:-translate-y-0.5" />
              Back to top
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-xs text-on-dark/50 md:flex-row md:justify-between">
          <p>
            An initiative of the Cyberabad Police Commissionerate and the Society for Cyberabad
            Security Council (SCSC).
          </p>
          <p>© {new Date().getFullYear()} RideShare · Built in Hyderabad · All rights reserved</p>
        </div>
      </div>

      {/* The oversized wordmark, rising from the bottom edge */}
      <p
        className="footer-giant pointer-events-none mt-6 -mb-[0.2em] text-center font-display text-[19.5vw] leading-[0.85] font-semibold tracking-[-0.04em] select-none"
        aria-hidden
      >
        RideShare
      </p>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-on-dark/45 uppercase">{title}</p>
      <ul className="mt-4 space-y-1.5">{children}</ul>
    </div>
  );
}

const LINK_CLASS =
  "group inline-flex min-h-9 items-center gap-1.5 text-on-dark/80 transition-colors duration-300 hover:text-on-dark";

function LinkInner({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="relative">
        {children}
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-bright transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
      </span>
      <ArrowUpRight className="size-3.5 -translate-x-1 text-accent-bright opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
    </>
  );
}

function FooterLink({ href, to, children }: { href?: string; to?: "/contact" | "/privacy" | "/terms"; children: ReactNode }) {
  return (
    <li>
      {to ? (
        <Link to={to} className={LINK_CLASS}>
          <LinkInner>{children}</LinkInner>
        </Link>
      ) : (
        <a href={href} className={LINK_CLASS}>
          <LinkInner>{children}</LinkInner>
        </a>
      )}
    </li>
  );
}
