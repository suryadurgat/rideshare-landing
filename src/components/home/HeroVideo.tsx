import { useEffect, useRef } from "react";
import { WatermarkBadge } from "./WatermarkBadge";

/** Where the generator's sparkle watermark sits in the source frame (1160×600 of 1280×720). */
const WATERMARK = { x: "90.625%", y: "83.333%" };

/**
 * The hero's background video. To use a new video, replace /images/ai-video.mp4 (and the
 * /images/ai-video.jpg poster frame shown while it loads). It pauses for reduced motion.
 *
 * The video is drawn in a 16:9 frame that reproduces `object-cover` by hand, so the
 * RideShare badge can be pinned over the watermark at every viewport size.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (reduce.matches) video.pause();
      else void video.play().catch(() => undefined);
    };
    apply();
    reduce.addEventListener("change", apply);
    return () => reduce.removeEventListener("change", apply);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden [container-type:size]" aria-hidden>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [container-type:inline-size]"
        style={{
          width: "max(100cqw, calc(100cqh * 16 / 9))",
          height: "max(100cqh, calc(100cqw * 9 / 16))",
        }}
      >
        <video
          ref={ref}
          className="size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/ai-video.jpg"
        >
          <source src="/images/ai-video.mp4" type="video/mp4" />
        </video>

        <WatermarkBadge x={WATERMARK.x} y={WATERMARK.y} logo={4.4} />
      </div>
    </div>
  );
}
