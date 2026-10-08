import { cn } from "@/lib/utils";

/**
 * The RideShare wordmark, set in Clash Display: "Ride" in solid colour, "Share" in the
 * logo gradient. One typeface, two tones.
 */
export function Wordmark({
  className,
  tone = "gradient",
}: {
  className?: string;
  /** "gradient" for dark backgrounds; "plain" where the gradient would lose contrast. */
  tone?: "gradient" | "plain";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-display leading-none font-semibold tracking-[-0.02em]",
        className,
      )}
    >
      <span>Ride</span>
      <span className={cn("pr-[0.04em]", tone === "gradient" ? "text-brand-gradient" : "opacity-80")}>
        Share
      </span>
    </span>
  );
}
