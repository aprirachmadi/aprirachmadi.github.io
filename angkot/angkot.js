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

  /* ---------------- Name letters ---------------- */
  const nameEl = $(".ride__name");
  let letterIdx = 0;
  $$(".line > span", nameEl).forEach((span) => {
    const txt = span.textContent;
    span.textContent = "";
    [...txt].forEach((ch) => { const s = document.createElement("span"); s.className = "ch"; s.style.setProperty("--i", letterIdx++); s.setAttribute("aria-hidden", "true"); s.textContent = ch; span.appendChild(s); });
  });
  setTimeout(() => nameEl.classList.add("is-landed"), 3200);

  /* ---------------- Loader ---------------- */
  const loader = $("#loader");
  const fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]);
  Promise.all([fontsReady, new Promise((r) => setTimeout(r, isPlain() ? 0 : 1400))]).then(() => {
    loader.classList.add("is-done");
    root.classList.add("is-ready");
    setTimeout(() => loader.remove(), 1400);
    ledSet($("#busLed"), "RUTE 07 / INDONESIA", 900);
  });

  /* ---------------- Jakarta clock ---------------- */
  const clockEl = $("#clock");
  const clockFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const tick = () => { clockEl.textContent = clockFmt.format(new Date()); };
  tick(); setInterval(tick, 1000);

  /* ---------------- Skyline art (generated) ---------------- */
  function mulberry(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  /* ---------------- Trees (shared by the skyline and roadside tiles) ---------------- */
  function palmTree(x, base, h, lean, fill, hi) {
    const P0 = [x, base], P1 = [x + lean * h * 0.15, base - h * 0.55], P2 = [x + lean * h, base - h];
    const pt = (t) => { const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t; return [a * P0[0] + b * P1[0] + c * P2[0], a * P0[1] + b * P1[1] + c * P2[1]]; };
    const tn = (t) => { const dx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]), dy = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]), l = Math.hypot(dx, dy); return [dx / l, dy / l]; };
    const f1 = (n) => n.toFixed(1), out = [];
    const L = [], R = [], rings = [];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14, [px, py] = pt(t), [tx, ty] = tn(t), w = h * (0.046 - 0.022 * t);
      L.push(`${f1(px - ty * w)} ${f1(py + tx * w)}`); R.unshift(`${f1(px + ty * w)} ${f1(py - tx * w)}`);
      if (i > 0 && i < 14) rings.push(`M${f1(px + ty * w)} ${f1(py - tx * w + w * 0.3)}L${f1(px - ty * w)} ${f1(py + tx * w + w * 0.3)}`);
    }
    out.push(`<path d="M${L.join("L")}L${R.join("L")}Z" fill="${fill}"/><path d="${rings.join("")}" stroke="${hi}" stroke-width="${f1(h * 0.009)}" fill="none" stroke-linecap="round"/>`);
    const [tx0, ty0] = P2;
    const fronds = [[-174, .52, .8], [-152, .56, .66], [-130, .5, .52], [-110, .36, .35], [-66, .38, .38], [-48, .5, .54], [-24, .56, .68], [2, .52, .82], [166, .46, .95], [28, .42, .98]];
    const frond = (a, len, drp) => {
      const ang = a * Math.PI / 180, Lf = h * len, ca = Math.cos(ang), sa = Math.sin(ang), rib = [], leaf = [];
      for (let k = 0; k <= 12; k++) { const t = k / 12; rib.push(`${f1(tx0 + ca * Lf * t)} ${f1(ty0 + sa * Lf * t + drp * Lf * t * t * 0.9)}`); }
      for (let t = 0.12; t <= 1.001; t += 0.052 + 0.075 * (1 - Math.abs(Math.cos(ang)))) {
        const px = tx0 + ca * Lf * t, py = ty0 + sa * Lf * t + drp * Lf * t * t * 0.9, dx = ca * Lf, dy = sa * Lf + 1.8 * drp * Lf * t * 0.9, dl = Math.hypot(dx, dy), ux = dx / dl, uy = dy / dl, nx = -uy, ny = ux, ll = Lf * 0.2 * (1 - 0.5 * t) * (0.5 + 0.5 * Math.abs(ca)), steep = 1 - Math.abs(ca);
        [1, -1].forEach((s) => leaf.push(`M${f1(px)} ${f1(py)}L${f1(px + s * nx * ll + ux * ll * 0.6)} ${f1(py + s * ny * ll + uy * ll * 0.6 + ll * (0.5 + 0.9 * steep))}`));
      }
      return { rib: `M${rib.join("L")}`, leaf: leaf.join("") };
    };
    const built = fronds.map(([a, l, d]) => frond(a, l, d));
    const draw = (items, col) => items.forEach((fr) => out.push(`<path d="${fr.leaf}" stroke="${col}" stroke-width="${f1(h * 0.011)}" stroke-linecap="round" fill="none"/><path d="${fr.rib}" stroke="${col}" stroke-width="${f1(h * 0.016)}" stroke-linecap="round" fill="none"/>`));
    draw(built.filter((_, i) => i % 2 === 0), fill);
    draw(built.filter((_, i) => i % 2 === 1), hi);
    [[-4, 7], [5, 9], [0, 13]].forEach(([dx, dy]) => out.push(`<circle cx="${f1(tx0 + dx * h / 150)}" cy="${f1(ty0 + dy * h / 150)}" r="${f1(h * 0.024)}" fill="${fill}" stroke="${hi}" stroke-width="${f1(h * 0.006)}"/>`));
    return out.join("");
  }
  function rainTree(x, base, h, fill, hi) {
    const f1 = (n) => n.toFixed(1), out = [], tw = h * 0.055, cy = base - h * 0.74, W = h * 1.2;
    out.push(`<path d="M${f1(x - tw)} ${base}Q${f1(x - tw * 0.8)} ${f1(base - h * 0.4)} ${f1(x - tw * 0.55)} ${f1(base - h * 0.55)}L${f1(x + tw * 0.55)} ${f1(base - h * 0.55)}Q${f1(x + tw * 0.8)} ${f1(base - h * 0.4)} ${f1(x + tw)} ${base}Z" fill="${fill}"/>`);
    out.push(`<path d="M${x} ${f1(base - h * 0.5)}Q${f1(x - h * 0.2)} ${f1(base - h * 0.58)} ${f1(x - W * 0.52)} ${f1(cy + h * 0.08)}M${x} ${f1(base - h * 0.5)}Q${f1(x + h * 0.22)} ${f1(base - h * 0.6)} ${f1(x + W * 0.54)} ${f1(cy + h * 0.08)}M${x} ${f1(base - h * 0.52)}Q${f1(x - h * 0.06)} ${f1(base - h * 0.66)} ${f1(x - W * 0.2)} ${f1(cy + h * 0.1)}M${x} ${f1(base - h * 0.52)}Q${f1(x + h * 0.08)} ${f1(base - h * 0.66)} ${f1(x + W * 0.22)} ${f1(cy + h * 0.1)}" stroke="${fill}" stroke-width="${f1(h * 0.03)}" stroke-linecap="round" fill="none"/>`);
    const blobs = [[-0.62, 0.06, 0.13], [-0.48, -0.02, 0.16], [-0.3, -0.08, 0.18], [-0.1, -0.12, 0.19], [0.1, -0.12, 0.19], [0.3, -0.08, 0.18], [0.48, -0.02, 0.16], [0.62, 0.06, 0.13], [-0.36, 0.08, 0.14], [-0.05, 0.07, 0.16], [0.26, 0.08, 0.15]];
    blobs.forEach(([dx, dy, r]) => out.push(`<circle cx="${f1(x + dx * W)}" cy="${f1(cy + dy * h)}" r="${f1(r * h)}" fill="${fill}"/>`));
    let sd = 7; const rd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
    for (let i = 0; i < 70; i++) { const a = Math.PI * (0.04 + 0.92 * rd()), rr = rd(); out.push(`<circle cx="${f1(x - W * 0.62 * Math.cos(a) * (0.35 + 0.65 * rr))}" cy="${f1(cy - h * 0.2 * Math.sin(a) * (0.3 + 0.7 * rr) - h * 0.02)}" r="${f1(h * (0.016 + 0.026 * rd()))}" fill="${hi}"/>`); }
    for (let i = 0; i < 20; i++) { const a = Math.PI * (0.06 + 0.88 * i / 19); out.push(`<circle cx="${f1(x - W * 0.66 * Math.cos(a))}" cy="${f1(cy - h * 0.2 * Math.sin(a) - h * 0.045)}" r="${f1(h * 0.026)}" fill="${hi}"/>`); }
    for (let i = 0; i < 9; i++) { const dx = -0.55 + i * 0.14; out.push(`<circle cx="${f1(x + dx * W)}" cy="${f1(cy + h * (0.14 + 0.02 * (i % 2)))}" r="${f1(h * 0.032)}" fill="${fill}"/>`); }
    return out.join("");
  }
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
      // coconut palms
      parts.push(palmTree(180, H, 175, 0.2, fill, "#432839"), palmTree(990, H, 160, -0.16, fill, "#432839"), palmTree(1290, H, 185, 0.12, fill, "#432839"));
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join("")}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }
  function landmarkTile() {
    const W = 2800, H = 420, P = [], f = "#8d3a5e", lit = "#ffd45e";
    let seed = 5; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const windows = (x, y, w, h) => { for (let wy = y + 12; wy < y + h - 8; wy += 15) for (let wx = x + 7; wx < x + w - 8; wx += 12) if (rnd() < 0.34) P.push(`<rect x="${wx}" y="${wy}" width="5" height="7" fill="${lit}" opacity=".7"/>`); };
    const wisma = (x) => { const w = 72, h = 300, y = H - h; P.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/><rect x="${x + 10}" y="${y - 26}" width="${w - 20}" height="26" fill="${f}"/><rect x="${x + 22}" y="${y - 46}" width="${w - 44}" height="20" fill="${f}"/><path d="M${x + w / 2 - 6} ${y - 46}L${x + w / 2} ${y - 118}L${x + w / 2 + 6} ${y - 46}Z" fill="${f}"/>`); windows(x, y, w, h); };
    const glass = (x) => { const w = 60, h = 350, y = H - h; P.push(`<path d="M${x} ${H}V${y + 34}L${x + w} ${y}V${H}Z" fill="${f}"/><rect x="${x + w / 2 - 2}" y="${y - 40}" width="4" height="48" fill="${f}"/>`); windows(x, y + 30, w, h - 30); };
    const twin = (x) => { P.push(`<rect x="${x}" y="${H - 270}" width="46" height="270" fill="${f}"/><rect x="${x + 70}" y="${H - 236}" width="46" height="236" fill="${f}"/><rect x="${x + 46}" y="${H - 176}" width="24" height="16" fill="${f}"/><rect x="${x - 2}" y="${H - 276}" width="50" height="8" fill="${f}"/><rect x="${x + 68}" y="${H - 242}" width="50" height="8" fill="${f}"/>`); windows(x, H - 270, 46, 270); windows(x + 70, H - 236, 46, 236); };
    const stepped = (x) => { P.push(`<rect x="${x}" y="${H - 210}" width="100" height="210" fill="${f}"/><rect x="${x + 16}" y="${H - 262}" width="68" height="52" fill="${f}"/><rect x="${x + 32}" y="${H - 304}" width="36" height="42" fill="${f}"/><rect x="${x + 48}" y="${H - 350}" width="4" height="46" fill="${f}"/>`); windows(x, H - 210, 100, 210); };
    const monas = (cx) => {
      P.push(`<circle cx="${cx}" cy="${H - 360}" r="58" fill="#ffc61a" opacity=".28"/>`);
      P.push(`<rect x="${cx - 160}" y="${H - 12}" width="320" height="12" fill="${f}"/><rect x="${cx - 108}" y="${H - 34}" width="216" height="22" fill="${f}"/><rect x="${cx - 80}" y="${H - 70}" width="160" height="36" fill="${f}"/>`);
      P.push(`<path d="M${cx - 24} ${H - 70}L${cx + 24} ${H - 70}L${cx + 11} ${H - 300}L${cx - 11} ${H - 300}Z" fill="${f}"/>`);
      P.push(`<path d="M${cx - 38} ${H - 316}L${cx + 38} ${H - 316}L${cx + 22} ${H - 294}L${cx - 22} ${H - 294}Z" fill="${f}"/>`);
      P.push(`<path d="M${cx} ${H - 398}C${cx + 17} ${H - 372} ${cx + 22} ${H - 350} ${cx + 14} ${H - 332}C${cx + 8} ${H - 320} ${cx - 8} ${H - 320} ${cx - 14} ${H - 332}C${cx - 22} ${H - 350} ${cx - 17} ${H - 372} ${cx} ${H - 398}Z" fill="#ffc61a"/><path d="M${cx} ${H - 372}C${cx + 8} ${H - 358} ${cx + 9} ${H - 346} ${cx + 5} ${H - 338}C${cx + 2} ${H - 332} ${cx - 2} ${H - 332} ${cx - 5} ${H - 338}C${cx - 9} ${H - 346} ${cx - 8} ${H - 358} ${cx} ${H - 372}Z" fill="#fff3a8"/>`);
    };
    // low filler blocks so the landmarks stand in a skyline
    for (let x = 0; x < W;) { const w = 50 + rnd() * 80, h = 70 + rnd() * 110; P.push(`<rect x="${x}" y="${H - h}" width="${w}" height="${h}" fill="${f}"/>`); x += w + rnd() * 10; }
    wisma(200); glass(520); twin(820); stepped(1960); monas(1400); glass(2300); wisma(2560);
    return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${P.join("")}</svg>`)}")`;
  }
  function roadsideTile() {
    const f = "#1f1319", hi = "#3c2536", W = 1600, H = 300, dy = H - 220, P = [];
    const g = (s) => `<g transform="translate(0,${dy})">${s}</g>`;
    const lamp = (x) => P.push(g(`<rect x="${x}" y="40" width="7" height="${220 - 40}" fill="${f}"/><path d="M${x + 3} 44h46v7h-46z" fill="${f}"/><rect x="${x + 40}" y="50" width="22" height="9" rx="3" fill="${f}"/><circle cx="${x + 51}" cy="66" r="15" fill="#ffd45e" opacity=".55"/>`));
    const warung = (x) => {
      let st = ""; for (let i = 0; i < 8; i++) st += `<path d="M${x + i * 22} 96h22l-3 22h-22z" fill="${i % 2 ? "#f4f1e6" : "#ff4122"}"/>`;
      P.push(g(`<rect x="${x + 6}" y="118" width="164" height="102" fill="${f}"/>${st}<rect x="${x + 6}" y="92" width="170" height="8" fill="${f}"/><rect x="${x + 22}" y="132" width="60" height="34" fill="#ffd45e" opacity=".75"/><rect x="${x + 96}" y="140" width="56" height="80" fill="#3a2630"/><circle cx="${x + 150}" cy="86" r="5" fill="#ffd45e"/>`));
    };
    P.push(palmTree(330, H, 185, 0.18, f, hi)); warung(520); lamp(880); P.push(rainTree(1090, H, 150, f, hi)); lamp(1320); P.push(palmTree(1500, H, 170, -0.14, f, hi));
    return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${P.join("")}</svg>`)}")`;
  }
  const skyLm = $("#skyLm");
  skyLm.style.backgroundImage = landmarkTile();
  skyLm.style.backgroundSize = "auto 100%";
  const starsEl = $("#stars");
  { const r = mulberry(77); for (let i = 0; i < 46; i++) { const s = document.createElement("i"); s.style.left = (r() * 100).toFixed(1) + "%"; s.style.top = (r() * 100).toFixed(1) + "%"; s.style.animationDelay = (-r() * 3).toFixed(2) + "s"; if (r() > .7) { s.style.width = s.style.height = "4px"; } starsEl.appendChild(s); } }
  const roadside = $("#roadside");
  roadside.style.backgroundImage = roadsideTile();
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
  sheet.addEventListener("close", () => { if (lastFocus && lastFocus.focus && $("#palette").hidden) lastFocus.focus(); });

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
  const BAND = ["#ff4122", "#ff4122", "#ffc61a", "#0fb5a6", "#ff8fb8", "#ffc61a"];
  let ledState = "";
  let ticking = false;
  let heroP = 0;

  function update() {
    ticking = false;
    const vh = innerHeight, y = scrollY, plain = isPlain();

    nav.classList.toggle("is-stuck", y > 40);

    // hero ride progress
    const span = ride.offsetHeight - vh;
    const p = plain ? 0 : clamp(span > 0 ? y / span : 0);
    stage.style.setProperty("--p", p.toFixed(4));
    heroP = p;
    const want = p > 0.18 ? "NEXT STOP: WORK" : "RUTE 07 / INDONESIA";
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
    root.style.setProperty("--band", BAND[active + 1]);

    // experience rail
    const lr = lineRoute.getBoundingClientRect();
    lineRoute.style.setProperty("--lp", clamp((vh * 0.6 - lr.top) / lr.height).toFixed(4));

    // about words
    const fr = fillEl.getBoundingClientRect();
    const fp = plain ? 1 : clamp((vh * 0.86 - fr.top) / (fr.height + vh * 0.42));
    const on = Math.round(fp * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < on));

    updateDeco();

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
  /* ---------------- Floating shapes (generated per stop) ---------------- */
  const SHAPES = ["star", "ring", "dot", "plus", "wave", "star", "ring", "dot"];
  const SYM = { star: "✺", plus: "+" };
  const WAVE = '<svg viewBox="0 0 80 20"><path d="M2 12q9-14 19 0t19 0 19 0 19 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>';
  const decos = [];
  $$(".stop").forEach((sec, si) => {
    const wrap = document.createElement("div"); wrap.className = "deco"; wrap.setAttribute("aria-hidden", "true");
    const rng = mulberry(100 + si * 17);
    SHAPES.forEach((type, k) => {
      const i = document.createElement("i");
      i.className = type; i.style.setProperty("--x", (rng() * 94).toFixed(1) + "%"); i.style.setProperty("--y", (rng() * 92).toFixed(1) + "%");
      i.style.setProperty("--sz", (type === "star" ? 30 + rng() * 40 : 22 + rng() * 42).toFixed(0) + "px"); i.style.setProperty("--ft", (4 + rng() * 5).toFixed(1) + "s");
      if (k % 3 === 1) i.style.color = "var(--red)"; if (k % 4 === 2) i.style.color = "var(--cream)";
      if (type === "wave") i.innerHTML = WAVE; else if (SYM[type]) i.textContent = SYM[type];
      wrap.appendChild(i); decos.push({ el: i, sec, speed: (rng() - 0.5) * 0.5 });
    });
    sec.prepend(wrap);
  });
  function updateDeco() {
    if (isPlain()) return;
    const vh = innerHeight;
    const cache = new Map();
    decos.forEach((d) => {
      let off = cache.get(d.sec);
      if (off === undefined) { const r = d.sec.getBoundingClientRect(); off = r.top + r.height / 2 - vh / 2; cache.set(d.sec, off); }
      d.el.style.transform = `translateY(${(off * d.speed).toFixed(1)}px)`;
    });
  }

  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  update();

  /* ---------------- Live scene: exhaust, traffic, velocity ---------------- */
  const halteEl = $("#halte");
  const smokeEl = $("#smoke"), traffic = $("#traffic"), honk = $("#honk"), busBody = $("#busBody");
  const pick = (a) => a[(Math.random() * a.length) | 0];
  let vel = 0, lastY = scrollY, drift = 0, accum = 0, heroVisible = true, lastT = performance.now();
  function puff() {
    const s = document.createElement("span");
    s.className = "puff"; s.dataset.dark = vel > 0.22 ? "1" : "0";
    s.style.cssText = `--s:${(10 + Math.random() * 10).toFixed(0)}px;--dx:${(-70 - Math.random() * 110).toFixed(0)}px;--dy:${(-26 - Math.random() * 54).toFixed(0)}px`;
    s.addEventListener("animationend", () => s.remove(), { once: true });
    smokeEl.appendChild(s);
  }
  function lifeLoop(now) {
    requestAnimationFrame(lifeLoop);
    const dt = Math.min(0.05, ((now || performance.now()) - lastT) / 1000); lastT = now || performance.now();
    const dy = Math.abs(scrollY - lastY); lastY = scrollY;
    vel += (Math.min(dy, 90) / 90 - vel) * 0.1;
    root.style.setProperty("--v", isPlain() ? "0" : vel.toFixed(3));
    if (isPlain()) return;
    const r = stage.getBoundingClientRect();
    heroVisible = r.bottom > 0 && r.top < innerHeight;
    if (!heroVisible) return;
    const roadSec = Math.max(0.16, 1.1 - heroP * 0.5 - vel * 0.9);
    drift += (150 / roadSec) * dt;                 // ground speed in px/s: the road dashes cover 150px per cycle
    skyFar.style.setProperty("--sx", (-heroP * 380 - drift * 0.14).toFixed(1));
    skyNear.style.setProperty("--sx", (-heroP * 1100 - drift * 0.5).toFixed(1));
    const lmBase = -1400 * (skyLm.offsetHeight / 420) + innerWidth * 0.405;
    skyLm.style.setProperty("--sx", (lmBase - heroP * 700 - drift * 0.28).toFixed(1));
    const ground = heroP * 1700 + drift;
    stage.style.setProperty("--g150", (ground % 150).toFixed(2)); stage.style.setProperty("--g46", (ground % 46).toFixed(2)); stage.style.setProperty("--g44", (ground % 44).toFixed(2));
    roadside.style.setProperty("--sx", (-ground).toFixed(1));
    { const hw = halteEl.offsetWidth, period = Math.max(2300, innerWidth + hw + 700); halteEl.style.transform = `translateX(${(((((560 - ground + hw) % period) + period) % period) - hw).toFixed(1)}px)`; }
    stage.style.setProperty("--wheel", Math.max(0.2, 0.7 - heroP * 0.3 - vel * 0.4).toFixed(2) + "s");
    stage.style.setProperty("--road-speed", Math.max(0.16, 1.1 - heroP * 0.5 - vel * 0.9).toFixed(2) + "s");
    if (heroP < 0.85) { accum = Math.min(accum + 0.06 + vel * 0.9, 3); while (accum > 1 && smokeEl.childElementCount < 36) { accum -= 1; puff(); } }
  }
  requestAnimationFrame(lifeLoop);

  const bikeSVG = (c, h, pax) => {
    const ink = "#151412", jeans = "#27408f", skin = "#c98f5e", jacket = "#2fae5b";
    const limb = (d, w, col) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const passenger = pax ? `<path d="M26 50Q26 28 40 22L50 28Q44 36 44 50Z" fill="#ff8fb8" stroke="${ink}" stroke-width="3"/><circle cx="38" cy="14" r="9" fill="#e0457b" stroke="${ink}" stroke-width="3"/><circle cx="41" cy="15" r="5.2" fill="${skin}"/>` : `<path d="M32 22H58V46H32Z" fill="${jacket}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><path d="M32 32H58" stroke="#f4f1e6" stroke-width="4"/>`;
    return `<svg viewBox="0 -6 150 106" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="76" cy="91" rx="64" ry="4" fill="rgba(21,20,18,.25)"/>
    <g class="bw"><circle cx="30" cy="74" r="16" fill="${ink}"/><circle cx="30" cy="74" r="6.5" fill="#d9d4c7"/><path d="M30 62V86M18 74H42" stroke="#8d887c" stroke-width="2"/></g>
    <g class="bw"><circle cx="122" cy="74" r="16" fill="${ink}"/><circle cx="122" cy="74" r="6.5" fill="#d9d4c7"/><path d="M122 62V86M110 74H134" stroke="#8d887c" stroke-width="2"/></g>
    ${passenger}
    <path d="M108 36L124 74" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
    <path d="M10 70C8 52 22 46 38 46H60L68 60L60 70L40 74H24C16 74 11 73 10 70Z" fill="${c}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M22 45Q46 35 72 45L70 50H24Z" fill="#2b1d17" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M62 62H100L104 70L60 73Z" fill="${c}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M96 70L100 34L112 30L117 54L110 72Z" fill="${c}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M111 66Q124 52 141 66L137 70Q124 60 115 70Z" fill="${c}" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M102 32L119 27M106 29L102 19" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="100" cy="15" rx="5" ry="3.5" fill="#bfe6fa" stroke="${ink}" stroke-width="2"/>
    <circle cx="117" cy="41" r="6.5" fill="#fff6bf" stroke="${ink}" stroke-width="2.5"/>
    <rect x="5" y="52" width="6" height="11" rx="2" fill="#ff2e2e" stroke="${ink}" stroke-width="2"/>
    <g class="rider">
      ${limb("M54 49L83 55", 9, jeans)}${limb("M83 55L85 69", 8, jeans)}<ellipse cx="90" cy="71" rx="9" ry="4.2" fill="${ink}"/>
      <path d="M44 50Q46 24 64 18L77 25Q69 33 67 50Z" fill="${jacket}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
      ${limb("M68 26L104 33", 7, jacket)}<circle cx="106" cy="33" r="4.5" fill="${skin}" stroke="${ink}" stroke-width="2"/>
      <circle cx="72" cy="11" r="10.5" fill="${h}" stroke="${ink}" stroke-width="3"/>
      <path d="M77 6Q89 6 89 15L77 16Z" fill="${ink}"/><path d="M78 8Q85 8 86 12" stroke="#7fd0f5" stroke-width="2" fill="none"/>
    </g>
  </svg>`;
  };
  const vanSVG = (c) => `<svg viewBox="0 0 120 60"><path d="M6 46V16Q6 10 12 10H80Q86 10 90 16L98 28H108Q114 28 114 36V46Z" fill="${c}" stroke="#151412" stroke-width="3"/><rect x="12" y="16" width="16" height="12" rx="2" fill="#dff1fa" stroke="#151412" stroke-width="2"/><rect x="32" y="16" width="16" height="12" rx="2" fill="#dff1fa" stroke="#151412" stroke-width="2"/><rect x="52" y="16" width="16" height="12" rx="2" fill="#dff1fa" stroke="#151412" stroke-width="2"/><path d="M72 16H82L90 28H72Z" fill="#dff1fa" stroke="#151412" stroke-width="2"/><rect x="6" y="34" width="108" height="6" fill="#f4f1e6"/><circle cx="28" cy="48" r="9" fill="#151412"/><circle cx="92" cy="48" r="9" fill="#151412"/><circle cx="28" cy="48" r="3.5" fill="#d9d4c7"/><circle cx="92" cy="48" r="3.5" fill="#d9d4c7"/></svg>`;
  const HELMETS = ["#ff4122", "#ffc61a", "#0fb5a6", "#ff8fb8", "#7f9bff"];
  const VANS = ["#2fae5b", "#ffc61a", "#ff8fb8", "#f4f1e6", "#ff7a2f"];
  function spawn() {
    if (!isPlain() && !document.hidden && heroVisible && heroP < 0.9 && traffic.childElementCount < 2) {
      const nearCount = traffic.querySelectorAll(".veh--near").length, farCount = traffic.querySelectorAll(".veh--far").length;
      let near = Math.random() < 0.62; if (near && nearCount >= 1) near = false; if (!near && farCount >= 1) near = nearCount < 1;
      const el = document.createElement("div");
      el.className = "veh " + (near ? "veh--near" : "veh--far");
      el.innerHTML = near ? bikeSVG(pick(HELMETS), pick(HELMETS), Math.random() < 0.38) : vanSVG(pick(VANS));
      el.style.animationDuration = (near ? 7 + Math.random() * 4 : 12 + Math.random() * 5).toFixed(1) + "s";
      el.addEventListener("animationend", () => el.remove(), { once: true });
      traffic.appendChild(el);
    }
    setTimeout(spawn, 1500 + Math.random() * 3500);
  }
  setTimeout(spawn, 1800);

  /* honk the horn: dual-tone disc horn (~355 + 430 Hz, the flat-diaphragm pair most cars and angkot use) */
  let actx;
  function horn(t0, dur, f1, f2) {
    [f1, f2].forEach((f) => ["sawtooth", "square"].forEach((type, k) => {
      const o = actx.createOscillator(), g = actx.createGain(), lp = actx.createBiquadFilter();
      o.type = type; o.frequency.setValueAtTime(f * 0.97, t0); o.frequency.exponentialRampToValueAtTime(f * (k ? 1.004 : 1), t0 + 0.035);
      lp.type = "lowpass"; lp.frequency.value = 2400; lp.Q.value = 1.5;
      const peak = k ? 0.018 : 0.032;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012); g.gain.setValueAtTime(peak, t0 + dur - 0.025); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(lp).connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + dur + 0.03);
    }));
  }
  function telolet(t0) {
    // "Om Telolet Om": the musical air horn on Indonesian buses, here as a quick brassy phrase
    [[392, 0.13], [494, 0.13], [587, 0.13], [494, 0.13], [587, 0.5]].reduce((t, [f, d]) => {
      [f, f * 1.5].forEach((ff) => {
        const o = actx.createOscillator(), g = actx.createGain(), lp = actx.createBiquadFilter();
        o.type = "sawtooth"; o.frequency.value = ff; lp.type = "lowpass"; lp.frequency.value = 1700;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.035, t + 0.02); g.gain.setValueAtTime(0.035, t + d - 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(lp).connect(g).connect(actx.destination); o.start(t); o.stop(t + d + 0.02);
      });
      return t + d + 0.02;
    }, t0);
  }
  function beep(special) {
    if (isPlain()) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t = actx.currentTime;
      if (special) telolet(t); else { horn(t, 0.17, 355, 430); horn(t + 0.26, 0.17, 355, 430); }
    } catch { /* audio unavailable */ }
  }
  const clicks = [];
  busBody.addEventListener("click", () => {
    const now = performance.now(); clicks.push(now); while (clicks.length && now - clicks[0] > 1400) clicks.shift();
    const special = clicks.length >= 3; if (special) clicks.length = 0;
    honk.textContent = special ? "OM TELOLET OM!" : "TIN TIN!";
    honk.classList.remove("on"); busBody.classList.remove("hop"); void honk.offsetWidth;
    honk.classList.add("on"); busBody.classList.add("hop"); beep(special);
    for (let i = 0; i < (special ? 12 : 6); i++) setTimeout(puff, i * 40);
  });

  /* click sparks + ticket tilt */
  const SPARK = ["#ff4122", "#ffc61a", "#0fb5a6", "#ff8fb8", "#f4f1e6"];
  addEventListener("pointerdown", (e) => {
    if (isPlain() || e.target.closest("input, textarea, dialog, .palette")) return;
    for (let i = 0; i < 9; i++) {
      const s = document.createElement("i"), a = (Math.PI * 2 * i) / 9 + Math.random() * 0.4, d = 34 + Math.random() * 36;
      s.className = "spark"; s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--x:${(Math.cos(a) * d).toFixed(0)}px;--y:${(Math.sin(a) * d).toFixed(0)}px;background:${pick(SPARK)}`;
      s.addEventListener("animationend", () => s.remove(), { once: true });
      document.body.appendChild(s);
    }
  });
  document.addEventListener("pointermove", (e) => {
    const t = e.target.closest && e.target.closest(".tk");
    if (!t || isPlain() || e.pointerType === "touch") return;
    const r = t.getBoundingClientRect();
    t.style.setProperty("--rx", (((e.clientY - r.top) / r.height - 0.5) * -9).toFixed(1) + "deg");
    t.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 11).toFixed(1) + "deg");
  });
  document.addEventListener("pointerout", (e) => { const t = e.target.closest && e.target.closest(".tk"); if (t) { t.style.removeProperty("--rx"); t.style.removeProperty("--ry"); } });

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
