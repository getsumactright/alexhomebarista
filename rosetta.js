/* Demo C · Rosetta. Loads before app.js: draws every recipe as a cup seen from above,
   and looks after the hero pour (pauses off-screen and for reduced motion). */
(() => {
  "use strict";
  const MILK = "#f4ede3";
  const ART = {
    heart: `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 76C28 62 22 47 29 37c6-8 17-6 21 3 4-9 15-11 21-3 7 10 1 25-21 39Z" fill="${MILK}"/></svg>`,
    // a small rosetta, the same pour as the hero: leaves shrinking toward the tip, a pull-through
    // same geometry as the hero pour: filled crescents tapering to points, shrinking toward the tip
    rosetta: `<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="${MILK}">${
      [21, 25, 24, 20, 15, 9].map((w, i) => {
        const y = 72 - i * 8.6, s = 5 + w * 0.32, th = 5.4 - i * 0.5;
        return `<path d="M${50 - w} ${y - s * 0.75}Q50 ${y + s} ${50 + w} ${y - s * 0.75}Q50 ${y + s - th * 2.3} ${50 - w} ${y - s * 0.75}Z"/>`;
      }).join("")
    }<ellipse cx="50" cy="24" rx="4.4" ry="3.4"/></g><path d="M50 23V78" stroke="${MILK}" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  };
  const pick = (id) => [...id].reduce((n, c) => n + c.charCodeAt(0), 0) % 2 ? "heart" : "rosetta";

  window.AHB_RENDER = (r, large, { tintKey, color }) => {
    const tint = color(tintKey(r));
    const lg = large ? " cup--lg" : "";
    if (r.kind === "syrup") {
      return `<div class="cup cup--dish${lg}" style="--tint:${tint}" aria-hidden="true"><span class="cup__surface"></span></div>`;
    }
    if (r.temp === "iced") {
      const top = color(r.layers[0].c);
      return `<div class="cup cup--iced${lg}" style="--tint:${tint};--top:${top}" aria-hidden="true"><span class="cup__surface"><i></i><i></i><i></i></span><span class="cup__straw"></span></div>`;
    }
    return `<div class="cup cup--hot${lg}" style="--tint:${tint}" aria-hidden="true"><span class="cup__handle"></span><span class="cup__surface">${ART[pick(r.id)]}</span></div>`;
  };

  // the hero pour: play only while visible, and not at all for reduced motion
  const video = document.getElementById("pourVideo");
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  if (video) {
    const settle = () => { if (still.matches) { video.removeAttribute("autoplay"); video.pause(); } };
    settle();
    still.addEventListener("change", settle);
    new IntersectionObserver(([e]) => {
      if (still.matches) return;
      if (e.isIntersecting) video.play().catch(() => {}); else video.pause();
    }).observe(video);
  }

  const store = document.getElementById("navStore");
  if (store && window.SITE) store.href = window.SITE.storefront.url;
})();
