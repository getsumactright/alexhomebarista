/* Demo D · Exploded Counter. Loads before app.js: draws every recipe as a hatched section,
   then (once app.js is ready) runs FIG. 1: numbered parts, the callout with codes, explode / assemble. */
(() => {
  "use strict";
  const S = window.SITE;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ───────── recipes, drawn in section ───────── */
  // hatching stands in for material: dense cross for espresso, slants for syrups, open lines for milk, dots for foam
  const HATCH = {
    espresso: "h-cross", crema: "h-diag", brownSugar: "h-diag", caramel: "h-diag", maple: "h-diag",
    pistachio: "h-diag-r", lavender: "h-diag-r", vanilla: "h-diag-r", milk: "h-horiz", oat: "h-horiz", foam: "h-dots",
  };
  const hatch = (k) => `url(#${HATCH[k] || "h-horiz"})`;

  function glassSvg(r) {
    const hot = r.temp === "hot";
    // tumbler for iced, a short cortado glass for hot
    const outer = hot ? "M26 76 L33 160 Q34 166 40 166 H80 Q86 166 87 160 L94 76" : "M20 22 L29 160 Q30 166 36 166 H84 Q90 166 91 160 L100 22";
    const inner = hot ? "M31 82 L37 156 H83 L89 82 Z" : "M25 28 L33 156 H87 L95 28 Z";
    const top = hot ? 94 : 44, bottom = 156;
    const total = r.layers.reduce((n, l) => n + l.s, 0);
    let y = top;
    const bands = r.layers.map((l) => {
      const h = ((bottom - top) * l.s) / total;
      const band = `<rect x="0" y="${y.toFixed(1)}" width="120" height="${h.toFixed(1)}" fill="${hatch(l.c)}"/><path class="o thin" d="M0 ${y.toFixed(1)} H120"/>`;
      y += h;
      return band;
    }).join("");
    const ice = hot ? "" : `<rect class="o ice" x="38" y="34" width="20" height="20" transform="rotate(12 48 44)"/><rect class="o ice" x="60" y="44" width="18" height="18" transform="rotate(-9 69 53)"/>`;
    const id = `c-${r.id}`;
    return `<svg class="drawn" viewBox="0 0 120 172" aria-hidden="true"><clipPath id="${id}"><path d="${inner}"/></clipPath><g clip-path="url(#${id})">${bands}</g>${ice}<path class="o" d="${outer}"/><path class="o thin" d="${inner}"/><path class="o" d="M8 168 H112"/></svg>`;
  }
  function bottleSvg(r) {
    const id = `c-${r.id}`;
    const body = "M34 166 V72 Q34 58 50 58 H70 Q86 58 86 72 V166 Z";
    return `<svg class="drawn" viewBox="0 0 120 172" aria-hidden="true"><clipPath id="${id}"><path d="${body}"/></clipPath><rect x="0" y="86" width="120" height="90" fill="${hatch(r.liquid)}" clip-path="url(#${id})"/><path class="o thin" d="M34 86 H86"/><path class="o" d="${body}"/><rect class="o" x="50" y="34" width="20" height="24"/><rect class="o" x="47" y="24" width="26" height="10" fill="url(#h-cross)"/><rect class="o label" x="42" y="104" width="36" height="40"/><path class="o thin" d="M48 118 H72 M48 128 H66"/><path class="o" d="M8 168 H112"/></svg>`;
  }
  window.AHB_RENDER = (r) => (r.kind === "syrup" ? bottleSvg(r) : glassSvg(r));

  /* ───────── FIG. 1 ───────── */
  const PARTS = {
    10: { name: "GRINDER", brands: ["Mahlkönig"] },
    20: { name: "ESPRESSO MACHINE", brands: ["Gemilai", "Casabrews"] },
    30: { name: "MILK", brands: ["Nama"] },
    40: { name: "GLASS BREWER", brands: ["Caraway", "Pure Over"] },
    50: { name: "PRESS", brands: ["AeroPress"] },
    60: { name: "SYRUP", brands: ["Surrup."] },
    70: { name: "BEANS", brands: ["Trade Coffee"] },
  };
  const GROUP_NUMS = { Espresso: "20", Grinding: "10", Brewing: "40 · 50", "Milk & syrups": "30 · 60", Beans: "70" };

  document.addEventListener("DOMContentLoaded", () => {
    const A = window.AHB;
    const items = S.gear.flatMap((g) => g.items);
    const fig = document.getElementById("fig");
    const parts = [...fig.querySelectorAll(".part")];
    const list = document.getElementById("calloutList");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = null;

    // phones: the same parts in two rows (CSS moves the lower row); this frames them
    const svg = fig.querySelector(".fig__svg");
    const phone = matchMedia("(max-width: 767px)");
    const frame = () => svg.setAttribute("viewBox", phone.matches ? "20 110 620 780" : "0 0 1200 520");
    frame();
    phone.addEventListener("change", frame);

    // a selected part's leader pulls taut: its curve straightens into a line from numeral to part
    const leads = parts.map((g) => {
      const p = g.querySelector(".lead");
      const c = p.getAttribute("d").match(/-?\d+(?:\.\d+)?/g).map(Number); // M x0 y0 C x1 y1, x2 y2, x3 y3
      return { g, p, c, t: 0, raf: 0 };
    });
    const drawLead = (L) => {
      const [x0, y0, x1, y1, x2, y2, x3, y3] = L.c, t = L.t, mix = (a, b) => a + (b - a) * t;
      const s1x = x0 + (x3 - x0) / 3, s1y = y0 + (y3 - y0) / 3, s2x = x0 + (2 * (x3 - x0)) / 3, s2y = y0 + (2 * (y3 - y0)) / 3;
      L.p.setAttribute("d", `M${x0} ${y0} C ${mix(x1, s1x).toFixed(1)} ${mix(y1, s1y).toFixed(1)}, ${mix(x2, s2x).toFixed(1)} ${mix(y2, s2y).toFixed(1)}, ${x3} ${y3}`);
    };
    const pull = (L, to) => {
      cancelAnimationFrame(L.raf);
      if (still) { L.t = to; drawLead(L); return; }
      const from = L.t, t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 250);
        L.t = from + (to - from) * (1 - Math.pow(1 - k, 3));
        drawLead(L);
        if (k < 1) L.raf = requestAnimationFrame(step);
      };
      L.raf = requestAnimationFrame(step);
    };

    function select(n, focus) {
      const p = PARTS[n];
      if (!p) return;
      current = n;
      parts.forEach((g) => { const on = g.dataset.n === String(n); g.classList.toggle("is-on", on); g.setAttribute("aria-pressed", on); });
      leads.forEach((L) => pull(L, L.g.dataset.n === String(n) ? 1 : 0));
      document.getElementById("calloutNum").textContent = n;
      document.getElementById("calloutName").textContent = p.name;
      // the callout carries the parts with a code or an offer; the rest wait in the parts list (sheet 3)
      const all = items.filter((it) => p.brands.includes(it.brand));
      const rows = all.filter((it) => it.code || it.offer);
      const more = all.length - rows.length;
      list.innerHTML = rows.map((it, i) => `
        <li>
          <span class="callout__brand"><b>${esc(it.brand)}</b> ${esc(it.product)}${it.offer ? ` <em>${esc(it.offer)}</em>` : ""}</span>
          ${it.code ? `<button class="code" type="button" data-i="${i}" aria-label="Copy code ${esc(it.code)} for ${esc(it.brand)}"><svg class="ico" aria-hidden="true"><use href="#i-copy"/></svg>${esc(it.code)}</button>` : `<span class="code code--none">${it.offer ? "No code needed" : "Shop direct"}</span>`}
          <a class="shop" href="${esc(it.url)}" target="_blank" rel="sponsored noopener" aria-label="Shop ${esc(it.brand)} ${esc(it.product)} (opens a new tab)">Shop<svg class="ico" aria-hidden="true"><use href="#i-out"/></svg></a>
        </li>`).join("") + (more ? `<li class="callout__more"><a href="#gear">${more} more ${p.brands.join(" & ")} ${more > 1 ? "models" : "model"} in the parts list</a></li>` : "");
      list._rows = rows;
      if (focus) document.getElementById("callout").focus?.();
    }
    list.addEventListener("click", (e) => {
      const b = e.target.closest("[data-i]");
      if (b && A) A.copy(list._rows[+b.dataset.i], b);
    });
    parts.forEach((g) => {
      g.addEventListener("click", () => select(+g.dataset.n));
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(+g.dataset.n); }
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (d) { e.preventDefault(); const k = parts.indexOf(g); const next = parts[(k + d + parts.length) % parts.length]; next.focus(); select(+next.dataset.n); }
      });
    });
    select(20);

    // explode / assemble: the figure opens once on load, then the toggle owns it
    const toggle = document.getElementById("figToggle");
    const setAssembled = (on) => {
      fig.classList.toggle("is-assembled", on);
      toggle.setAttribute("aria-pressed", on);
      toggle.textContent = on ? "Explode" : "Assemble";
    };
    toggle.addEventListener("click", () => setAssembled(!fig.classList.contains("is-assembled")));
    if (!still) {
      fig.classList.add("is-assembled", "no-anim");
      requestAnimationFrame(() => requestAnimationFrame(() => { fig.classList.remove("no-anim"); setTimeout(() => setAssembled(false), 350); }));
    }

    // parts list: each group carries its Fig. 1 numerals
    document.querySelectorAll("#gearList .gear__group").forEach((g) => {
      const h = g.querySelector("h3");
      const n = GROUP_NUMS[h.textContent.trim()];
      if (n) h.insertAdjacentHTML("afterbegin", `<span class="mono num-tag">${n}</span>`);
    });

    // FIG. 2 plays only while on screen, never under reduced motion
    const v = document.querySelector(".fig2__video");
    if (v) {
      if (still) { v.removeAttribute("autoplay"); v.pause(); }
      else new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())).observe(v);
    }

    const store = document.getElementById("navStore");
    if (store) store.href = S.storefront.url;
  });
})();
