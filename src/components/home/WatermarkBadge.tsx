import { Wordmark } from "@/components/layout/Wordmark";

/**
 * A RideShare logo badge that hides a generator watermark. Place it inside a box that
 * matches the media's frame exactly and is a size container (`container-type: inline-size`);
 * `x` / `y` are the watermark's centre as percentages of that frame and `logo` is the logo
 * diameter in cqw. The logo sits on the mark and the wordmark runs left, so it never crops.
 */
export function WatermarkBadge({ x, y, logo }: { x: string; y: string; logo: number }) {
  return (
    <div
      className="pointer-events-none absolute flex items-center rounded-pill bg-navy/75 ring-1 ring-white/15 backdrop-blur-md"
      style={{
        left: x,
        top: y,
        transform: `translate(calc(-100% + ${logo / 2 + logo * 0.14}cqw), -50%)`,
        gap: `${logo * 0.2}cqw`,
        padding: `${logo * 0.14}cqw ${logo * 0.14}cqw ${logo * 0.14}cqw ${logo * 0.32}cqw`,
      }}
      aria-hidden
    >
      <span style={{ fontSize: `${logo * 0.45}cqw` }}>
        <Wordmark className="text-on-dark" />
      </span>
      <img
        src="/logo.png"
        alt=""
        className="shrink-0 rounded-pill bg-paper object-contain"
        style={{ width: `${logo}cqw`, height: `${logo}cqw`, padding: `${logo * 0.11}cqw` }}
      />
    </div>
  );
}
