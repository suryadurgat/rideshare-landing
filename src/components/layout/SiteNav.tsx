import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Wordmark } from "./Wordmark";

const LINKS = [
  { href: "/#why", label: "Why RideShare" },
  { href: "/#costs", label: "Pricing" },
  { href: "/#how", label: "How it works" },
  { href: "/#app", label: "Inside the app" },
  { href: "/#safety", label: "Safety" },
  { href: "/#workplaces", label: "For workplaces" },
  { href: "/#dashboards", label: "Dashboards" },
  { href: "/#faq", label: "FAQ" },
] as const;

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    if (pathname !== "/") {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4">
        <div
          className={cn(
            "pointer-events-auto max-w-[calc(100vw-1.5rem)] overflow-hidden bg-ink text-on-dark shadow-nav [interpolate-size:allow-keywords]",
            "transition-[border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "w-[min(40rem,calc(100vw-1.5rem))]",
            open ? "rounded-[2rem]" : "rounded-[2.4rem]",
          )}
        >
          <nav
            className="flex items-center justify-between gap-2 py-2 pr-2 pl-2.5"
            aria-label="Primary"
          >
            <Link
              to="/"
              className="flex min-h-14 min-w-0 items-center gap-2 rounded-pill pr-1 pl-1 sm:gap-3 sm:pr-3"
              aria-label="RideShare home"
              onClick={() => setOpen(false)}
            >
              <img
                src="/logo.png"
                alt=""
                width={44}
                height={44}
                className="size-10 shrink-0 rounded-xl bg-paper object-contain p-1 sm:size-11"
              />
              <Wordmark className="text-xl max-[359px]:hidden sm:text-2xl" />
            </Link>

            <div className="flex shrink-0 items-center">
              <div
                className={cn(
                  "grid transition-[grid-template-columns,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  scrolled && !open ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0",
                )}
              >
                <div className="min-w-0 overflow-hidden">
                  <Link
                    to="/login"
                    tabIndex={scrolled && !open ? 0 : -1}
                    className={cn(buttonVariants({ variant: "solid", size: "lg" }), "mx-1 max-sm:h-11 max-sm:px-4 max-sm:text-sm")}
                  >
                    Sign in
                  </Link>
                </div>
              </div>

              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="site-menu"
                onClick={() => setOpen((v) => !v)}
                className="relative grid size-12 place-items-center rounded-pill text-on-dark hover:bg-white/10 sm:size-14"
              >
                <span className="relative size-6">
                  <Menu
                    className={cn(
                      "absolute inset-0 size-6 transition-[opacity,transform,filter] duration-300",
                      open ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-0",
                    )}
                  />
                  <X
                    className={cn(
                      "absolute inset-0 size-6 transition-[opacity,transform,filter] duration-300",
                      open ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]",
                    )}
                  />
                </span>
              </button>
            </div>
          </nav>

          <div
            id="site-menu"
            className={cn(
              "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
            inert={!open}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-col border-t border-white/10 p-2">
                {LINKS.map((l, i) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3.5 text-base font-medium text-on-dark transition-[opacity,transform,background-color] duration-300 hover:bg-white/10",
                      open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                    )}
                    style={{ transitionDelay: open ? `${120 + i * 35}ms` : "0ms" }}
                  >
                    {l.label}
                  </a>
                ))}
                <div
                  className={cn(
                    "mt-2 grid gap-2 border-t border-white/10 p-2 pt-4 transition-[opacity,transform] duration-300",
                    open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                  )}
                  style={{ transitionDelay: open ? "340ms" : "0ms" }}
                >
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: "primary", size: "lg" })}
                  >
                    Sign in with your work email
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "ring-white/20")}
                  >
                    Bring RideShare to your workplace
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
