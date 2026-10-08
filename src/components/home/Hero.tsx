import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { HeroFareCard } from "./HeroFareCard";
import { HeroVideo } from "./HeroVideo";
import { Partners } from "@/components/layout/Partners";

const ROUTES = [
  "Madhapur → Gachibowli",
  "Kukatpally → HITEC City",
  "Kondapur → Financial District",
  "Miyapur → Mindspace, Raidurg",
  "Ameerpet → Madhapur",
  "Manikonda → Nanakramguda",
  "Begumpet → Gachibowli",
  "Hafeezpet → Kondapur",
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-on-dark">
      <HeroVideo />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,rgba(23,18,15,0.92)_0%,rgba(23,18,15,0.7)_45%,rgba(23,18,15,0.25)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-navy to-transparent"
        aria-hidden
      />

      <div className="mx-auto grid min-h-dvh max-w-wide items-center gap-12 px-gutter pt-28 pb-24 xl:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="eyebrow rounded-pill bg-white/8 px-3 py-1.5 text-on-dark/85 ring-1 ring-white/15 backdrop-blur-sm">
            <span className="size-1.5 rounded-pill bg-sky" />
            Closed-community commute carpooling
          </p>
          <h1 className="mt-6 max-w-2xl font-display text-hero">
            Your colleague is <span className="text-brand-gradient">already</span> driving your
            route.
          </h1>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/login"
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "group min-h-12")}
            >
              Sign in with your work email
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/contact"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "min-h-12")}
            >
              Bring RideShare to your workplace
            </Link>
          </div>
          <p className="mt-8 flex max-w-md items-start gap-2 text-sm leading-relaxed text-on-dark/70">
            <BadgeCheck className="mt-0.5 size-4 shrink-0 text-sky" />
            Every account belongs to a verified organisation and campus. There is no public sign-up,
            and no strangers.
          </p>
          <Partners className="mt-6 border-t border-white/10 pt-6" />
        </div>

        <HeroFareCard />
      </div>

      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-white/10 bg-navy/60 py-3.5 backdrop-blur-md">
        <div className="flex w-max animate-marquee gap-10 pr-10 text-sm text-on-dark/60">
          {[...ROUTES, ...ROUTES].map((r, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap">
              <Navigation className="size-3.5 text-sky" />
              {r}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
