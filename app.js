/* alexhomebarista · behavior. Content comes from data.js (window.SITE). */
(() => {
  "use strict";
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const color = (k) => (S.colors && S.colors[k]) || k;
  const recipeById = (id) => S.recipes.find((r) => r.id === id);

  /* ───────── Renders: glass & bottle ───────── */
  const ICE = [[22, 15, 12], [50, 24, -9], [28, 37, 21]];
  // the syrup that colors a drink: its first syrup layer, or crema when it has none
  const SYRUPS = ["brownSugar", "pistachio", "lavender", "vanilla", "caramel", "maple"];
  const tintKey = (r) => (r.kind === "syrup" ? r.liquid : (r.layers.find((l) => SYRUPS.includes(l.c)) || { c: "crema" }).c);
  function glass(r, large) {
    const hot = r.temp === "hot";
    const cls = `glass${hot ? " glass--hot" : ""}${large ? " glass--lg" : ""}`;
    const layers = r.layers.map((l) => `<span class="glass__layer" style="--c:${color(l.c)};flex:${l.s}"></span>`).join("");
    const ice = hot ? "" : ICE.map(([x, y, a]) => `<span class="glass__ice" style="left:${x}%;top:${y}%;transform:rotate(${a}deg)"></span>`).join("");
    return `<div class="${cls}" style="--tint:${color(tintKey(r))}" aria-hidden="true"><div class="glass__body"><span class="glass__head"></span><span class="glass__fill" style="flex:1;display:flex;flex-direction:column">${layers}</span><span class="glass__base"></span>${ice}</div></div>`;
  }
  function bottle(r, large) {
    return `<div class="bottle${large ? " bottle--lg" : ""}" style="--tint:${color(r.liquid)}" aria-hidden="true"><span class="bottle__neck"></span><span class="bottle__body"><span class="bottle__liquid" style="--c:${color(r.liquid)}"></span><span class="bottle__label"><span></span></span></span></div>`;
  }
  // a page may draw recipes its own way (window.AHB_RENDER); otherwise glasses and bottles
  const render = (r, large) =>
    typeof window.AHB_RENDER === "function"
      ? window.AHB_RENDER(r, large, { tintKey, color })
      : r.kind === "syrup" ? bottle(r, large) : glass(r, large);
  const kindLabel = (r) => (r.kind === "syrup" ? "House syrup" : `${r.temp === "hot" ? "Hot" : "Iced"} drink`);
  const shortSpec = (r) => {
    const get = (k) => String((r.spec.find(([a]) => a === k) || [])[1] || "").replace(/ /g, " ");
    return r.kind === "syrup" ? `Makes ${get("Makes")} · keeps ${get("Keeps")}` : `${get("Dose")} in · ${get("Yield")} out · ${get("Time")}`;
  };

  /* ───────── Toast & copy ───────── */
  const toast = $("#toast");
  let toastTimer;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2400);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const t = Object.assign(document.createElement("textarea"), { value: text });
      t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;opacity:0";
      document.body.append(t); t.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch {}
      t.remove(); return ok;
    }
  }
  async function copyCode(item, btn) {
    const ok = await copy(item.code);
    if (!ok) { say(`Couldn't reach the clipboard. The code is ${item.code}.`); return; }
    say(`Copied ${item.code}. Paste it at checkout on ${item.brand}.`);
    if (navigator.vibrate) navigator.vibrate(8);
    if (btn) {
      btn.classList.add("is-copied");
      $("use", btn).setAttribute("href", "#i-check");
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { btn.classList.remove("is-copied"); $("use", btn).setAttribute("href", "#i-copy"); }, 1800);
    }
  }

  /* ───────── Hero stage ───────── */
  const newest = S.recipes.find((r) => r.kind === "drink") || S.recipes[0];
  if ($("#stage")) {
    $("#stageName").textContent = newest.name;
    $("#stageMeta").textContent = `Newest recipe · ${kindLabel(newest)}${newest.sample ? " · sample" : ""}`;
    $("#stageBlurb").textContent = newest.blurb;
    $("#stageObject").innerHTML = render(newest, true);
    $("#stageSpec").innerHTML = newest.spec.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
  }
  $$("[data-open-newest]").forEach((b) => b.addEventListener("click", (e) => openSheet(newest, e.currentTarget)));

  /* ───────── Shelf + segmented control ───────── */
  const shelf = $("#shelf");
  const seg = $("#seg");
  const thumb = $(".seg__thumb", seg);
  const segBtns = $$("button", seg);
  const match = { all: () => true, iced: (r) => r.temp === "iced", hot: (r) => r.temp === "hot", syrup: (r) => r.kind === "syrup" };

  function renderShelf(filter, animate) {
    const list = S.recipes.filter(match[filter]);
    shelf.innerHTML = list.map((r, i) => `
      <li${animate ? ` class="is-entering" style="--i:${i}"` : ""}>
        <button class="item" type="button" data-id="${esc(r.id)}">
          <span class="item__object">${render(r)}</span>
          <span class="item__name">${esc(r.name)}</span>
          <span class="item__spec">${esc(shortSpec(r))}</span>
          ${r.sample ? '<span class="tag">Sample</span>' : ""}
        </button>
      </li>`).join("") || `<li><p class="item__spec">Nothing here yet.</p></li>`;
  }
  shelf.addEventListener("click", (e) => {
    const b = e.target.closest(".item");
    if (b) openSheet(recipeById(b.dataset.id), b);
  });
  function placeThumb() {
    const on = segBtns.find((b) => b.getAttribute("aria-checked") === "true");
    thumb.style.width = `${on.offsetWidth}px`;
    thumb.style.transform = `translateX(${on.offsetLeft}px)`;
  }
  function choose(btn, focus) {
    segBtns.forEach((b) => { const on = b === btn; b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; });
    placeThumb();
    renderShelf(btn.dataset.filter, !reduceMotion.matches);
    if (focus) btn.focus();
  }
  segBtns.forEach((b, i) => {
    b.tabIndex = i === 0 ? 0 : -1;
    b.addEventListener("click", () => choose(b));
    b.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      choose(segBtns[(i + d + segBtns.length) % segBtns.length], true);
    });
  });
  renderShelf("all", false);

  /* ───────── Gear & codes ───────── */
  const allGear = S.gear.flatMap((g) => g.items.map((it) => ({ ...it, group: g.group })));
  $("#storefront").href = S.storefront.url;
  $("#gearList").innerHTML = S.gear.map((g) => `
    <section class="gear__group" aria-label="${esc(g.group)}">
      <h3 class="sub-h">${esc(g.group)}</h3>
      <ul>${g.items.map((it) => {
        const i = allGear.findIndex((a) => a.url === it.url && a.product === it.product);
        const offer = it.offer ? `<span class="row__offer">${esc(it.offer)}</span>` : "";
        const code = it.code
          ? `<button class="code" type="button" data-gear="${i}" aria-label="Copy code ${esc(it.code)} for ${esc(it.brand)}"><svg class="ico" aria-hidden="true"><use href="#i-copy"/></svg>${esc(it.code)}</button>`
          : `<span class="code code--none">${it.offer ? "No code needed" : "Shop direct"}</span>`;
        return `<li class="row">
          <div><span class="row__brand">${esc(it.brand)}</span> <span class="row__product">${esc(it.product)}</span>${offer}</div>
          ${code}
          <a class="shop" href="${esc(it.url)}" target="_blank" rel="sponsored noopener" aria-label="Shop ${esc(it.brand)} ${esc(it.product)} (opens a new tab)">Shop<svg class="ico" aria-hidden="true"><use href="#i-out"/></svg></a>
        </li>`;
      }).join("")}</ul>
    </section>`).join("");
  $("#gearList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-gear]");
    if (b) copyCode(allGear[+b.dataset.gear], b);
  });

  /* ───────── Brands ───────── */
  $("#wordmarks").innerHTML = S.brands.map((b) => `<li>${esc(b)}</li>`).join("");
  $("#offers").innerHTML = S.offers.map((o) => `<li><h4>${esc(o.title)}</h4><p>${esc(o.body)}</p></li>`).join("");
  $("#specs").innerHTML = S.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
  const mail = (subject) => `mailto:${S.contactEmail}?subject=${encodeURIComponent(subject)}`;
  const pitch = $("#pitchPrimary"), kit = $("#pitchKit");
  if (S.contactEmail) {
    pitch.href = mail("Partnership with alexhomebarista");
    kit.href = mail("Media kit request");
  } else {
    // no email and no media kit yet: one honest action instead of two buttons to the same DM
    Object.assign(pitch, { href: S.dmUrl, target: "_blank", rel: "noopener", textContent: "Message me on Instagram" });
    kit.hidden = true;
  }

  /* ───────── Footer ───────── */
  $("#socials").innerHTML = S.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")
    + (S.contactEmail ? `<li><a href="mailto:${esc(S.contactEmail)}">Email</a></li>` : "");
  $("#year").textContent = new Date().getFullYear();

  /* ───────── Search (Spotlight-style combobox) ───────── */
  const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const index = [
    ...S.recipes.map((r) => ({ type: "recipe", name: r.name, meta: kindLabel(r), r })),
    ...allGear.map((g) => ({ type: "gear", name: g.brand, meta: [g.product, g.offer].filter(Boolean).join(" · "), g })),
    { type: "link", name: "Amazon Storefront", meta: "Everything I use, in one list", url: S.storefront.url }
  ].map((x) => ({ ...x, hay: norm([x.name, x.meta, x.g && x.g.code, x.g && x.g.group].filter(Boolean).join(" ")) }));

  const q = $("#q"), panel = $("#q-panel"), results = $("#q-results"), empty = $("#q-empty");
  let hits = [], active = -1;

  function highlight(name, term) {
    const n = norm(name), i = n.indexOf(term);
    if (!term || i < 0) return esc(name);
    return esc(name.slice(0, i)) + "<mark>" + esc(name.slice(i, i + term.length)) + "</mark>" + esc(name.slice(i + term.length));
  }
  function runSearch() {
    const raw = q.value.trim();
    const terms = norm(raw).split(/\s+/).filter(Boolean);
    if (!terms.length) { closePanel(); return; }
    hits = index
      .filter((x) => terms.every((t) => x.hay.includes(t)))
      .map((x) => ({ x, score: norm(x.name).startsWith(terms[0]) ? 0 : norm(x.name).includes(terms[0]) ? 1 : 2 }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 6).map((h) => h.x);
    active = hits.length ? 0 : -1;
    results.innerHTML = hits.map((h, i) => {
      const right = h.type === "gear" && h.g.code
        ? `<span class="code" aria-hidden="true"><svg class="ico"><use href="#i-copy"/></svg>${esc(h.g.code)}</span>`
        : h.type === "recipe" ? `<svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg>`
        : `<svg class="ico" aria-hidden="true"><use href="#i-out"/></svg>`;
      const verb = h.type === "gear" && h.g.code ? `, press Enter to copy code ${h.g.code}` : h.type === "recipe" ? ", press Enter to open" : ", press Enter to open the shop";
      return `<li role="option" id="opt-${i}" aria-selected="${i === active}" data-i="${i}" aria-label="${esc(h.name)}, ${esc(h.meta)}${esc(verb)}">
        <span><span class="result__name">${highlight(h.name, terms[0])}</span><span class="result__meta">${esc(h.meta)}</span></span>${right}</li>`;
    }).join("");
    empty.hidden = hits.length > 0;
    empty.textContent = `Nothing for “${raw}”. Try a brand like AeroPress, or a flavor like vanilla.`;
    panel.hidden = false;
    q.setAttribute("aria-expanded", "true");
    q.setAttribute("aria-activedescendant", active >= 0 ? `opt-${active}` : "");
  }
  function closePanel() { panel.hidden = true; q.setAttribute("aria-expanded", "false"); q.removeAttribute("aria-activedescendant"); }
  function move(d) {
    if (!hits.length) return;
    active = (active + d + hits.length) % hits.length;
    $$("li", results).forEach((li, i) => li.setAttribute("aria-selected", i === active));
    q.setAttribute("aria-activedescendant", `opt-${active}`);
  }
  function activate(h) {
    if (!h) return;
    if (h.type === "recipe") { closePanel(); openSheet(h.r, q); }
    else if (h.type === "gear" && h.g.code) copyCode(h.g, null);
    else window.open(h.type === "gear" ? h.g.url : h.url, "_blank", "noopener");
  }
  q.addEventListener("input", runSearch);
  q.addEventListener("focus", () => q.value.trim() && runSearch());
  q.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter") { e.preventDefault(); activate(hits[active]); }
    else if (e.key === "Escape") { if (!panel.hidden) { e.preventDefault(); closePanel(); } else q.value = ""; }
  });
  q.addEventListener("blur", () => setTimeout(() => { if (!$("#search").contains(document.activeElement)) closePanel(); }, 120));
  panel.addEventListener("pointerdown", (e) => e.preventDefault()); // keep focus in the field while choosing
  results.addEventListener("click", (e) => { const li = e.target.closest("li"); if (li) activate(hits[+li.dataset.i]); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && !sheet.open) { e.preventDefault(); q.focus(); }
  });

  /* ───────── Springs (damping ratio + response, Apple-style) ───────── */
  function spring({ from, to, velocity = 0, response = 0.38, damping = 1, onUpdate, onDone }) {
    const k = (2 * Math.PI / response) ** 2, c = (4 * Math.PI * damping) / response;
    let x = from, v = velocity, last = performance.now(), raf;
    const step = (now) => {
      const dt = Math.min(0.064, (now - last) / 1000); last = now;
      for (let i = 0, h = dt / 8; i < 8; i++) { v += (-k * (x - to) - c * v) * h; x += v * h; }
      if (Math.abs(v) < 4 && Math.abs(x - to) < 0.4) { onUpdate(to); onDone && onDone(); return; }
      onUpdate(x); raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return { stop: () => cancelAnimationFrame(raf), get x() { return x; } };
  }
  const project = (v, d = 0.998) => ((v / 1000) * d) / (1 - d);
  const rubber = (o, dim, c = 0.55) => (o * dim * c) / (dim + c * Math.abs(o));

  /* ───────── Recipe sheet ───────── */
  const sheet = $("#sheet"), grip = $("#sheetGrip"), scroller = $(".sheet__scroll", sheet);
  let y = 0, H = 0, anim = null, closing = false;
  const setY = (v) => {
    y = v;
    sheet.style.transform = `translateY(${v}px)`;
    sheet.style.setProperty("--scrim", String(clamp(1 - v / (H || 1), 0, 1)));
  };

  function fillSheet(r) {
    $("#sheetObject").innerHTML = render(r, true);
    $("#sheetKind").textContent = kindLabel(r) + (r.sample ? " · Sample recipe" : "");
    $("#sheetTitle").textContent = r.name;
    $("#sheetBlurb").textContent = r.blurb;
    $("#sheetSpec").innerHTML = r.spec.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
    $("#sheetIng").innerHTML = r.ingredients.map((x) => `<li>${esc(x)}</li>`).join("");
    $("#sheetSteps").innerHTML = r.steps.map((x) => `<li><span>${esc(x)}</span></li>`).join("");
    scroller.scrollTop = 0;
  }
  function openSheet(r, from) {
    if (!r) return;
    anim && anim.stop(); closing = false;
    fillSheet(r);
    if (!sheet.open) sheet.showModal();
    H = sheet.getBoundingClientRect().height;
    if (reduceMotion.matches) { setY(0); sheet.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180 }); return; }
    if (!sheet._shown) setY(H);
    sheet._shown = true;
    anim = spring({ from: y, to: 0, response: 0.42, damping: 1, onUpdate: setY });
    history.replaceState(null, "", `#recipe/${r.id}`);
  }
  function closeSheet(velocity = 0) {
    if (!sheet.open || closing) return;
    closing = true; anim && anim.stop();
    const done = () => { sheet.close(); sheet._shown = false; closing = false; setY(0); history.replaceState(null, "", location.pathname + location.search); };
    if (reduceMotion.matches) { sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150 }).onfinish = done; return; }
    H = sheet.getBoundingClientRect().height;
    anim = spring({ from: y, to: H, velocity, response: 0.34, damping: 1, onUpdate: setY, onDone: done });
  }
  $("#sheetClose").addEventListener("click", () => closeSheet());
  sheet.addEventListener("cancel", (e) => { e.preventDefault(); closeSheet(); });
  sheet.addEventListener("click", (e) => {
    if (e.target !== sheet) return;
    const b = sheet.getBoundingClientRect();
    if (e.clientY < b.top || e.clientX < b.left || e.clientX > b.right) closeSheet();
  });

  // drag to dismiss: grab the grip, or the top of the sheet when its content is scrolled to the top
  let drag = null;
  function dragStart(e) {
    if (reduceMotion.matches || e.button > 0) return;
    if (e.currentTarget !== grip && (scroller.scrollTop > 0 || e.target.closest("button, a"))) return;
    anim && anim.stop(); closing = false;
    H = sheet.getBoundingClientRect().height;
    drag = { id: e.pointerId, start: e.clientY - Math.max(0, y), base: y, hist: [[e.timeStamp, e.clientY]], live: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function dragMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const dy = e.clientY - drag.start;
    if (!drag.live && Math.abs(dy - drag.base) < 6) return; // small hysteresis before committing
    drag.live = true;
    setY(dy >= 0 ? dy : rubber(dy, H));
    drag.hist.push([e.timeStamp, e.clientY]);
    if (drag.hist.length > 6) drag.hist.shift();
  }
  function dragEnd(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const h = drag.hist, a = h[0], b = h[h.length - 1];
    const v = b[0] > a[0] ? ((b[1] - a[1]) / (b[0] - a[0])) * 1000 : 0; // px/s
    const wasLive = drag.live;
    drag = null;
    if (!wasLive) return;
    const landing = y + project(v);
    if (landing > H * 0.45 || v > 900) closeSheet(v);
    else anim = spring({ from: y, to: 0, velocity: v, response: 0.3, damping: 0.82, onUpdate: setY });
  }
  [grip, $(".sheet__top", sheet)].forEach((el) => {
    el.addEventListener("pointerdown", dragStart);
    el.addEventListener("pointermove", dragMove);
    el.addEventListener("pointerup", dragEnd);
    el.addEventListener("pointercancel", dragEnd);
  });
  $(".sheet__top", sheet).style.touchAction = "pan-x";

  // deep links: #recipe/<id> opens straight into a recipe (shareable from a video caption)
  const fromHash = () => { const m = location.hash.match(/^#recipe\/(.+)$/); if (m && recipeById(m[1])) openSheet(recipeById(m[1])); };

  /* ───────── The day: light, clock, stamps, active section ───────── */
  const sun = $(".sun"), rig = $(".sun__rig"), pm = $(".sun__pane--pm"), dusk = $(".sun__dusk");
  const clock = $("#clock"), fill = $("#dayFill"), dot = $("#daySun"), line = $(".dayline");
  const stageObj = $("#stageObject"), phone = matchMedia("(max-width: 767px)");
  const START = 7 * 60 + 2, END = 19 * 60 + 45;
  const fmt = (m) => { m = Math.round(m); const h = Math.floor(m / 60), mm = m % 60; return [`${((h + 11) % 12) + 1}:${String(mm).padStart(2, "0")}`, h < 12 ? "AM" : "PM"]; };
  let maxScroll = 1, lineW = 0, ticking = false;

  const hasDay = !!sun; // pages without the moving light (e.g. strata.html) skip the day entirely
  function measure() {
    placeThumb();
    if (!hasDay) return;
    maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    lineW = line.offsetWidth;
    // stamps = the time the section reaches the top on a typical screen, independent of this window's height
    const span = Math.max(1, document.documentElement.scrollHeight - Math.min(innerHeight, 900));
    $$("[data-stamp]").forEach((el) => {
      const sec = el.closest("section, footer");
      const top = sec.getBoundingClientRect().top + scrollY - 76;
      const [t, ap] = fmt(START + clamp(top / span, 0, 1) * (END - START));
      el.innerHTML = `${t}<small>${ap}</small>`;
    });
    paint();
  }
  function paint() {
    ticking = false;
    if (!hasDay) return;
    const p = clamp(scrollY / maxScroll, 0, 1);
    const [t, ap] = fmt(START + p * (END - START));
    clock.textContent = `${t} ${ap}`;
    fill.style.transform = `scaleX(${p})`;
    dot.style.transform = `translateX(${p * Math.max(0, lineW - 9)}px)`;
    const lp = reduceMotion.matches ? 0.12 : p;
    const rot = -24 + lp * 12;
    // phones: move in vmin so the window never outgrows the screen; the light stays a patch, never a fill
    rig.style.transform = phone.matches
      ? `translate(-50%, -50%) translate(${-34 + lp * 52}vmin, ${-30 + lp * 70}vmin) rotate(${rot}deg) skewX(${-14 - lp * 8}deg) scaleY(${1 + lp * 0.15})`
      : `translate(-50%, -50%) translate(${-8 + lp * 30}vw, ${-6 + lp * 26}vh) rotate(${rot}deg) skewX(${-14 - lp * 8}deg) scaleY(${1 + lp * 0.12})`;
    pm.style.opacity = ((phone.matches ? 0.35 : 0.5) * smooth(0.4, 0.95, lp)).toFixed(3);
    dusk.style.opacity = (0.3 * smooth(0.6, 1, lp)).toFixed(3);
    // the hero glass casts its shadow away from the window, following the sun's angle
    stageObj.style.setProperty("--cast", `${-22 + lp * 10}deg`);
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
  addEventListener("resize", measure);
  new ResizeObserver(() => measure()).observe(document.body);

  const links = $$(".nav__links a, .tabbar a");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.toggleAttribute("aria-current", false));
      links.filter((a) => a.getAttribute("href") === `#${en.target.id}`).forEach((a) => a.setAttribute("aria-current", "true"));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["top", "recipes", "gear", "brands"].forEach((id) => io.observe(document.getElementById(id)));

  // shared with page-specific scripts (strata.js)
  window.AHB = { render, shortSpec, tintKey, color, copy: copyCode, open: (id) => openSheet(recipeById(id)) };

  measure();
  if (sun) requestAnimationFrame(() => sun.classList.add("is-up"));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(measure);
  fromHash();
  addEventListener("hashchange", fromHash);
})();
