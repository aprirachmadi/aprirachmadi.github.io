/* Project data copied from site.js (paths made relative to /lab/) */
window.ANGKOT_PROJECTS = [
 {
  "id": "tilik-agent",
  "title": "Tilik",
  "description": "Indonesian public-data questions answered from BPS, BNPB, BMKG, Bapanas, and SiPongi sources",
  "sub": "Multi-source agent with MCP connectors and auditable provenance",
  "tech": [
   "Python",
   "LangGraph",
   "FastAPI",
   "MCP",
   "PostgreSQL",
   "pgvector",
   "React"
  ],
  "image": "../assets/project/tilik-agent.jpg",
  "categories": [
   "ai agents"
  ],
  "featured": true,
  "metric": "5 official source connectors",
  "year": "2026",
  "methods": "LangGraph routing to per-source MCP servers, read-only SQL tools, pgvector retrieval, and cited evidence checks",
  "longDescription": "Tilik answers questions about Indonesian public data. It routes each question to its own BPS, BNPB, BMKG, Bapanas, or SiPongi MCP server. BPS reads published observations and SP2020 passages, BNPB reads synchronized disaster aggregates, and BMKG reads official live feeds. Bapanas reads consumer food prices and SiPongi reads satellite hotspot counts, each live and from a daily monthly sync. Every answer includes cited source links and retrieval times, and comparison questions can also return a chart.",
  "feats": [
   "Routes each question to the right source MCP server",
   "Reads BPS observations and SP2020 passages with read-only SQL and pgvector retrieval",
   "Returns cited answers with retrieval times and charts"
  ],
  "outcomes": [
   "Answers carry source links, freshness details, and evidence IDs",
   "Cited evidence IDs are checked against what was retrieved",
   "Pipeline status and bounded retrieval failures remain explicit"
  ],
  "results": [
   "Task completion: 73%",
   "Argument correctness: 81%"
  ],
  "links": [
   {
    "type": "case-study",
    "url": "../projects/tilik-agent/"
   },
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/tilik-agent"
   },
   {
    "type": "demo",
    "url": "https://tilikagent.frhvn.my.id/"
   }
  ]
 },
 {
   "id": "rulebook",
   "title": "Rulebook",
   "description": "Agentic labeling that drafts, tests, and versions its own guideline rules",
   "sub": "Offline multi-agent loop with a human-approved guideline",
   "tech": [
    "Python",
    "FastAPI",
    "React",
    "Ollama",
    "PaddleOCR",
    "pytest"
   ],
   "image": "../assets/project/rulebook.jpg",
  "categories": [
    "ai agents"
   ],
   "featured": true,
   "metric": "3 local models, human-approved guideline rules",
   "year": "2026",
   "methods": "Three-model word-level voting, disagreement clustering, agent-drafted rules, gold-set verification, human approval",
   "longDescription": "Rulebook is an agentic labeling system that runs fully offline on one consumer GPU. Three small local models label Indonesian shop receipts from CORD v2. When they disagree, an orchestrator agent picks the clusters, a diagnoser works out the cause, and a rule writer drafts one new rule for the labeling guideline. A code verifier measures the rule against a gold set, and a human approves, edits, or rejects it in a web UI. Approved rules create a new guideline version and the batch is relabeled under it. The agent harness is written from scratch, with typed tools, an approval gate, and a JSONL audit trace.",
   "feats": [
    "Three local labelers with word-level votes and confidence",
    "Orchestrator, diagnoser, and rule-writer agents with a code verifier",
    "Review queue and trace viewer in a web UI"
   ],
   "outcomes": [
    "Two live loops took the guideline from v1 to v4 with human approvals",
    "Numbers are parsed in code, not by a model",
    "Agents never see the evaluation labels"
   ],
   "results": [
    "All-3-agree accuracy on the 10 receipts the rules were written from, v2 to v4: 84.6% to 87.4% (in-sample)"
   ],
   "links": [
    {
     "type": "github",
     "url": "https://github.com/aprirachmadi/rulebook"
    }
   ]
 },
 {
  "id": "dispatch",
  "title": "Dispatch",
  "description": "AI-assisted IT triage with a human review workbench",
  "sub": "Retrieved context, generated assessments, and revision-aware unsent drafts",
  "tech": [
   "Python",
   "FastAPI",
   "MCP",
   "SQLite",
   "DeepEval",
   "Langfuse"
  ],
  "image": "../public/projects/dispatch/images/console.png",
  "categories": [
   "ai agents"
  ],
  "featured": true,
  "metric": "33/40 all-field label matches",
  "year": "2026",
  "methods": "MCP context retrieval, separate classification and drafting, revision-checked review",
  "longDescription": "Dispatch gathers ticket and company context through MCP, retrieves historical resolutions, classifies the issue and drafts a response. A technician edits the saved draft and approves the exact reviewed revision. Approval never sends. This is a local demo using synthetic IT scenarios.",
  "feats": [
   "Retrieves context and historical resolutions",
   "Keeps original issue, assessment and draft together",
   "Rejects stale edits and approvals"
  ],
  "outcomes": [
   "40-case read-only MCP generation run on synthetic fixtures",
   "Human-reviewed drafts remain unsent",
   "Saved evaluations include per-case outputs and judge reasons"
  ],
  "results": [
   "All-field classification match: 82.5% (33/40)",
   "Urgent-case recall: 8/9",
   "Draft correctness/safety judge mean: 0.805 (0–1; uncalibrated)"
  ],
  "links": [
   {
    "type": "case-study",
    "url": "../projects/dispatch/"
   },
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/dispatch"
   }
  ]
 },
 {
  "id": "rottom-chat",
  "title": "Rottom-Chat",
  "description": "Grounded competitive Pokémon answers and autonomous agent battles",
  "sub": "Engine-verified mechanics with structurally isolated AI Seats",
  "tech": [
   "Python",
   "FastAPI",
   "TypeScript",
   "Pokémon Showdown",
   "Langfuse"
  ],
  "image": "../assets/project/rottom-chat.png",
  "categories": [
   "ai agents"
  ],
  "featured": true,
  "metric": "Engine-verified battle mechanics",
  "year": "2026",
  "methods": "Versioned knowledge snapshots, Pokémon Showdown verification, and Seat-scoped tool calling",
  "longDescription": "Rottom-Chat answers competitive Pokémon questions from versioned game data and verifies mechanical claims against the same Pokémon Showdown engine that powers its Arena. The Arena runs a Double Battle between two autonomous AI Seats whose tools expose only legally knowable information, while public justifications, replays, and scoped post-game analysis make each battle traceable.",
  "feats": [
   "Verifies competitive answers against versioned game data",
   "Runs live Double Battles between structurally isolated AI Seats",
   "Records public justifications, replays, and post-game analysis"
  ],
  "outcomes": [
   "Chat and Arena share the same mechanics engine",
   "Seat-scoped tools prevent access to opponent-private state",
   "A deterministic release gate covers the backend, Showdown engine, and frontend"
  ],
  "links": [
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/rottom-chat"
   }
  ]
 },
 {
  "id": "geo-lens",
  "title": "Geo-Lens",
  "description": "Full-resolution satellite change detection with a Siamese U-Net",
  "sub": "Geospatial computer vision and deployable inference",
  "tech": [
   "Python",
   "PyTorch",
   "CUDA",
   "FastAPI",
   "Next.js"
  ],
  "image": "../public/projects/geo-lens/images/geo-lens-app.png",
  "categories": [
   "computer vision"
  ],
  "featured": true,
  "metric": "1024 × 1024 change masks",
  "year": "2026",
  "methods": "Siamese U-Net, PyTorch, deterministic geographic validation",
  "longDescription": "Geo-Lens compares earlier and later satellite observations and produces a pixel-aligned binary mask showing where construction or land-cover change occurred. It operates at the source 1024 × 1024 resolution. The repository includes dataset-contract validation, configurable training, untouched-test evaluation, prediction export, an inference API, a frontend, tests, and deployment documentation.",
  "feats": [
   "Compares paired A/B satellite observations",
   "Produces full-resolution binary change masks",
   "Includes reproducible train, evaluate, predict, and serve workflows"
  ],
  "outcomes": [
   "1024 × 1024 output masks",
   "Public demo and sample prediction gallery",
   "Tests covering the data contract and pipeline components"
  ],
  "results": [
   "Held-out LEVIR-CD test split: 128 image pairs",
   "F1 / Dice: 0.8451",
   "Intersection over Union: 0.7317",
   "Precision: 0.7811",
   "Recall: 0.9204",
   "Pixel accuracy: 0.9828"
  ],
  "links": [
   {
    "type": "case-study",
    "url": "../projects/geo-lens/"
   },
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/geo-lens"
   },
   {
    "type": "demo",
    "url": "https://geo-lens-urban.rachmadiapri.workers.dev/"
   }
  ]
 },
 {
  "id": "ingfo-loker",
  "title": "Ingfo-Loker",
  "description": "AI job discovery, ranking, and proposal drafting on autopilot",
  "sub": "Verified search agent with human-controlled delivery",
  "tech": [
   "Python",
   "Pydantic",
   "FastAPI",
   "Telegram",
   "GitHub Actions",
   "SQLite"
  ],
  "image": "../assets/project/ingfo-loker.svg",
  "categories": [
   "data science"
  ],
  "featured": false,
  "metric": "Twice-daily automated digests",
  "year": "2026",
  "methods": "Search agent, deterministic verification, LLM ranking, evidence-backed proposal drafting",
  "longDescription": "Ingfo-Loker searches the open web for relevant AI/ML opportunities based on a configurable brief. It verifies job pages, removes duplicates, filters for remote roles, ranks new opportunities with an LLM, and drafts tailored proposals using matching GitHub repositories as evidence. Telegram delivery and persistent history keep final submission human-controlled.",
  "feats": [
   "Fetch ladder with stale-listing checks",
   "Deterministic remote filtering and deduplication",
   "Scheduled automation with graceful degradation"
  ],
  "outcomes": [
   "Complete search-to-digest pipeline with dashboard persistence",
   "Twice-daily scheduled automation",
   "Human-in-the-loop proposal workflow"
  ],
  "links": [
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/ingfo-loker"
   }
  ]
 },
 {
  "id": "recall-learning",
  "title": "Recall",
  "description": "Lecture recordings turned into searchable study material",
  "sub": "Grounded transcription, notes, concepts, and adaptive quizzes",
  "tech": [
   "TypeScript",
   "Next.js",
   "Prisma",
   "SQLite",
   "NextAuth",
   "Vitest"
  ],
  "image": "../assets/project/recall-learning.svg",
  "categories": [
   "nlp"
  ],
  "featured": false,
  "metric": "6 swappable STT providers",
  "year": "2026",
  "methods": "Provider-agnostic speech-to-text plus transcript-grounded LLM analysis",
  "longDescription": "Recall turns an uploaded lecture recording into a searchable transcript, summary, structured study notes, key concepts, and a multiple-choice quiz. Private workspaces isolate each user's courses, lectures, quiz results, and processing state. Generated material is derived from the transcript, and quiz difficulty adapts to learner answers.",
  "feats": [
   "Authenticated private workspaces",
   "Six interchangeable speech-to-text providers",
   "Transcript-grounded summaries and adaptive quizzes"
  ],
  "outcomes": [
   "Complete v1 upload-to-study workflow",
   "Study artifacts and results persisted through Prisma",
   "Tests, linting, type checking, and production build documented"
  ],
  "links": [
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/recall-learning"
   }
  ]
 },
 {
  "id": "satellite-precipitation-nowcasting",
  "title": "Satellite Imagery Precipitation Nowcasting",
  "description": "Precipitation estimates from geostationary satellite imagery",
  "sub": "Satellite-only nowcasting with geographic validation",
  "tech": [
   "Python",
   "PyTorch",
   "CUDA",
   "rasterio",
   "scikit-learn"
  ],
  "image": "../assets/project/satellite-precipitation-nowcasting.svg",
  "categories": [
   "data science"
  ],
  "featured": false,
  "metric": "41 × 41 precipitation grid",
  "year": "2026",
  "methods": "Scratch compact U-Net, log-target modeling, GroupKFold, isotonic calibration",
  "longDescription": "This project predicts a 41 × 41 precipitation grid from up to three recent geostationary satellite observations. It uses physically motivated infrared and water-vapor features, a scratch-built compact U-Net, log-target modeling, and competition-aligned RMSE evaluation. Geographic holdout and train-only normalization keep validation leakage-aware.",
  "feats": [
   "Maps three satellite families to shared channels",
   "Supports geographic holdout and GroupKFold validation",
   "Produces calibrated GeoTIFF submission archives"
  ],
  "outcomes": [
   "Complete train, evaluate, predict, calibrate, and package workflow",
   "Competition-shaped 41 × 41 float32 GeoTIFF outputs",
   "Leakage-aware validation and train-only normalization"
  ],
  "links": [
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/satellite-imagery-precipitation-nowcasting"
   }
  ]
 },
 {
  "id": "sirekap-ocr",
  "title": "Vote Detection on SIREKAP Forms",
  "description": "YOLOv8 + TrOCR pipeline reading 2024 election tally forms",
  "sub": "Detection + OCR for election forms",
  "tech": [
   "Python",
   "YOLOv8",
   "PyTorch",
   "TrOCR",
   "Transformers"
  ],
  "image": "../assets/project/sirekap.png",
  "categories": [
   "computer vision"
  ],
  "featured": false,
  "metric": "0.8% CER",
  "year": "2024",
  "methods": "YOLOv8 detection + TrOCR recognition",
  "longDescription": "An end-to-end computer-vision pipeline for reading vote tallies straight off Indonesia's 2024 SIREKAP election forms. A YOLOv8 detector first locates each vote bounding box on the scanned form, then a TrOCR transformer transcribes the handwritten digits inside it into machine-readable numbers. The two stages were trained and tuned separately, chained together, and wrapped in an interactive Streamlit demo so anyone can upload a form image and see the detected boxes alongside the recognised counts. The approach took first place at the Gammafest Data Science Competition 2024.",
  "feats": [
   "YOLOv8 detects vote regions at 88.7% mAP50-95",
   "TrOCR reads digits at a 0.8% character error rate",
   "Shipped as an interactive Streamlit demo"
  ],
  "outcomes": [
   "88.7% mAP50-95 detection accuracy",
   "0.8% character error rate (CER) on transcription",
   "1st place — Gammafest Data Science Competition 2024 (IPB)"
  ],
  "links": [
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/sirekap-ocr"
   },
   {
    "type": "streamlit",
    "url": "https://sirekap-ocr-pemilu2024.streamlit.app/"
   }
  ]
 },
 {
  "id": "hoax-classification",
  "title": "Indonesian Political Hoax Detection",
  "description": "IndoBERT NLP model flagging political misinformation",
  "sub": "Misinformation detection with IndoBERT",
  "tech": [
   "Python",
   "PyTorch",
   "Transformers",
   "IndoBERT"
  ],
  "image": "../assets/project/hoax.png",
  "categories": [
   "nlp"
  ],
  "featured": false,
  "metric": "99% accuracy",
  "year": "2023",
  "methods": "Fine-tuned IndoBERT (BERT for Indonesian)",
  "longDescription": "An NLP system for flagging misinformation in Indonesian political news, built with PyTorch and Hugging Face Transformers on top of a pre-trained IndoBERT language model. IndoBERT — a BERT variant pre-trained on large Indonesian corpora — was fine-tuned on a labelled dataset of legitimate and hoax political articles, letting the model pick up the subtle linguistic cues that separate genuine reporting from fabricated stories. The final classifier reached 99% accuracy, showing how transfer learning from a strong, language-specific model makes hoax detection viable even with a modest labelled dataset.",
  "feats": [
   "Fine-tuned IndoBERT on real vs. hoax political news",
   "99% accuracy on Indonesian-language articles",
   "Built on a SOTA pre-trained Indonesian language model"
  ],
  "outcomes": [
   "Acquired 99% classification accuracy"
  ],
  "links": [
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/Indonesian-Political-News-Hoax"
   }
  ]
 },
 {
  "id": "fire-smoke",
  "title": "Fire & Smoke Classification",
  "description": "Vision Transformer classifier robust to noisy imagery",
  "sub": "Image classification with Vision Transformers",
  "tech": [
   "Python",
   "Hugging Face",
   "PyTorch",
   "cv2"
  ],
  "image": "../assets/project/fire-smoke.jpg",
  "categories": [
   "computer vision"
  ],
  "featured": false,
  "metric": "90% accuracy",
  "methods": "Vision Transformer (ViT)",
  "longDescription": "An image-classification model that sorts visual scenes into four classes — fire, smoke, fire-smoke, and none — using a Vision Transformer (ViT) fine-tuned through Hugging Face. The dataset was deliberately difficult: many images were low-resolution, visually ambiguous, class-imbalanced, or corrupted with white noise, conditions that mirror the real surveillance footage where early fire detection matters most. Careful preprocessing and augmentation kept the ViT robust to that noise, and the final model reached 90% accuracy, making it a credible early-warning component for fire-and-smoke monitoring.",
  "feats": [
   "ViT classifying fire / smoke / fire-smoke / none",
   "Handled noisy, low-quality, imbalanced images",
   "Reached 90% accuracy on a hard dataset"
  ],
  "challenges": [
   "Bad image quality",
   "Imbalanced dataset",
   "Images corrupted with white noise"
  ],
  "outcomes": [
   "Acquired 90% classification accuracy"
  ],
  "links": [
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi"
   }
  ]
 },
 {
  "id": "nids",
  "title": "Network Intrusion Detection (NIDS)",
  "description": "LightGBM classifier on the CIC-IDS 2017 dataset",
  "sub": "ML-based cybersecurity threat detection",
  "tech": [
   "Python",
   "scikit-learn",
   "LightGBM",
   "pandas",
   "Matplotlib"
  ],
  "image": "../assets/project/nids.png",
  "categories": [
   "data science"
  ],
  "featured": false,
  "metric": "88.6% F1-macro",
  "year": "2023",
  "dataset": "CIC-IDS 2017",
  "longDescription": "A machine-learning network intrusion detection system (NIDS) trained on the CIC-IDS 2017 dataset, which captures realistic benign traffic alongside a broad range of modern cyber-attacks. The workflow covered thorough data preprocessing, exploratory data analysis to understand the traffic features, and handling of severe class imbalance before training a LightGBM gradient-boosting classifier across the many attack categories. The resulting model achieved a macro F1-score of 88.59%, showing it can distinguish multiple intrusion types — not just the most common ones — and flag potential cybersecurity threats reliably.",
  "feats": [
   "EDA + preprocessing on CIC-IDS 2017",
   "LightGBM classifier across attack types",
   "88.59% macro F1-score"
  ],
  "challenges": [
   "Highly imbalanced dataset"
  ],
  "outcomes": [
   "Achieved 88.59% macro F1-score"
  ],
  "links": [
   {
    "type": "ppt",
    "url": "https://www.canva.com/design/DAFzwdGqk9I/Gm2wSNS3_8p36L63YsCU2Q/edit"
   }
  ]
 },
 {
  "id": "vehicle-counting",
  "title": "Vehicle Detection & Counting",
  "description": "Multi-gate vehicle tracking & counting with YOLOv8",
  "sub": "Real-time multi-gate vehicle analytics",
  "tech": [
   "Python",
   "YOLOv8",
   "PyTorch",
   "Supervision"
  ],
  "image": "../assets/project/vehicle-counting.png",
  "categories": [
   "computer vision"
  ],
  "featured": false,
  "methods": "Pretrained YOLOv8 + Supervision tracking",
  "longDescription": "A multi-gate vehicle detection and counting system built on YOLOv8 and the Supervision library. The pipeline detects and tracks vehicles frame by frame in a video, assigns each one a persistent track ID, and increments a counter whenever a vehicle crosses one of several predefined virtual gate lines — so traffic can be measured per lane or per direction. Built on pretrained YOLOv8 weights, it reliably tracked and counted cars and buses through every gate, the kind of analytics useful for traffic monitoring and road-usage studies.",
  "feats": [
   "Tracks cars & buses through predefined gates",
   "Counts vehicles crossing each gate line",
   "Built on pretrained YOLOv8 + Supervision"
  ],
  "challenges": [
   "Inconsistent detection across video frames"
  ],
  "outcomes": [
   "Reliably tracked and counted every car and bus through each gate"
  ],
  "links": [
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/VehicleCounting"
   }
  ]
 },
 {
  "id": "carbon-emission",
  "title": "Carbon Emission Prediction",
  "description": "Random-forest regression on fuel-consumption data",
  "sub": "Fuel-consumption regression",
  "tech": [
   "Python",
   "scikit-learn",
   "pandas",
   "Matplotlib"
  ],
  "image": "../assets/project/carbon.png",
  "categories": [
   "data science"
  ],
  "featured": false,
  "metric": "R² 0.99",
  "year": "2024",
  "dataset": "Canada Fuel Consumption 2024",
  "longDescription": "A regression project predicting vehicle fuel consumption — and the carbon emissions tied to it — using the Canada Fuel Consumption 2024 dataset. After data cleaning, exploratory data analysis, and feature engineering on attributes such as engine size, cylinder count, and fuel type, a Random Forest Regressor was trained to estimate consumption. The model achieved an R-squared of 0.99, meaning it explains almost all of the variance in fuel use and can serve as a quick proxy for estimating a vehicle's environmental footprint.",
  "feats": [
   "Canada Fuel Consumption 2024 dataset",
   "Preprocessing + EDA + feature engineering",
   "Random Forest Regressor, R² of 0.99"
  ],
  "outcomes": [
   "Achieved a remarkable R² value of 0.99"
  ],
  "links": [
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/carbon-emission"
   }
  ]
 },
 {
  "id": "garbage-classification",
  "title": "Garbage Classification Web App",
  "description": "Streamlit app sorting organic vs. anorganic waste",
  "sub": "Image classification deployed on Streamlit",
  "tech": [
   "Python",
   "TensorFlow",
   "Streamlit",
   "cv2"
  ],
  "image": "../assets/project/garbage.jpg",
  "categories": [
   "computer vision"
  ],
  "featured": false,
  "year": "2025",
  "metric": "88% accuracy",
  "longDescription": "A computer-vision web app that classifies waste images into organic and anorganic categories to support recycling and waste sorting. A convolutional neural network was trained in TensorFlow on a labelled garbage dataset, then served through an interactive Streamlit interface where a user can upload a photo and instantly receive a prediction — no installation or technical knowledge required. Packaging the model as a lightweight web app turns a research notebook into something an everyday user can actually try, and the classifier reached 88% accuracy.",
  "feats": [
   "CNN classifier: organic vs. anorganic waste",
   "Served as an interactive Streamlit web app",
   "88% classification accuracy"
  ],
  "challenges": [
   "Imbalanced dataset"
  ],
  "outcomes": [
   "Acquired 88% accuracy"
  ],
  "links": [
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/klasifikasi-sampah-2"
   },
   {
    "type": "streamlit",
    "url": "https://klasifikasi-sampah-2.streamlit.app/"
   }
  ]
 },
 {
  "id": "golden-section",
  "title": "Golden Section Search Optimization",
  "description": "Optimizing Holt's double exponential smoothing",
  "sub": "Numerical optimization for time-series smoothing",
  "tech": [
   "Python",
   "NumPy",
   "pandas",
   "Matplotlib"
  ],
  "image": "../assets/project/golden-section.png",
  "categories": [
   "data science"
  ],
  "featured": false,
  "year": "2025",
  "longDescription": "A numerical-optimization study that applies the Golden Section Search method to tune the smoothing parameters of Holt's Double Exponential Smoothing model for time-series forecasting. Rather than relying on a black-box solver, parameter selection is framed as a one-dimensional search that iteratively narrows the interval containing the optimum, minimising forecast error in a transparent, easy-to-follow way. The search-based optimizer reached forecasting accuracy on par with an existing optimization method while staying simple and interpretable — a clean illustration of classical optimization applied to a practical forecasting task.",
  "feats": [
   "Golden Section Search for Holt model parameters",
   "Matches existing optimizers' performance",
   "Applied to double exponential smoothing"
  ],
  "outcomes": [
   "Built an optimization model for the Double Exponential Smoothing Holt model rivaling an existing optimizer"
  ],
  "links": [
   {
    "type": "github",
    "url": "https://github.com/aprirachmadi/Optimization-Methods"
   }
  ]
 }
];
