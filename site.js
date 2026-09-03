/* ============================================================
   Refined Vaporwave Portfolio — interactions
   - Particle network background (canvas)
   - Scroll reveal (IntersectionObserver)
   - Project data array + category filtering + featured default
   - Expandable project detail cards with image fallbacks
   - Formspree contact form
   ============================================================ */

/* ---------------- Particle network background ---------------- */
(function () {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const COLORS = [
    "rgba(26, 82, 118, OPACITY)",   // cyan
    "rgba(192, 57, 43, OPACITY)",   // magenta
    "rgba(212, 172, 13, OPACITY)",   // pink
  ];

  const CONNECT_DIST = 150;
  const MAX_LINE_OPACITY = 0.18;
  const PARTICLE_COUNT = 300;

  let particles = [];
  let w, h;
  let animId;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw connections first (behind particles)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const opacity = (1 - dist / CONNECT_DIST) * MAX_LINE_OPACITY;
          ctx.strokeStyle = `rgba(44, 62, 80, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      ctx.fillStyle = p.color.replace("OPACITY", "0.55");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
    }
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  function handleResize() {
    resize();
    createParticles();
  }

  function handleScroll() {
    const docH = document.documentElement.scrollHeight;
    if (docH !== h) {
      h = canvas.height = docH;
    }
  }

  resize();
  createParticles();
  loop();

  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animId);
  });
})();

/* ---------------- Typewriter loop ---------------- */
(function () {
  const TYPING_SPEED = 70;   // ms per character
  const HOLD_TIME = 2000;    // ms to hold after typing
  const BLINK_GAP = 400;     // ms cursor hidden before reset

  document.querySelectorAll(".typewriter").forEach((el) => {
    const fullText = el.dataset.text || el.textContent;
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
    id: "geo-lens",
    title: "Geo-Lens",
    description: "Full-resolution satellite change detection with a Siamese U-Net",
    sub: "Geospatial computer vision and deployable inference",
    tech: ["Python", "PyTorch", "CUDA", "FastAPI", "Next.js"],
    image: "assets/project/geo-lens.svg",
    categories: ["computer vision"],
    featured: true,
    metric: "1024 × 1024 change masks",
    year: "2026",
    methods: "Siamese U-Net, PyTorch, deterministic geographic validation",
    longDescription: "Geo-Lens compares earlier and later satellite observations and produces a pixel-aligned binary mask showing where construction or land-cover change occurred. It operates at the source 1024 × 1024 resolution. The repository includes dataset-contract validation, configurable training, untouched-test evaluation, prediction export, an inference API, a frontend, tests, and deployment documentation.",
    feats: ["Compares paired A/B satellite observations", "Produces full-resolution binary change masks", "Includes reproducible train, evaluate, predict, and serve workflows"],
    outcomes: ["1024 × 1024 output masks", "Public demo and sample prediction gallery", "Tests covering the data contract and pipeline components"],
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
    featured: true,
    metric: "Twice-daily automated digests",
    year: "2026",
    methods: "Search agent, deterministic verification, LLM ranking, evidence-backed proposal drafting",
    longDescription: "Ingfo-Loker searches the open web for relevant AI/ML opportunities based on a configurable brief. It verifies job pages, removes duplicates, filters for remote roles, ranks new opportunities with an LLM, and drafts tailored proposals using matching GitHub repositories as evidence. Telegram delivery and persistent history keep final submission human-controlled.",
    feats: ["Fetch ladder with stale-listing checks", "Deterministic remote filtering and deduplication", "Scheduled automation with graceful degradation"],
    outcomes: ["Complete search-to-digest pipeline with dashboard persistence", "Twice-daily scheduled automation", "Human-in-the-loop proposal workflow"],
    links: [{ type: "github", url: "https://github.com/aprirachmadi/ingfo-loker" }],
  },
  {
    id: "ai-finance-document-reviewer",
    title: "AI Finance Document Reviewer",
    description: "Evidence-first review recommendations for finance documents",
    sub: "OCR, deterministic rules, and guarded LLM review",
    tech: ["Python", "RapidOCR", "Pydantic", "pytest", "mypy"],
    image: "assets/project/ai-finance-document-reviewer.svg",
    categories: ["data science"],
    featured: true,
    metric: "13 deterministic validation rules",
    year: "2026",
    methods: "PDF/OCR extraction, structured parsing, rule validation, optional guarded LLM review",
    longDescription: "AI Finance Document Reviewer processes invoices, receipts, purchase orders, and contracts from PDFs. It chooses native extraction or OCR, parses fields into structured Pydantic models, and runs configurable checks against reference data. Findings include severity, confidence, a human-readable reason, and source evidence; final approval remains with a human reviewer.",
    feats: ["Processes nested digital and scanned PDFs", "Runs 13 arithmetic, identity, currency, PO, and contract rules", "Writes JSON review artifacts and audit logs"],
    outcomes: ["Complete local CLI workflow from PDF directory to review artifacts", "Explainable findings with evidence, severity, and confidence", "Unit and integration tests included"],
    links: [{ type: "github", url: "https://github.com/aprirachmadi/ai-finance-document-reviewer" }],
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

/* ---------------- Scroll reveal ---------------- */
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
observeReveals(Array.from(document.querySelectorAll(".reveal")));

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
