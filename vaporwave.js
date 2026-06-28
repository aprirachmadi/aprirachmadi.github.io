/* ============================================================
   Refined Vaporwave Portfolio — interactions
   - Scroll reveal (IntersectionObserver)
   - Project data array + category filtering + featured default
   - Scrollable detail modal with image fallbacks
   - Front-end-only contact form
   ============================================================ */

/* ---------------- Project data (single configurable source) ---------------- */
const PROJECTS = [
  {
    id: "sirekap-ocr",
    title: "Vote Detection on SIREKAP Forms",
    description: "YOLOv8 + TrOCR pipeline reading 2024 election tally forms",
    sub: "Detection + OCR for election forms",
    tech: ["Python", "YOLOv8", "PyTorch", "TrOCR", "Transformers"],
    image: "assets/project/sirekap.png",
    categories: ["computer vision"],
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
  card.tabIndex = 0;
  card.setAttribute("role", "button");

  const top = document.createElement("div");
  top.className = "project__top";
  const tag = document.createElement("span");
  tag.className = "project__tag";
  tag.textContent = CATEGORY_LABELS[p.categories[0]] || p.categories[0];
  top.appendChild(tag);
  if (p.metric) {
    const metric = document.createElement("span");
    metric.className = "project__metric";
    metric.textContent = p.metric;
    top.appendChild(metric);
  }
  card.appendChild(top);

  const h3 = document.createElement("h3");
  h3.textContent = p.title;
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

  card.addEventListener("click", () => openModal(p));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(p);
    }
  });
  return card;
}

/* ---------------- Detail modal ---------------- */
const modal = document.getElementById("projectModal");
const modalTag = document.getElementById("modalTag");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

function clean(arr) {
  return (arr || []).map((s) => (s || "").trim()).filter(Boolean);
}

function listBlock(heading, items) {
  const cleaned = clean(items);
  if (!cleaned.length) return null;
  const block = document.createElement("div");
  block.className = "modal__block";
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

function openModal(p) {
  modalTag.textContent = p.categories.map((c) => CATEGORY_LABELS[c] || c).join(" · ");
  modalTitle.textContent = p.title;
  modalBody.innerHTML = "";

  // 1) Hero image first
  const hero = document.createElement("img");
  hero.className = "modal__hero";
  hero.src = p.image;
  hero.alt = p.title;
  attachFallback(hero, p.title, "modal__hero modal__hero--ph");
  modalBody.appendChild(hero);

  // 2) Project Overview
  const overview = document.createElement("div");
  overview.className = "modal__block";
  const ovH = document.createElement("h4");
  ovH.textContent = "Project Overview";
  const ovP = document.createElement("p");
  ovP.className = "modal__desc";
  ovP.textContent = p.longDescription || p.description;
  overview.appendChild(ovH);
  overview.appendChild(ovP);
  modalBody.appendChild(overview);

  // 3) Meta facts (render only what's present)
  const metaPairs = [
    ["Role", p.role],
    ["Year", p.year || p.timeline],
    ["Team", p.team],
    ["Dataset", p.dataset],
    ["Methods", p.methods],
  ].filter(([, v]) => v);
  if (metaPairs.length) {
    const meta = document.createElement("dl");
    meta.className = "modal__meta";
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
    modalBody.appendChild(meta);
  }

  // 4) Action buttons
  if (p.links && p.links.length) {
    const actions = document.createElement("div");
    actions.className = "modal__actions";
    p.links.forEach((link) => {
      const a = document.createElement("a");
      a.className = "btn";
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = LINK_LABELS[link.type] || link.type;
      actions.appendChild(a);
    });
    modalBody.appendChild(actions);
  }

  // 5) Detail blocks (omit empty sections)
  [
    listBlock("Core Features", p.feats),
    listBlock("Challenges", p.challenges),
    listBlock("Outcomes & Impact", p.outcomes),
    listBlock("Results", p.results),
  ].forEach((b) => b && modalBody.appendChild(b));

  if (p.tech && p.tech.length) {
    const block = document.createElement("div");
    block.className = "modal__block";
    const h4 = document.createElement("h4");
    h4.textContent = "Tech Stack";
    block.appendChild(h4);
    const wrap = document.createElement("div");
    wrap.className = "modal__tech";
    p.tech.forEach((t) => {
      const span = document.createElement("span");
      span.textContent = t;
      wrap.appendChild(span);
    });
    block.appendChild(wrap);
    modalBody.appendChild(block);
  }

  modalBody.scrollTop = 0;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

viewAllBtn.addEventListener("click", () => {
  setFilter(activeFilter === "featured" ? "all" : "featured");
});

buildFilters();
renderProjects();

/* ---------------- Contact form (front-end only) ---------------- */
const form = document.getElementById("contactForm");
const ok = document.getElementById("formOk");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    ok.classList.add("show");
    form.reset();
    setTimeout(() => ok.classList.remove("show"), 5000);
  });
}
