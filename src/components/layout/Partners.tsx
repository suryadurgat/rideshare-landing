import { cn } from "@/lib/utils";

export const PARTNERS = [
  {
    name: "Cyberabad Police Commissionerate",
    short: "Cyberabad Police",
    logo: "/images/partners/cyberabad-police.png",
  },
  {
    name: "Society for Cyberabad Security Council",
    short: "SCSC",
    logo: "/images/partners/scsc.png",
  },
] as const;

/** "An initiative of" with both partner emblems. For dark backgrounds. */
export function Partners({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5", className)}>
      <p className="text-xs font-semibold tracking-wider text-on-dark/60 uppercase">
        An initiative of
      </p>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {PARTNERS.map((p) => (
          <li key={p.name} className="flex items-center gap-2.5">
            <img
              src={p.logo}
              alt=""
              width={64}
              height={64}
              className="size-16 rounded-2xl bg-white object-contain p-1.5 ring-1 ring-white/15"
            />
            <span className="max-w-40 text-sm leading-tight font-medium text-on-dark/90">
              {p.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
