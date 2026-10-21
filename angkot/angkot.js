/* RUTE 07: behaviour. Vanilla JS, no dependencies. */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isPlain = () => root.classList.contains("plain");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };

  /* ---------------- Plain mode ---------------- */
  const plainBtns = $$("[data-plain]");
  const syncPlain = () => plainBtns.forEach((b) => b.setAttribute("aria-pressed", String(isPlain())));
  function setPlain(on, persist = true) {
    root.classList.toggle("plain", on);
    syncPlain();
    if (persist) store.set("angkot-plain", on ? "1" : "0");
    if (on) $$(".reveal").forEach((el) => el.classList.add("is-in"));
    update();
  }
  plainBtns.forEach((b) => b.addEventListener("click", () => setPlain(!isPlain())));
  const savedPlain = store.get("angkot-plain");
  if (savedPlain === "1" || (savedPlain === null && reducedMotion)) root.classList.add("plain");
  syncPlain();

  /* ---------------- LED board ---------------- */
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*/";
  function ledSet(el, text, dur = 520) {
    cancelAnimationFrame(el._raf);
    const target = text.toUpperCase();
    if (isPlain()) { el.textContent = target; return; }
    const t0 = performance.now();
    const step = (now) => {
      const t = clamp((now - t0) / dur);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        const settled = target[i] === " " || t >= 0.3 + 0.7 * (i / target.length);
        out += settled ? target[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (t < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  /* ---------------- Loader ---------------- */
  const loader = $("#loader");
  const fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]);
  Promise.all([fontsReady, new Promise((r) => setTimeout(r, isPlain() ? 0 : 1400))]).then(() => {
    loader.classList.add("is-done");
    root.classList.add("is-ready");
    setTimeout(() => loader.remove(), 1400);
    ledSet($("#busLed"), "APRI RACHMADI", 900);
  });

  /* ---------------- Jakarta clock ---------------- */
  const clockEl = $("#clock");
  const clockFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const tick = () => { clockEl.textContent = clockFmt.format(new Date()); };
  tick(); setInterval(tick, 1000);

  /* ---------------- Skyline art (generated) ---------------- */
  function mulberry(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function skyline(seed, { min, max, fill, windows, deco }) {
    const rng = mulberry(seed), W = 1400, H = 320, parts = [];
    for (let x = 0; x < W;) {
      const w = Math.min(50 + ((rng() * 90) | 0), W - x), h = min + ((rng() * (max - min)) | 0), y = H - h;
      parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`);
      if (rng() < 0.3) parts.push(`<rect x="${x + w / 2 - 2}" y="${y - 28}" width="4" height="28" fill="${fill}"/>`);
      if (windows) for (let wy = y + 14; wy < H - 12; wy += 22) for (let wx = x + 10; wx < x + w - 12; wx += 18) if (rng() < 0.26) parts.push(`<rect x="${wx}" y="${wy}" width="7" height="9" fill="#ffd45e"/>`);
      x += w + ((rng() * 12) | 0);
    }
    if (deco) {
      // mosque: dome, crescent, minaret
      parts.push(`<rect x="610" y="190" width="150" height="130" fill="${fill}"/><path d="M620 190a65 65 0 0 1 130 0z" fill="${fill}"/><rect x="683" y="100" width="4" height="26" fill="${fill}"/><circle cx="685" cy="96" r="7" fill="${fill}"/><rect x="780" y="120" width="22" height="200" fill="${fill}"/><path d="M776 120l15-34 15 34z" fill="${fill}"/>`);
      // palms
      [180, 980, 1290].forEach((px) => parts.push(`<path d="M${px} 320C${px + 6} 250 ${px - 4} 200 ${px + 8} 150" stroke="${fill}" stroke-width="7" fill="none"/><path d="M${px + 8} 150c-34-8-56 6-70 26 22-10 44-14 70-8zM${px + 8} 150c30-14 56-4 72 16-22-8-46-8-72-2zM${px + 8} 150c-8-26 6-48 26-58-4 24-12 40-26 58zM${px + 8} 150c10-28-2-50-22-62 2 26 8 42 22 62z" fill="${fill}"/>`));
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join("")}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }
  const skyFar = $("#skyFar"), skyNear = $("#skyNear");
  skyFar.style.backgroundImage = skyline(7, { min: 90, max: 240, fill: "#9a3d63", windows: false, deco: false });
  skyNear.style.backgroundImage = skyline(21, { min: 50, max: 170, fill: "#2a1822", windows: true, deco: true });
  skyFar.style.backgroundSize = skyNear.style.backgroundSize = "1400px 100%";

  /* ---------------- Projects ---------------- */
  const PROJECTS = window.ANGKOT_PROJECTS || [];
  const STAT = {
    "tilik-agent": ["0.88", "task completion"],
    dispatch: ["33/40", "all-field label matches"],
    "rottom-chat": ["Verified", "mechanics, same engine as the Arena"],
    "geo-lens": ["1024²", "change masks"],
    "ingfo-loker": ["2×/day", "automated digests"],
    "ai-finance-document-reviewer": ["13", "deterministic validation rules"],
    "recall-learning": ["6", "swappable STT providers"],
    "satellite-precipitation-nowcasting": ["41×41", "precipitation grid"],
    "sirekap-ocr": ["0.8%", "character error rate"],
    "hoax-classification": ["99%", "accuracy"],
    "fire-smoke": ["90%", "accuracy"],
    nids: ["88.6%", "F1-macro"],
    "vehicle-counting": ["YOLOv8", "multi-gate tracking"],
    "carbon-emission": ["0.99", "R²"],
    "garbage-classification": ["88%", "accuracy"],
    "golden-section": ["Holt's", "double exponential smoothing"],
  };
  const statFor = (p) => STAT[p.id] || [p.metric || p.year || "—", ""];
  const CAT = { "ai agents": "AI Agents", "computer vision": "Computer Vision", nlp: "NLP", "data science": "Data Science" };
  const LINK = { "case-study": "Read case study", github: "GitHub", demo: "Live demo", streamlit: "Live demo", ppt: "Slides" };
  const COVERS = ["var(--sun)", "var(--pink)", "var(--teal)", "var(--blue)"];
  const num = (n) => String(n).padStart(2, "0");

  const linksHTML = (p, small) =>
    (p.links || []).map((l, i) => `<a class="pill ${i === 0 && l.type === "case-study" ? "pill--ink" : ""} ${small ? "pill--sm" : ""}" href="${esc(l.url)}" ${/^https?:/.test(l.url) ? 'target="_blank" rel="noopener"' : ""} data-cursor="OPEN">${esc(LINK[l.type] || l.type)}</a>`).join("");

  const coverHTML = (p, idx) => {
    const [n, c] = statFor(p);
    return `<div class="cover" style="--cv:${COVERS[idx % COVERS.length]}"><b>${esc(n)}</b><span>${esc(c)}</span></div>`;
  };
  const mediaHTML = (p, idx, framed) => {
    const img = p.image
      ? `<img class="win__img" src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy" data-fb="${esc(p.id)}" data-idx="${idx}">`
      : coverHTML(p, idx);
    return framed ? `<div class="win"><div class="win__bar"><i></i><i></i><i></i></div>${img}</div>` : img;
  };
  function bindFallbacks(scope) {
    $$("img[data-fb]", scope).forEach((img) => {
      const swap = () => {
        const p = PROJECTS.find((x) => x.id === img.dataset.fb);
        const tmp = document.createElement("div");
        tmp.innerHTML = coverHTML(p, +img.dataset.idx);
        const tk = img.closest(".tk");
        if (tk) { tk.classList.add("tk--cover"); const s = $(".tk__stat", tk); if (s) s.remove(); }
        img.replaceWith(tmp.firstElementChild);
      };
      if (img.complete && img.naturalWidth === 0) swap(); else img.addEventListener("error", swap, { once: true });
    });
  }

  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);
  const stack = $("#stack");
  stack.innerHTML = featured.map((p, i) => {
    const [n, c] = statFor(p);
    return `<article class="card" style="--i:${i};--cbg:${COVERS[i % COVERS.length]}" data-id="${esc(p.id)}">
      ${mediaHTML(p, i, true)}
      <div class="card__body">
        <p class="card__rute">Rute ${num(i + 1)} · ${esc(CAT[(p.categories || [])[0]] || "Project")} · ${esc(p.year || "")}</p>
        <h3 class="card__title">${esc(p.title)}</h3>
        <p class="card__desc">${esc(p.description)}</p>
        <div class="stat"><span class="stat__n" data-count="${esc(n)}">${esc(n)}</span><span class="stat__c">${esc(c)}</span></div>
        <div class="chips">${(p.tech || []).slice(0, 6).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        <div class="links">${linksHTML(p)}<button class="pill pill--sm" type="button" data-open="${esc(p.id)}" data-cursor="OPEN">Details</button></div>
      </div>
    </article>`;
  }).join("");

  const ticketsEl = $("#tickets");
  ticketsEl.innerHTML = rest.map((p, i) => {
    const [n, c] = statFor(p);
    return `<button class="tk ${p.image ? "" : "tk--cover"} reveal" type="button" data-open="${esc(p.id)}" data-cat="${esc((p.categories || [])[0] || "")}" data-cursor="OPEN" aria-label="Open details for ${esc(p.title)}">
      ${mediaHTML(p, i + featured.length, false)}
      ${p.image ? `<div class="tk__stat"><span class="tk__n" data-count="${esc(n)}">${esc(n)}</span><span class="tk__c">${esc(c)}</span></div>` : ""}
      <div class="tk__body"><h4>${esc(p.title)}</h4><p>${esc(p.description)}</p></div>
    </button>`;
  }).join("");
  bindFallbacks(stack); bindFallbacks(ticketsEl);

  /* Filters */
  const filtersEl = $("#filters");
  const cats = ["all", ...new Set(rest.map((p) => (p.categories || [])[0]).filter(Boolean))];
  filtersEl.innerHTML = cats.map((c, i) => `<button type="button" data-f="${esc(c)}" aria-pressed="${i === 0}">${esc(c === "all" ? "All" : CAT[c] || c)}</button>`).join("");
  filtersEl.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-f]"); if (!b) return;
    $$("button", filtersEl).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $$(".tk", ticketsEl).forEach((t) => { t.hidden = b.dataset.f !== "all" && t.dataset.cat !== b.dataset.f; });
  });

  /* ---------------- Count-up ---------------- */
  function countUp(el) {
    const raw = el.dataset.count || "";
    const m = raw.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
    if (!m || isPlain() || (m[1].length > 2) || (m[3].length > 2)) return;
    const [, pre, val, suf] = m, target = parseFloat(val), dec = (val.split(".")[1] || "").length, t0 = performance.now(), dur = 1400;
    const step = (now) => {
      const t = clamp((now - t0) / dur), e = 1 - Math.pow(1 - t, 4);
      el.textContent = pre + (target * e).toFixed(dec) + suf;
      if (t < 1) requestAnimationFrame(step); else el.textContent = raw;
    };
    el.textContent = pre + (0).toFixed(dec) + suf;
    requestAnimationFrame(step);
  }

  /* ---------------- Reveal observer ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      $$("[data-count]", en.target).forEach(countUp);
      if (en.target.matches("[data-count]")) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal, .card .stat__n").forEach((el) => io.observe(el));

  /* ---------------- Project sheet ---------------- */
  const sheet = $("#sheet"), sheetInner = $("#sheetInner");
  let lastFocus = null;
  function openSheet(id) {
    const p = PROJECTS.find((x) => x.id === id); if (!p) return;
    const idx = PROJECTS.indexOf(p);
    const [n, c] = statFor(p);
    const list = (h, arr) => (arr && arr.length ? `<div><h5>${h}</h5><ul>${arr.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : "");
    sheetInner.innerHTML = `
      <div class="sheet__top"><div><h3 id="sheetTitle">${esc(p.title)}</h3><p>${esc(p.sub || p.description)}</p></div><button class="sheet__x" type="button" aria-label="Close" data-close>✕</button></div>
      ${p.image ? mediaHTML(p, idx, true) : ""}
      <div class="stat"><span class="stat__n">${esc(n)}</span><span class="stat__c">${esc(c)}</span></div>
      <p class="sheet__long">${esc(p.longDescription || p.description)}</p>
      <div class="sheet__cols">${list("What it does", p.feats)}${list("Outcomes", p.outcomes)}${list("Results", p.results)}${p.methods ? `<div><h5>Methods</h5><p>${esc(p.methods)}</p></div>` : ""}</div>
      <div class="chips">${(p.tech || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="links">${linksHTML(p)}</div>`;
    $$("img[data-fb]", sheetInner).forEach((img) => {
      const drop = () => { const w = img.closest(".win"); if (w) w.remove(); };
      if (img.complete && img.naturalWidth === 0) drop(); else img.addEventListener("error", drop, { once: true });
    });
    lastFocus = document.activeElement;
    sheet.showModal();
  }
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    if (o) { openSheet(o.dataset.open); return; }
    if (e.target.closest("[data-close]") || e.target === sheet) sheet.close();
  });
  sheet.addEventListener("close", () => { if (lastFocus && lastFocus.focus) lastFocus.focus(); });

  /* ---------------- Words fill (about) ---------------- */
  const fillEl = $("#fill");
  const fillText = fillEl.textContent.trim();
  fillEl.setAttribute("aria-label", fillText);
  fillEl.innerHTML = fillText.split(/\s+/).map((w) => `<span class="w" aria-hidden="true">${esc(w)}</span>`).join(" ");
  const words = $$(".w", fillEl);

  /* ---------------- Scroll engine ---------------- */
  const ride = $("#ride"), stage = $("#rideStage"), nav = $("#nav");
  const busLed = $("#busLed"), routeEl = nav.querySelector(".route");
  const stops = ["work", "experience", "awards", "about", "contact"].map((id) => ({ id, el: document.getElementById(id) }));
  const stopLinks = $$(".route__stop");
  const lineRoute = $("#lineRoute");
  const cards = $$(".card", stack);
  let ledState = "";
  let ticking = false;

  function update() {
    ticking = false;
    const vh = innerHeight, y = scrollY, plain = isPlain();

    nav.classList.toggle("is-stuck", y > 40);

    // hero ride progress
    const span = ride.offsetHeight - vh;
    const p = plain ? 0 : clamp(span > 0 ? y / span : 0);
    stage.style.setProperty("--p", p.toFixed(4));
    skyFar.style.setProperty("--sx", (-p * 380).toFixed(1));
    skyNear.style.setProperty("--sx", (-p * 1100).toFixed(1));
    stage.style.setProperty("--wheel", (0.7 - p * 0.42).toFixed(2) + "s");
    stage.style.setProperty("--road-speed", (1.1 - p * 0.7).toFixed(2) + "s");
    const want = p > 0.18 ? "RUTE 07 > WORK" : "APRI RACHMADI";
    if (want !== ledState && root.classList.contains("is-ready")) { ledState = want; ledSet(busLed, want); }

    // route progress + active stop
    const tops = stops.map((s) => s.el.getBoundingClientRect().top + y);
    const ref = y + vh * 0.4;
    let active = -1; tops.forEach((t, i) => { if (ref >= t) active = i; });
    let rp = 0;
    if (ref >= tops[tops.length - 1]) rp = 1;
    else if (ref > tops[0]) { const i = tops.findIndex((t, k) => ref >= t && ref < tops[k + 1]); rp = (i + (ref - tops[i]) / (tops[i + 1] - tops[i])) / (tops.length - 1); }
    routeEl.style.setProperty("--rp", rp.toFixed(4));
    stopLinks.forEach((a, i) => a.classList.toggle("is-active", i === active));

    // experience rail
    const lr = lineRoute.getBoundingClientRect();
    lineRoute.style.setProperty("--lp", clamp((vh * 0.6 - lr.top) / lr.height).toFixed(4));

    // about words
    const fr = fillEl.getBoundingClientRect();
    const fp = plain ? 1 : clamp((vh * 0.86 - fr.top) / (fr.height + vh * 0.42));
    const on = Math.round(fp * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < on));

    // stacked cards
    const wide = innerWidth > 920 && !plain;
    cards.forEach((c, i) => {
      const next = cards[i + 1];
      if (!wide || !next) { c.style.transform = ""; return; }
      const top = 72 + 12 + i * 16;
      const d = next.getBoundingClientRect().top - top;
      const t = clamp(1 - d / (c.offsetHeight * 0.95));
      c.style.transform = `scale(${(1 - 0.05 * t).toFixed(4)})`;
      c.style.filter = `brightness(${(1 - 0.12 * t).toFixed(3)})`;
    });
  }
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  update();

  /* ---------------- Cursor ---------------- */
  if (finePointer) {
    const cur = $("#cursor"), label = $(".cursor__label", cur);
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; cur.classList.add("is-on"); }, { passive: true });
    (function loop() { cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22; cur.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); })();
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor], a, button");
      if (t) { label.textContent = t.dataset.cursor || ""; cur.classList.toggle("is-big", !!t.dataset.cursor); } else cur.classList.remove("is-big");
    });
  }

  /* ---------------- Toast ---------------- */
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; t.setAttribute("role", "status");
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, 2200);
  }

  /* ---------------- Command palette ---------------- */
  const pal = $("#palette"), palInput = $("#paletteInput"), palList = $("#paletteList");
  const EMAIL = "rachmadiapri@gmail.com";
  const go = (id) => () => document.getElementById(id).scrollIntoView({ behavior: isPlain() ? "auto" : "smooth" });
  const commands = [
    { t: "Go to Work", k: "Stop 1", run: go("work") },
    { t: "Go to Roles", k: "Stop 2", run: go("experience") },
    { t: "Go to Wins", k: "Stop 3", run: go("awards") },
    { t: "Go to About", k: "Stop 4", run: go("about") },
    { t: "Go to Contact", k: "Stop 5", run: go("contact") },
    ...PROJECTS.map((p) => ({ t: `Open ${p.title}`, k: "Project", run: () => openSheet(p.id) })),
    { t: "Copy email address", k: "Action", run: () => { (navigator.clipboard ? navigator.clipboard.writeText(EMAIL) : Promise.reject()).then(() => toast("Email copied"), () => toast(EMAIL)); } },
    { t: "Toggle plain mode", k: "Action", run: () => setPlain(!isPlain()) },
    { t: "GitHub", k: "Link", run: () => open("https://github.com/aprirachmadi", "_blank", "noopener") },
    { t: "LinkedIn", k: "Link", run: () => open("https://www.linkedin.com/in/apri-rachmadi/", "_blank", "noopener") },
    { t: "Back to the main site", k: "Link", run: () => { location.href = "../"; } },
  ];
  let shown = [], sel = 0, palFocus = null;
  function renderPalette() {
    const q = palInput.value.toLowerCase().split(/\s+/).filter(Boolean);
    shown = commands.filter((c) => q.every((w) => (c.t + " " + c.k).toLowerCase().includes(w)));
    sel = Math.min(sel, Math.max(shown.length - 1, 0));
    palList.innerHTML = shown.map((c, i) => `<li role="option" aria-selected="${i === sel}" data-i="${i}"><span>${esc(c.t)}</span><small>${esc(c.k)}</small></li>`).join("") || `<li aria-disabled="true"><span>Nothing here. Try another word.</span></li>`;
    const s = $('[aria-selected="true"]', palList); if (s) s.scrollIntoView({ block: "nearest" });
  }
  function openPalette() { palFocus = document.activeElement; pal.hidden = false; palInput.value = ""; sel = 0; renderPalette(); palInput.focus(); }
  function closePalette() { pal.hidden = true; if (palFocus && palFocus.focus) palFocus.focus(); }
  function runSel() { const c = shown[sel]; if (!c) return; closePalette(); setTimeout(c.run, 30); }
  $("#paletteBtn").addEventListener("click", openPalette);
  palInput.addEventListener("input", () => { sel = 0; renderPalette(); });
  palList.addEventListener("click", (e) => { const li = e.target.closest("li[data-i]"); if (li) { sel = +li.dataset.i; runSel(); } });
  pal.addEventListener("mousedown", (e) => { if (e.target === pal) closePalette(); });
  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.hidden ? openPalette() : closePalette(); return; }
    if (pal.hidden) return;
    if (e.key === "Escape") closePalette();
    else if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(shown.length, 1); renderPalette(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(shown.length, 1); renderPalette(); }
    else if (e.key === "Enter") { e.preventDefault(); runSel(); }
  });

  /* ---------------- Contact form (Formspree) ---------------- */
  const form = $("#contactForm"), ok = $("#formOk");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const btn = $("button[type='submit']", form), original = btn.innerHTML;
    btn.disabled = true; btn.textContent = "Sending…";
    ok.classList.remove("show", "error");
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (res.ok) { ok.textContent = "Thanks, your message is on its way. I'll get back to you shortly."; ok.classList.add("show"); form.reset(); }
      else { ok.textContent = `That didn't go through. Please email me directly at ${EMAIL}.`; ok.classList.add("show", "error"); }
    } catch {
      ok.textContent = `Network problem. Please email me directly at ${EMAIL}.`; ok.classList.add("show", "error");
    } finally {
      btn.disabled = false; btn.innerHTML = original;
      setTimeout(() => ok.classList.remove("show"), 8000);
    }
  });
})();
