/* ============================================================
   Evidence Edition Portfolio — interactions
   - Boot sequence intro (masks load, then hands off to hero)
   - Signature cursor (dot + eased ring, contextual label)
   - Orbital field canvas (acid / technical diagram)
   - Choreographed hero entrance + scroll reveal
   - Verified-ledger count-up
   - Project data array + category filtering + featured default
   - Expandable exhibit rows with image fallbacks
   - Formspree contact form
   ============================================================ */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- Boot sequence intro ---------------- */
function showHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const sequence = [
    ".hero__topline",
    ".hero__title-line:nth-child(1)",
    ".hero__title-line:nth-child(2)",
    ".hero__body .hero__intro",
    ".hero__side",
    ".hero__bottom",
  ];
  sequence.forEach((sel, i) => {
    const el = hero.querySelector(sel);
    if (el) setTimeout(() => el.classList.add("in"), 120 + i * 120);
  });
}

function runIntro() {
  const intro = document.getElementById("intro");
  if (!intro || REDUCED_MOTION) { showHero(); if (intro) intro.hidden = true; return; }

  const count = intro.querySelector("#introCount");
  const bar = intro.querySelector("#introBar");
  const done = () => {
    if (!intro.classList.contains("done")) return;
    showHero();
    setTimeout(() => { intro.hidden = true; }, 760);
  };

  const DURATION = 1150;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / DURATION, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const n = Math.round(eased * 100);
    if (count) count.textContent = String(n).padStart(3, "0");
    if (bar) bar.style.width = `${eased * 100}%`;
    if (p < 1) requestAnimationFrame(tick);
    else { intro.classList.add("done"); setTimeout(done, 60); }
  }
  requestAnimationFrame(tick);
  setTimeout(() => { intro.classList.add("done"); done(); }, 2800); // failsafe
}
runIntro();

/* ---------------- Exhibit year stamp ---------------- */
(function () {
  const el = document.getElementById("exhibitYear");
  if (el) el.textContent = String(new Date().getFullYear());
})();

