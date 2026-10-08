import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
};

export function Reveal({ children, className, delay = 0, once = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Show as soon as the top edge enters the viewport, however tall the block is, and
        // show anything already scrolled past (for example after jumping to an anchor).
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
        shown ? "translate-y-0 opacity-100 blur-0" : "translate-y-5 opacity-0 blur-[4px]",
        className,
      )}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
