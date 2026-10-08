import { useState } from "react";

/**
 * Brand splash on a full page load: the logo settles in with a soft light sweep, then a
 * lens-like opening grows from it to reveal the page. Driven entirely by CSS, so it plays
 * and exits even before JavaScript runs, and it is skipped for reduced motion.
 */
export function Splash() {
  const [done, setDone] = useState(false);
  if (done) return null;

  return (
    <div
      className="splash"
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && e.animationName === "splash-reveal") setDone(true);
      }}
    >
      <div className="splash-inner">
        <span className="splash-mark">
          <img src="/images/splash-logo.webp" alt="" width={480} height={480} fetchPriority="high" />
          <span className="splash-shine" />
        </span>

        <p className="splash-word">
          <span className="splash-ride">Ride</span>
          <span className="splash-share">Share</span>
        </p>
        <p className="splash-tag">Share rides. Brighter commutes.</p>
      </div>

      <div className="splash-partners">
        <p>An initiative of</p>
        <div>
          <img src="/images/partners/cyberabad-police.png" alt="" width={66} height={80} />
          <img src="/images/partners/scsc.png" alt="" width={78} height={80} />
        </div>
      </div>
    </div>
  );
}