/* ---------------- Evidence radar — live telemetry orbit ---------------- */
(function () {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const hero = canvas.closest(".hero") || canvas.parentElement;
  const ctx = canvas.getContext("2d");
  if (!hero || !ctx) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w = 1, h = 1, dpr = 1, t = 0, raf = 0, running = false, visible = false;

  // Pointer target / smoothed center drift / instrument-lines presence
  const pointer = { x: 0, y: 0, active: false };
  const drift = { x: 0, y: 0, sx: 0, sy: 0 };

  function resize() {
    const rect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Point at param a on a rotated ellipse
  function orbitPt(cx, cy, rx, ry, rot, a) {
    const px = rx * Math.cos(a);
    const py = ry * Math.sin(a);
    const cosR = Math.cos(rot), sinR = Math.sin(rot);
    return { x: cx + px * cosR - py * sinR, y: cy + px * sinR + py * cosR };
  }

  function ellipse(cx, cy, rx, ry, rot, color, dash = [], width = 1, dashOff = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.setLineDash(dash);
    ctx.lineDashOffset = dashOff;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const compact = w < 900;
    const s = compact ? 0.68 : 1;
    const acidAlpha = compact ? 0.42 : 0.68;
    const driftAmt = compact ? 10 : 26;
    const cx = w * (compact ? 0.5 : 0.56) + drift.sx * driftAmt;
    const cy = h * (compact ? 0.42 : 0.45) + drift.sy * driftAmt;

    const RX = w * 0.37 * s, RY = h * 0.16 * s;   // outer dashed telemetry ring
    const ACRX = w * 0.53 * s, ACRY = h * 0.64 * s; // giant acid orbit

    // --- Precession: every ring rotates on its own axis, at its own rate ---
    // Orbit planes drift slowly, so the whole diagram precesses like gyroscopes.
    const ROT = {
      a: -0.045 + t * 0.13, // outer telemetry ring (~160 s per tilt loop)
      b: 0.26 + t * 0.3,    // violet middle ring (fastest)
      c: -0.45 - t * 0.21,  // gray ring (counter-rotates)
      g: -0.85 + t * 0.15,  // giant acid orbit (~175 s, the slow anchor)
      gAqua: -0.84 + t * 0.1,
      gRose: -0.84 + t * 0.27,
    };

    // --- Rings: dashes march, so every ring visibly revolves ---
    ellipse(cx, cy, RX, RY, ROT.a, "rgba(23, 38, 60, 0.24)", [9, 6], 1.2, -t * 30);
    ellipse(cx, cy, w * 0.15 * s, h * 0.31 * s, ROT.b, "rgba(83, 68, 178, 0.34)", [6, 4], 1.1, t * 26);
    ellipse(cx, cy, w * 0.2 * s, h * 0.38 * s, ROT.c, "rgba(93, 105, 129, 0.22)", [4, 5], 0.8, -t * 18);
    ellipse(cx, cy, ACRX, ACRY, ROT.g, `rgba(166, 203, 49, ${acidAlpha})`, [], 2.4);
    ellipse(cx, cy, w * 0.54 * s, h * 0.64 * s, ROT.gAqua, "rgba(167, 209, 207, 0.34)", [], 14);
    ellipse(cx, cy, w * 0.54 * s, h * 0.64 * s, ROT.gRose, "rgba(232, 185, 212, 0.3)", [], 24);

    // --- Satellite belt on the outer dashed ring (the node registry) ---
    const sats = [];
    for (let i = 0; i < 42; i++) {
      const a = (i / 42) * Math.PI * 2 + t * 0.14;
      const p = orbitPt(cx, cy, RX, RY, ROT.a, a);
      sats.push(p);
      let r = i % 7 === 0 ? 2.2 : 0.65;
      let fill = i % 7 === 0 ? "rgba(83, 68, 178, 0.75)" : "rgba(93, 105, 129, 0.4)";
      let halo = null;
      if (pointer.active) {
        const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (d < 130) {
          const k = 1 - d / 130;
          r += k * 2.2;
          halo = `rgba(166, 203, 49, ${0.30 * k})`;
          fill = `rgba(92, 116, 22, ${0.5 + 0.5 * k})`;
        }
      }
      if (halo) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 5, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
    }

    // --- Inner nucleus riders ---
    for (let i = 0; i < 4; i++) {
      const a = t * (i % 2 ? -0.7 : 0.9) + i * 1.7;
      const p = orbitPt(cx, cy, w * 0.15 * s, h * 0.31 * s, ROT.b, a);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(83, 68, 178, 0.72)";
      ctx.fill();
    }

    // --- Data pulses riding the giant acid ring (telemetry on delivery) ---
    const pulses = prefersReduced ? [0.15, 0.5, 0.85] : [t * 0.35, t * 0.35 + 2.3, t * 0.35 + 4.6];
    const TAIL = 9;
    for (let n = 0; n < pulses.length; n++) {
      const head = pulses[n];
      for (let k = TAIL; k >= 0; k--) {
        const a = head - k * 0.055;
        const p = orbitPt(cx, cy, ACRX, ACRY, ROT.g, a);
        const fade = Math.pow(1 - k / (TAIL + 1), 2);
        ctx.beginPath();
        ctx.arc(p.x, p.y, k === 0 ? 3.4 : 2.6, 0, Math.PI * 2);
        ctx.fillStyle = k === 0
          ? "rgba(255, 255, 255, 0.95)"
          : `rgba(166, 203, 49, ${(0.85 * fade).toFixed(3)})`;
        ctx.fill();
        if (k === 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(166, 203, 49, 0.22)";
          ctx.fill();
        }
      }
    }

    // --- Instrument lines: cursor constellation to nearest nodes ---
    if (pointer.active) {
      const links = sats
        .map((p) => ({ p, d: Math.hypot(p.x - pointer.x, p.y - pointer.y) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);
      for (const { p, d } of links) {
        const k = Math.max(0, 1 - d / 240);
        if (k <= 0.02) continue;
        ctx.beginPath();
        ctx.moveTo(pointer.x, pointer.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(83, 68, 178, ${(0.48 * k).toFixed(3)})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6 + k * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(166, 203, 49, ${(0.8 * k).toFixed(3)})`;
        ctx.fill();
      }
    }

    // --- Wind-carried signal ribbon ---
    ctx.beginPath();
    for (let i = 0; i < 260; i++) {
      const x = w * 0.24 * s + 0.02 * w * s + (i / 259) * w * 0.52 * s;
      const envelope = Math.exp(-Math.pow((i - 130) / 60, 2));
      const y = cy + Math.sin(i * 0.63 + t * 8) * envelope * 15 * s * Math.sin(i * 0.12);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = compact ? "rgba(93, 105, 129, 0.16)" : "rgba(93, 105, 129, 0.3)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // --- slowly rotating core marker ---
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.25);
    ctx.strokeStyle = "rgba(83, 68, 178, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-9, 0); ctx.lineTo(9, 0);
    ctx.moveTo(0, -9); ctx.lineTo(0, 9);
    ctx.moveTo(6, 0); ctx.lineTo(9, 0); // tick marks break the symmetry
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function frame() {
    // smooth the drift toward its target, then render
    drift.sx += (drift.x - drift.sx) * 0.06;
    drift.sy += (drift.y - drift.sy) * 0.06;
    t += 0.005;
    draw();
    raf = running ? requestAnimationFrame(frame) : 0;
  }

  function start() {
    if (running || prefersReduced || !visible) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.05 }).observe(hero);
  }

  function redraw() {
    resize();
    if (prefersReduced) draw();
  }

  resize();
  if (prefersReduced) {
    draw();
    visible = true;
  } else {
    visible = true;
    start();
  }

  window.addEventListener("resize", redraw);
  window.addEventListener("load", redraw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);

  window.addEventListener("pointermove", (e) => {
    const rect = hero.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    pointer.active = px >= 0 && px <= rect.width && py >= 0 && py <= rect.height && e.pointerType !== "touch";
    if (pointer.active) {
      pointer.x = px;
      pointer.y = py;
    }
    drift.x = (e.clientX / window.innerWidth - 0.5);
    drift.y = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });
  window.addEventListener("pointerleave", () => { pointer.active = false; }, { passive: true });
  window.addEventListener("beforeunload", () => cancelAnimationFrame(raf));
})();

/* ---------------- Signature cursor ---------------- */
(function () {
  if (REDUCED_MOTION) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  const cursor = document.getElementById("cursor");
  if (!cursor) return;
  const label = document.getElementById("cursorLabel");
  document.documentElement.classList.add("has-cursor");

  const ring = cursor.querySelector(".cursor__ring");
  const dot = cursor.querySelector(".cursor__dot");
  let tx = innerWidth / 2, ty = innerHeight / 2, rx = tx, ry = ty, raf = 0;

  function loop() {
    rx += (tx - rx) * 0.16;
    ry += (ty - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    dot.style.transform = `translate(${tx}px, ${ty}px)`;
    raf = requestAnimationFrame(loop);
  }
  loop();

  addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  addEventListener("pointerdown", () => cursor.classList.add("press"), { passive: true });
  addEventListener("pointerup", () => cursor.classList.remove("press"), { passive: true });

  addEventListener("pointerover", (e) => {
    const interactive = e.target.closest("a, button, .project, input, textarea, select, label");
    if (interactive) {
      cursor.classList.add("hover");
      if (label) label.textContent = interactive.closest(".project") ? "Open exhibit" : "";
    } else {
      cursor.classList.remove("hover");
    }
  }, { passive: true });

  addEventListener("beforeunload", () => cancelAnimationFrame(raf));
})();

/* ---------------- Verified-ledger count-up ---------------- */
(function () {
  const stats = document.querySelectorAll(".stat__num[data-count]");
  if (!stats.length) return;
  if (REDUCED_MOTION || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const DURATION = 1200;
      function tick(now) {
        const p = Math.min((now - start) / DURATION, 1);
        el.textContent = `${Math.round((1 - Math.pow(1 - p, 4)) * target)}${suffix}`;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = `${target}${suffix}`;
        entry.target.parentElement?.classList.toggle("in-focus", true);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach((el) => observer.observe(el));
})();

/* ---------------- Typewriter loop ---------------- */
(function () {
  const TYPING_SPEED = 70;   // ms per character
  const HOLD_TIME = 2000;    // ms to hold after typing
  const BLINK_GAP = 400;     // ms cursor hidden before reset
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".typewriter").forEach((el) => {
    const fullText = el.dataset.text || el.textContent;
    if (prefersReduced) {
      el.textContent = fullText;
      return;
    }
    el.textContent = "";
    el.classList.add("typewriter--blink");

    function typeOut(i) {
      if (i <= fullText.length) {
        el.textContent = fullText.slice(0, i);
        setTimeout(() => typeOut(i + 1), TYPING_SPEED);
      } else {
        // Hold, then blink off, reset, restart
        setTimeout(() => {
          el.classList.remove("typewriter--blink");
          setTimeout(() => {
            el.textContent = "";
            el.classList.add("typewriter--blink");
            setTimeout(() => typeOut(0), 200);
          }, BLINK_GAP);
        }, HOLD_TIME);
      }
    }

    typeOut(0);
  });
})();

/* ---------------- Project data (single configurable source) ---------------- */
const PROJECTS = [
  {
    id: "tilik-agent",
    title: "Tilik",
    description: "BPS statistics answered from published observations and SP2020 evidence",
    sub: "Source-grounded statistical agent with auditable provenance",
    tech: ["Python", "LangGraph", "FastAPI", "PostgreSQL", "pgvector", "React"],
    image: "assets/project/tilik-agent.png",
    categories: ["ai agents"],
    featured: true,
    metric: "Source-linked BPS answers",
    year: "2026",
    methods: "LangGraph planning, read-only SQL tools, pgvector retrieval, and verified calculations",
    longDescription: "Tilik answers questions about statistics published by Badan Pusat Statistik (BPS). It plans each request across read-only observation lookup, SP2020 publication retrieval, and verified calculations, then writes a sourced answer with the observation and document identifiers it used. Comparison questions can also return a chart specification for the frontend.",
    feats: ["Plans SQL, retrieval, and calculation steps", "Uses read-only BPS observation tools and SP2020 retrieval", "Returns cited answers and chart specifications"],
    outcomes: ["Answers carry observation and document IDs", "Arithmetic is checked against stored observations", "Pipeline status and bounded retrieval failures remain explicit"],
    results: ["Task completion: 0.8800", "Argument correctness: 0.8655"],
    links: [{ type: "case-study", url: "projects/tilik-agent/" }, { type: "github", url: "https://github.com/aprirachmadi/tilik-agent" }, { type: "demo", url: "https://tilikagent.frhvn.my.id/" }],
  },
  {
    id: "rulebook",
    title: "Rulebook",
    description: "Agentic labeling that drafts, tests, and versions its own guideline rules",
    sub: "Offline multi-agent loop with a human-approved guideline",
    tech: ["Python", "FastAPI", "React", "Ollama", "PaddleOCR", "pytest"],
    image: "assets/project/rulebook.jpg",
    categories: ["ai agents"],
    featured: true,
    metric: "3 local models, human-approved guideline rules",
    year: "2026",
    methods: "Three-model word-level voting, disagreement clustering, agent-drafted rules, gold-set verification, human approval",
    longDescription: "Rulebook is an agentic labeling system that runs fully offline on one consumer GPU. Three small local models label Indonesian shop receipts from CORD v2. When they disagree, an orchestrator agent picks the clusters, a diagnoser works out the cause, and a rule writer drafts one new rule for the labeling guideline. A code verifier measures the rule against a gold set, and a human approves, edits, or rejects it in a web UI. Approved rules create a new guideline version and the batch is relabeled under it. The agent harness is written from scratch, with typed tools, an approval gate, and a JSONL audit trace.",
    feats: ["Three local labelers with word-level votes and confidence", "Orchestrator, diagnoser, and rule-writer agents with a code verifier", "Review queue and trace viewer in a web UI"],
    outcomes: ["Two live loops took the guideline from v1 to v4 with human approvals", "Numbers are parsed in code, not by a model", "Agents never see the evaluation labels"],
    results: ["All-3-agree accuracy on the 10 receipts the rules were written from, v2 to v4: 84.6% to 87.4% (in-sample)"],
    links: [{ type: "github", url: "https://github.com/aprirachmadi/rulebook" }],
  },
  {
    id: "dispatch",
    title: "Dispatch",
    description: "AI-assisted IT triage with a human review workbench",
    sub: "Retrieved context, generated assessments, and revision-aware unsent drafts",
    tech: ["Python", "FastAPI", "MCP", "SQLite", "DeepEval", "Langfuse"],
    image: "public/projects/dispatch/images/console.png",
    categories: ["ai agents"],
    featured: true,
    metric: "33/40 all-field label matches",
    year: "2026",
    methods: "MCP context retrieval, separate classification and drafting, revision-checked review",
    longDescription: "Dispatch gathers ticket and company context through MCP, retrieves historical resolutions, classifies the issue and drafts a response. A technician edits the saved draft and approves the exact reviewed revision. Approval never sends. This is a local demo using synthetic IT scenarios.",
    feats: ["Retrieves context and historical resolutions", "Keeps original issue, assessment and draft together", "Rejects stale edits and approvals"],
    outcomes: ["40-case read-only MCP generation run on synthetic fixtures", "Human-reviewed drafts remain unsent", "Saved evaluations include per-case outputs and judge reasons"],
    results: ["All-field classification match: 82.5% (33/40)", "Urgent-case recall: 8/9", "Draft correctness/safety judge mean: 0.805 (0–1; uncalibrated)"],
    links: [{ type: "case-study", url: "projects/dispatch/" }, { type: "github", url: "https://github.com/aprirachmadi/dispatch" }],
  },
  {
    id: "rottom-chat",
    title: "Rottom-Chat",
    description: "Grounded competitive Pokémon answers and autonomous agent battles",
    sub: "Engine-verified mechanics with structurally isolated AI Seats",
    tech: ["Python", "FastAPI", "TypeScript", "Pokémon Showdown", "Langfuse"],
    image: "assets/project/rottom-chat.png",
    categories: ["ai agents"],
    featured: true,
    metric: "Engine-verified battle mechanics",
    year: "2026",
    methods: "Versioned knowledge snapshots, Pokémon Showdown verification, and Seat-scoped tool calling",
    longDescription: "Rottom-Chat answers competitive Pokémon questions from versioned game data and verifies mechanical claims against the same Pokémon Showdown engine that powers its Arena. The Arena runs a Double Battle between two autonomous AI Seats whose tools expose only legally knowable information, while public justifications, replays, and scoped post-game analysis make each battle traceable.",
    feats: ["Verifies competitive answers against versioned game data", "Runs live Double Battles between structurally isolated AI Seats", "Records public justifications, replays, and post-game analysis"],
    outcomes: ["Chat and Arena share the same mechanics engine", "Seat-scoped tools prevent access to opponent-private state", "A deterministic release gate covers the backend, Showdown engine, and frontend"],
    links: [{ type: "github", url: "https://github.com/aprirachmadi/rottom-chat" }],
  },
  {
    id: "geo-lens",
    title: "Geo-Lens",
    description: "Full-resolution satellite change detection with a Siamese U-Net",
    sub: "Geospatial computer vision and deployable inference",
    tech: ["Python", "PyTorch", "CUDA", "FastAPI", "Next.js"],
    image: "public/projects/geo-lens/images/geo-lens-app.png",
    categories: ["computer vision"],
    featured: true,
    metric: "1024 × 1024 change masks",
    year: "2026",
    methods: "Siamese U-Net, PyTorch, deterministic geographic validation",
    longDescription: "Geo-Lens compares earlier and later satellite observations and produces a pixel-aligned binary mask showing where construction or land-cover change occurred. It operates at the source 1024 × 1024 resolution. The repository includes dataset-contract validation, configurable training, untouched-test evaluation, prediction export, an inference API, a frontend, tests, and deployment documentation.",
    feats: ["Compares paired A/B satellite observations", "Produces full-resolution binary change masks", "Includes reproducible train, evaluate, predict, and serve workflows"],
    outcomes: ["1024 × 1024 output masks", "Public demo and sample prediction gallery", "Tests covering the data contract and pipeline components"],
    results: ["Held-out LEVIR-CD test split: 128 image pairs", "F1 / Dice: 0.8451", "Intersection over Union: 0.7317", "Precision: 0.7811", "Recall: 0.9204", "Pixel accuracy: 0.9828"],
    links: [{ type: "case-study", url: "projects/geo-lens/" }, { type: "github", url: "https://github.com/aprirachmadi/geo-lens" }, { type: "demo", url: "https://geo-lens-urban.rachmadiapri.workers.dev/" }],
  },
  {
    id: "ingfo-loker",
    title: "Ingfo-Loker",
    description: "AI job discovery, ranking, and proposal drafting on autopilot",
    sub: "Verified search agent with human-controlled delivery",
    tech: ["Python", "Pydantic", "FastAPI", "Telegram", "GitHub Actions", "SQLite"],
    image: "assets/project/ingfo-loker.svg",
    categories: ["data science"],
    featured: false,
    metric: "Twice-daily automated digests",
    year: "2026",
    methods: "Search agent, deterministic verification, LLM ranking, evidence-backed proposal drafting",
    longDescription: "Ingfo-Loker searches the open web for relevant AI/ML opportunities based on a configurable brief. It verifies job pages, removes duplicates, filters for remote roles, ranks new opportunities with an LLM, and drafts tailored proposals using matching GitHub repositories as evidence. Telegram delivery and persistent history keep final submission human-controlled.",
    feats: ["Fetch ladder with stale-listing checks", "Deterministic remote filtering and deduplication", "Scheduled automation with graceful degradation"],
    outcomes: ["Complete search-to-digest pipeline with dashboard persistence", "Twice-daily scheduled automation", "Human-in-the-loop proposal workflow"],
    links: [{ type: "github", url: "https://github.com/aprirachmadi/ingfo-loker" }],
  },
  {
    id: "recall-learning",
    title: "Recall",
    description: "Lecture recordings turned into searchable study material",
    sub: "Grounded transcription, notes, concepts, and adaptive quizzes",
    tech: ["TypeScript", "Next.js", "Prisma", "SQLite", "NextAuth", "Vitest"],
    image: "assets/project/recall-learning.svg",
    categories: ["nlp"],
    featured: false,
    metric: "6 swappable STT providers",
    year: "2026",
    methods: "Provider-agnostic speech-to-text plus transcript-grounded LLM analysis",
    longDescription: "Recall turns an uploaded lecture recording into a searchable transcript, summary, structured study notes, key concepts, and a multiple-choice quiz. Private workspaces isolate each user's courses, lectures, quiz results, and processing state. Generated material is derived from the transcript, and quiz difficulty adapts to learner answers.",
    feats: ["Authenticated private workspaces", "Six interchangeable speech-to-text providers", "Transcript-grounded summaries and adaptive quizzes"],
    outcomes: ["Complete v1 upload-to-study workflow", "Study artifacts and results persisted through Prisma", "Tests, linting, type checking, and production build documented"],
    links: [{ type: "github", url: "https://github.com/aprirachmadi/recall-learning" }],
  },
  {
    id: "satellite-precipitation-nowcasting",
    title: "Satellite Imagery Precipitation Nowcasting",
    description: "Precipitation estimates from geostationary satellite imagery",
    sub: "Satellite-only nowcasting with geographic validation",
    tech: ["Python", "PyTorch", "CUDA", "rasterio", "scikit-learn"],
    image: "assets/project/satellite-precipitation-nowcasting.svg",
    categories: ["data science"],
    featured: false,
    metric: "41 × 41 precipitation grid",
    year: "2026",
    methods: "Scratch compact U-Net, log-target modeling, GroupKFold, isotonic calibration",
    longDescription: "This project predicts a 41 × 41 precipitation grid from up to three recent geostationary satellite observations. It uses physically motivated infrared and water-vapor features, a scratch-built compact U-Net, log-target modeling, and competition-aligned RMSE evaluation. Geographic holdout and train-only normalization keep validation leakage-aware.",
    feats: ["Maps three satellite families to shared channels", "Supports geographic holdout and GroupKFold validation", "Produces calibrated GeoTIFF submission archives"],
    outcomes: ["Complete train, evaluate, predict, calibrate, and package workflow", "Competition-shaped 41 × 41 float32 GeoTIFF outputs", "Leakage-aware validation and train-only normalization"],
    links: [{ type: "github", url: "https://github.com/aprirachmadi/satellite-imagery-precipitation-nowcasting" }],
  },
  {
    id: "sirekap-ocr",
    title: "Vote Detection on SIREKAP Forms",
    description: "YOLOv8 + TrOCR pipeline reading 2024 election tally forms",
    sub: "Detection + OCR for election forms",
    tech: ["Python", "YOLOv8", "PyTorch", "TrOCR", "Transformers"],
    image: "assets/project/sirekap.png",
    categories: ["computer vision"],
    featured: false,
    metric: "0.8% CER",
    year: "2024",
    methods: "YOLOv8 detection + TrOCR recognition",
    longDescription:
      "An end-to-end computer-vision pipeline for reading vote tallies straight off Indonesia's 2024 SIREKAP election forms. A YOLOv8 detector first locates each vote bounding box on the scanned form, then a TrOCR transformer transcribes the handwritten digits inside it into machine-readable numbers. The two stages were trained and tuned separately, chained together, and wrapped in an interactive Streamlit demo so anyone can upload a form image and see the detected boxes alongside the recognised counts. The approach took first place at the Gammafest Data Science Competition 2024.",
    feats: [
      "YOLOv8 detects vote regions at 88.7% mAP50-95",
      "TrOCR reads digits at a 0.8% character error rate",
      "Shipped as an interactive Streamlit demo",
    ],
    outcomes: [
      "88.7% mAP50-95 detection accuracy",
      "0.8% character error rate (CER) on transcription",
      "1st place — Gammafest Data Science Competition 2024 (IPB)",
    ],
    links: [
      { type: "github", url: "https://github.com/aprirachmadi/sirekap-ocr" },
      { type: "streamlit", url: "https://sirekap-ocr-pemilu2024.streamlit.app/" },
    ],
  },
  {
    id: "hoax-classification",
    title: "Indonesian Political Hoax Detection",
    description: "IndoBERT NLP model flagging political misinformation",
    sub: "Misinformation detection with IndoBERT",
    tech: ["Python", "PyTorch", "Transformers", "IndoBERT"],
    image: "assets/project/hoax.png",
    categories: ["nlp"],
    featured: false,
    metric: "99% accuracy",
    year: "2023",
    methods: "Fine-tuned IndoBERT (BERT for Indonesian)",
    longDescription:
      "An NLP system for flagging misinformation in Indonesian political news, built with PyTorch and Hugging Face Transformers on top of a pre-trained IndoBERT language model. IndoBERT — a BERT variant pre-trained on large Indonesian corpora — was fine-tuned on a labelled dataset of legitimate and hoax political articles, letting the model pick up the subtle linguistic cues that separate genuine reporting from fabricated stories. The final classifier reached 99% accuracy, showing how transfer learning from a strong, language-specific model makes hoax detection viable even with a modest labelled dataset.",
    feats: [
      "Fine-tuned IndoBERT on real vs. hoax political news",
      "99% accuracy on Indonesian-language articles",
      "Built on a SOTA pre-trained Indonesian language model",
    ],
    outcomes: ["Acquired 99% classification accuracy"],
    links: [
      { type: "github", url: "https://github.com/aprirachmadi/Indonesian-Political-News-Hoax" },
    ],
  },
  {
    id: "fire-smoke",
    title: "Fire & Smoke Classification",
    description: "Vision Transformer classifier robust to noisy imagery",
    sub: "Image classification with Vision Transformers",
    tech: ["Python", "Hugging Face", "PyTorch", "cv2"],
    image: "assets/project/fire-smoke.jpg",
    categories: ["computer vision"],
    featured: false,
    metric: "90% accuracy",
    methods: "Vision Transformer (ViT)",
    longDescription:
      "An image-classification model that sorts visual scenes into four classes — fire, smoke, fire-smoke, and none — using a Vision Transformer (ViT) fine-tuned through Hugging Face. The dataset was deliberately difficult: many images were low-resolution, visually ambiguous, class-imbalanced, or corrupted with white noise, conditions that mirror the real surveillance footage where early fire detection matters most. Careful preprocessing and augmentation kept the ViT robust to that noise, and the final model reached 90% accuracy, making it a credible early-warning component for fire-and-smoke monitoring.",
    feats: [
      "ViT classifying fire / smoke / fire-smoke / none",
      "Handled noisy, low-quality, imbalanced images",
      "Reached 90% accuracy on a hard dataset",
    ],
    challenges: ["Bad image quality", "Imbalanced dataset", "Images corrupted with white noise"],
    outcomes: ["Acquired 90% classification accuracy"],
    links: [{ type: "github", url: "https://github.com/aprirachmadi" }],
  },
  {
    id: "nids",
    title: "Network Intrusion Detection (NIDS)",
    description: "LightGBM classifier on the CIC-IDS 2017 dataset",
    sub: "ML-based cybersecurity threat detection",
    tech: ["Python", "scikit-learn", "LightGBM", "pandas", "Matplotlib"],
    image: "assets/project/nids.png",
    categories: ["data science"],
    featured: false,
    metric: "88.6% F1-macro",
    year: "2023",
    dataset: "CIC-IDS 2017",
    longDescription:
      "A machine-learning network intrusion detection system (NIDS) trained on the CIC-IDS 2017 dataset, which captures realistic benign traffic alongside a broad range of modern cyber-attacks. The workflow covered thorough data preprocessing, exploratory data analysis to understand the traffic features, and handling of severe class imbalance before training a LightGBM gradient-boosting classifier across the many attack categories. The resulting model achieved a macro F1-score of 88.59%, showing it can distinguish multiple intrusion types — not just the most common ones — and flag potential cybersecurity threats reliably.",
    feats: [
      "EDA + preprocessing on CIC-IDS 2017",
      "LightGBM classifier across attack types",
      "88.59% macro F1-score",
    ],
    challenges: ["Highly imbalanced dataset"],
    outcomes: ["Achieved 88.59% macro F1-score"],
    links: [
      { type: "ppt", url: "https://www.canva.com/design/DAFzwdGqk9I/Gm2wSNS3_8p36L63YsCU2Q/edit" },
    ],
  },
  {
    id: "vehicle-counting",
    title: "Vehicle Detection & Counting",
    description: "Multi-gate vehicle tracking & counting with YOLOv8",
    sub: "Real-time multi-gate vehicle analytics",
    tech: ["Python", "YOLOv8", "PyTorch", "Supervision"],
    image: "assets/project/vehicle-counting.png",
    categories: ["computer vision"],
    featured: false,
    methods: "Pretrained YOLOv8 + Supervision tracking",
    longDescription:
      "A multi-gate vehicle detection and counting system built on YOLOv8 and the Supervision library. The pipeline detects and tracks vehicles frame by frame in a video, assigns each one a persistent track ID, and increments a counter whenever a vehicle crosses one of several predefined virtual gate lines — so traffic can be measured per lane or per direction. Built on pretrained YOLOv8 weights, it reliably tracked and counted cars and buses through every gate, the kind of analytics useful for traffic monitoring and road-usage studies.",
    feats: [
      "Tracks cars & buses through predefined gates",
      "Counts vehicles crossing each gate line",
      "Built on pretrained YOLOv8 + Supervision",
    ],
    challenges: ["Inconsistent detection across video frames"],
    outcomes: ["Reliably tracked and counted every car and bus through each gate"],
    links: [{ type: "github", url: "https://github.com/aprirachmadi/VehicleCounting" }],
  },
  {
    id: "carbon-emission",
    title: "Carbon Emission Prediction",
    description: "Random-forest regression on fuel-consumption data",
    sub: "Fuel-consumption regression",
    tech: ["Python", "scikit-learn", "pandas", "Matplotlib"],
    image: "assets/project/carbon.png",
    categories: ["data science"],
    featured: false,
    metric: "R\u00b2 0.99",
    year: "2024",
    dataset: "Canada Fuel Consumption 2024",
    longDescription:
      "A regression project predicting vehicle fuel consumption — and the carbon emissions tied to it — using the Canada Fuel Consumption 2024 dataset. After data cleaning, exploratory data analysis, and feature engineering on attributes such as engine size, cylinder count, and fuel type, a Random Forest Regressor was trained to estimate consumption. The model achieved an R-squared of 0.99, meaning it explains almost all of the variance in fuel use and can serve as a quick proxy for estimating a vehicle's environmental footprint.",
    feats: [
      "Canada Fuel Consumption 2024 dataset",
      "Preprocessing + EDA + feature engineering",
      "Random Forest Regressor, R\u00b2 of 0.99",
    ],
    outcomes: ["Achieved a remarkable R\u00b2 value of 0.99"],
    links: [{ type: "github", url: "https://github.com/aprirachmadi/carbon-emission" }],
  },
  {
    id: "garbage-classification",
    title: "Garbage Classification Web App",
    description: "Streamlit app sorting organic vs. anorganic waste",
    sub: "Image classification deployed on Streamlit",
    tech: ["Python", "TensorFlow", "Streamlit", "cv2"],
    image: "assets/project/garbage.jpg",
    categories: ["computer vision"],
    featured: false,
    year: "2025",
    metric: "88% accuracy",
    longDescription:
      "A computer-vision web app that classifies waste images into organic and anorganic categories to support recycling and waste sorting. A convolutional neural network was trained in TensorFlow on a labelled garbage dataset, then served through an interactive Streamlit interface where a user can upload a photo and instantly receive a prediction — no installation or technical knowledge required. Packaging the model as a lightweight web app turns a research notebook into something an everyday user can actually try, and the classifier reached 88% accuracy.",
    feats: [
      "CNN classifier: organic vs. anorganic waste",
      "Served as an interactive Streamlit web app",
      "88% classification accuracy",
    ],
    challenges: ["Imbalanced dataset"],
    outcomes: ["Acquired 88% accuracy"],
    links: [
      { type: "github", url: "https://github.com/aprirachmadi/klasifikasi-sampah-2" },
      { type: "streamlit", url: "https://klasifikasi-sampah-2.streamlit.app/" },
    ],
  },
  {
    id: "golden-section",
    title: "Golden Section Search Optimization",
    description: "Optimizing Holt's double exponential smoothing",
    sub: "Numerical optimization for time-series smoothing",
    tech: ["Python", "NumPy", "pandas", "Matplotlib"],
    image: "assets/project/golden-section.png",
    categories: ["data science"],
    featured: false,
    year: "2025",
    longDescription:
      "A numerical-optimization study that applies the Golden Section Search method to tune the smoothing parameters of Holt's Double Exponential Smoothing model for time-series forecasting. Rather than relying on a black-box solver, parameter selection is framed as a one-dimensional search that iteratively narrows the interval containing the optimum, minimising forecast error in a transparent, easy-to-follow way. The search-based optimizer reached forecasting accuracy on par with an existing optimization method while staying simple and interpretable — a clean illustration of classical optimization applied to a practical forecasting task.",
    feats: [
      "Golden Section Search for Holt model parameters",
      "Matches existing optimizers' performance",
      "Applied to double exponential smoothing",
    ],
    outcomes: [
      "Built an optimization model for the Double Exponential Smoothing Holt model rivaling an existing optimizer",
    ],
    links: [{ type: "github", url: "https://github.com/aprirachmadi/Optimization-Methods" }],
  },
];

/* ---------------- Category taxonomy ---------------- */
const CATEGORY_LABELS = {
  "ai agents": "AI Agents",
  "computer vision": "Computer Vision",
  nlp: "NLP",
  "data science": "Data Science",
};

const LINK_LABELS = {
  "case-study": "Read case study",
  github: "GitHub Repository",
  ppt: "Presentation",
  streamlit: "Live Demo",
  demo: "Live Demo",
};

/* ---------------- Scroll reveal (hero is choreographed by the intro instead) ---------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
function observeReveals(els) {
  els.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
    revealObserver.observe(el);
  });
}
observeReveals(
  Array.from(document.querySelectorAll(".reveal")).filter(
    (el) => !el.closest(".hero")
  )
);

/* ---------------- Scroll-spy (active nav tracking) ---------------- */
(function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__links a");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
})();

/* ---------------- Image fallback ---------------- */
function attachFallback(img, title, phClass) {
  img.addEventListener("error", () => {
    const ph = document.createElement("div");
    ph.className = phClass;
    ph.textContent = title;
    if (img.parentNode) img.parentNode.replaceChild(ph, img);
  });
}

/* ---------------- Project rendering ---------------- */
const grid = document.getElementById("projectGrid");
const filtersEl = document.getElementById("projectFilters");
const viewAllBtn = document.getElementById("viewAllBtn");

let activeFilter = "featured";

function buildFilters() {
  const cats = [...new Set(PROJECTS.flatMap((p) => p.categories))];
  const pills = [
    { key: "featured", label: "Featured" },
    { key: "all", label: "All" },
    ...cats.map((c) => ({ key: c, label: CATEGORY_LABELS[c] || c })),
  ];
  filtersEl.innerHTML = "";
  pills.forEach((pill) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-pill" + (pill.key === activeFilter ? " active" : "");
    btn.textContent = pill.label;
    btn.dataset.filter = pill.key;
    btn.addEventListener("click", () => setFilter(pill.key));
    filtersEl.appendChild(btn);
  });
}

function setFilter(key) {
  activeFilter = key;
  filtersEl.querySelectorAll(".filter-pill").forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === key);
  });
  viewAllBtn.textContent = key === "featured" ? "View all projects" : "Show featured only";
  renderProjects();
}

function getFilteredProjects() {
  if (activeFilter === "featured") return PROJECTS.filter((p) => p.featured);
  if (activeFilter === "all") return PROJECTS;
  return PROJECTS.filter((p) => p.categories.includes(activeFilter));
}

function renderProjects() {
  const list = getFilteredProjects();
  grid.innerHTML = "";
  if (!list.length) {
    const empty = document.createElement("p");
    empty.className = "projects-empty";
    empty.textContent = "No projects in this category yet.";
    grid.appendChild(empty);
    return;
  }
  list.forEach((p) => grid.appendChild(buildCard(p)));
  observeReveals(Array.from(grid.querySelectorAll(".reveal")));
}

function buildCard(p) {
  const card = document.createElement("article");
  card.className = "project reveal";

  const top = document.createElement("div");
  top.className = "project__top";
  const tag = document.createElement("span");
  tag.className = "project__tag";
  tag.textContent = CATEGORY_LABELS[p.categories[0]] || p.categories[0];
  top.appendChild(tag);
  if (p.year) {
    const year = document.createElement("span");
    year.className = "project__year";
    year.textContent = p.year;
    top.appendChild(year);
  }
  if (p.metric) {
    const metric = document.createElement("span");
    metric.className = "project__metric";
    metric.textContent = p.metric;
    top.appendChild(metric);
  }
  card.appendChild(top);

  const h3 = document.createElement("h3");
  h3.className = "project__title";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "project__toggle";
  toggle.id = "pt-" + p.id;
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "pd-" + p.id);
  const titleText = document.createElement("span");
  titleText.className = "project__title-text";
  titleText.textContent = p.title;
  toggle.appendChild(titleText);
  toggle.insertAdjacentHTML(
    "beforeend",
    '<svg class="project__chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 5.5 8 10.5 13 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  );
  h3.appendChild(toggle);
  card.appendChild(h3);

  if (p.sub) {
    const sub = document.createElement("p");
    sub.className = "project__sub";
    sub.textContent = p.sub;
    card.appendChild(sub);
  }

  const desc = document.createElement("p");
  desc.className = "project__desc";
  desc.textContent = p.description;
  card.appendChild(desc);

  if (p.feats && p.feats.length) {
    const ul = document.createElement("ul");
    ul.className = "project__feats";
    p.feats.slice(0, 3).forEach((f) => {
      const li = document.createElement("li");
      li.textContent = f;
      ul.appendChild(li);
    });
    card.appendChild(ul);
  }

  const techWrap = document.createElement("div");
  techWrap.className = "project__tech";
  p.tech.forEach((t) => {
    const span = document.createElement("span");
    span.textContent = t;
    techWrap.appendChild(span);
  });
  card.appendChild(techWrap);

  card.appendChild(buildDetail(p, toggle.id));

  toggle.addEventListener("click", () => {
    const opening = !card.classList.contains("open");
    if (opening) {
      document.querySelectorAll(".project.open").forEach((c) => {
        if (c !== card) setOpen(c, false);
      });
    }
    setOpen(card, opening);
  });
  card.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
    if (window.getSelection().toString()) return;
    toggle.click();
  });
  return card;
}

function setOpen(card, open) {
  card.classList.toggle("open", open);
  card.querySelector(".project__toggle").setAttribute("aria-expanded", String(open));
  card.querySelector(".project__detail").inert = !open;
}

function buildDetail(p, labelledBy) {
  const detail = document.createElement("div");
  detail.className = "project__detail";
  detail.id = "pd-" + p.id;
  detail.setAttribute("role", "region");
  detail.setAttribute("aria-labelledby", labelledBy);
  detail.inert = true;

  const clip = document.createElement("div");
  clip.className = "project__detail-clip";
  const grid = document.createElement("div");
  grid.className = "project__detail-grid";

  const main = document.createElement("div");
  if (p.image) {
    const img = document.createElement("img");
    img.className = "project__img";
    img.src = p.image;
    img.alt = p.title;
    img.loading = "lazy";
    attachFallback(img, p.title, "project__img project__img--ph");
    main.appendChild(img);
  }
  const ovH = document.createElement("h4");
  ovH.textContent = "Project Overview";
  main.appendChild(ovH);
  const ovP = document.createElement("p");
  ovP.className = "project__detail-desc";
  ovP.textContent = p.longDescription || p.description;
  main.appendChild(ovP);

  const metaPairs = [
    ["Role", p.role],
    ["Team", p.team],
    ["Dataset", p.dataset],
    ["Methods", p.methods],
  ].filter(([, v]) => v);
  if (metaPairs.length) {
    const meta = document.createElement("dl");
    meta.className = "project__meta";
    metaPairs.forEach(([k, v]) => {
      const div = document.createElement("div");
      const dt = document.createElement("dt");
      dt.textContent = k;
      const dd = document.createElement("dd");
      dd.textContent = v;
      div.appendChild(dt);
      div.appendChild(dd);
      meta.appendChild(div);
    });
    main.appendChild(meta);
  }
  grid.appendChild(main);

  const side = document.createElement("div");
  if (p.links && p.links.length) {
    const actions = document.createElement("div");
    actions.className = "project__actions";
    p.links.forEach((link) => {
      const a = document.createElement("a");
      a.className = "btn";
      a.href = link.url;
      if (!link.url.startsWith("projects/")) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      a.textContent = LINK_LABELS[link.type] || link.type;
      actions.appendChild(a);
    });
    side.appendChild(actions);
  }
  [
    listBlock("Outcomes & Impact", p.outcomes),
    listBlock("Challenges", p.challenges),
    listBlock("Results", p.results),
  ].forEach((b) => b && side.appendChild(b));
  grid.appendChild(side);

  clip.appendChild(grid);
  detail.appendChild(clip);
  return detail;
}

/* ---------------- Detail content helpers ---------------- */
function clean(arr) {
  return (arr || []).map((s) => (s || "").trim()).filter(Boolean);
}

function listBlock(heading, items) {
  const cleaned = clean(items);
  if (!cleaned.length) return null;
  const block = document.createElement("div");
  block.className = "project__block";
  const h4 = document.createElement("h4");
  h4.textContent = heading;
  block.appendChild(h4);
  const ul = document.createElement("ul");
  cleaned.forEach((it) => {
    const li = document.createElement("li");
    li.textContent = it;
    ul.appendChild(li);
  });
  block.appendChild(ul);
  return block;
}

viewAllBtn.addEventListener("click", () => {
  setFilter(activeFilter === "featured" ? "all" : "featured");
});

buildFilters();
renderProjects();

/* ---------------- Contact form (Formspree) ---------------- */
const form = document.getElementById("contactForm");
const ok = document.getElementById("formOk");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const btn = form.querySelector("button[type='submit']");
    const original = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
    ok.classList.remove("show", "error");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        ok.textContent = "Thanks — your message is on its way. I'll get back to you shortly.";
        ok.classList.add("show");
        form.reset();
      } else {
        ok.textContent = "That didn't go through. Please email me directly at rachmadiapri@gmail.com.";
        ok.classList.add("show", "error");
      }
    } catch (err) {
      ok.textContent = "Network problem — please email me directly at rachmadiapri@gmail.com.";
      ok.classList.add("show", "error");
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = original; }
      setTimeout(() => ok.classList.remove("show"), 8000);
    }
  });
}
