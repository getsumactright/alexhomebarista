/* Glass Strata · the hero lineup. Everything else (search, codes, sheet, brands) comes from app.js. */
(() => {
  "use strict";
  const S = window.SITE, A = window.AHB;
  if (!S || !A) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const lineup = document.getElementById("lineup");
  const drinks = S.recipes.filter((r) => r.kind === "drink");
  lineup.innerHTML = drinks.map((r, i) => `
    <li style="--i:${i};--tint:${A.color(A.tintKey(r))}">
      <button class="pour-item" type="button" data-id="${esc(r.id)}" aria-label="${esc(r.name)}, open the recipe">
        <span class="pour-item__obj">${A.render(r, true)}</span>
        <span class="pour-item__name">${esc(r.name)}</span>
        <span class="pour-item__meta">${esc(A.shortSpec(r))}</span>
      </button>
    </li>`).join("");
  // ice keeps its own tilt while it settles
  lineup.querySelectorAll(".glass__ice").forEach((el) => {
    const m = el.style.transform.match(/rotate\(([-\d.]+)deg\)/);
    if (m) el.style.setProperty("--a", `${m[1]}deg`);
  });
  lineup.addEventListener("click", (e) => {
    const b = e.target.closest(".pour-item");
    if (b) A.open(b.dataset.id);
  });

  // the lineup already shows every drink, so the shelf below holds only the syrups
  const syrupBtn = document.querySelector('#seg [data-filter="syrup"]');
  if (syrupBtn) syrupBtn.click();

  const store = document.getElementById("navStore");
  if (store) store.href = S.storefront.url;
})();
