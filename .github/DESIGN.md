# Refined Vaporwave Portfolio — Design Specification

> A single-page personal portfolio for a **Senior Machine Learning Engineer**.
> Goal: the **clarity and information depth** of a top-tier portfolio, wearing a
> **disciplined retro-futurist ("refined vaporwave")** visual identity — neon used
> as accent, not decoration. This document is written so another agent can recreate
> the site faithfully from scratch.

Reference implementation: `vaporwave.html`, `vaporwave.css`, `vaporwave.js`.

---

## 1. Design Philosophy

Two independent layers, both required:

- **Substance (clarity layer)** — strong information architecture: a sharp hero
  value-prop, credibility stats, projects with concrete *key features + impact
  metrics*, categorized skills, an experience timeline, and a real contact form.
- **Skin (identity layer)** — retro-futurist styling: deep indigo canvas, a
  restrained pink→magenta→cyan gradient, a striped synthwave "sun", a perspective
  grid floor, monospace technical labels, subtle scroll-reveal motion.

**Guiding rule:** *Neon is seasoning.* Most of the page is dark and calm; accents
appear on gradients, hovers, metrics, and the hero. Never let the theme reduce
legibility or perceived seriousness.

---

## 2. Tech Stack

- **Plain HTML + CSS + vanilla JS.** No framework, no build step.
- Fonts via Google Fonts.
- JS only for: `IntersectionObserver` scroll-reveal and a front-end-only contact
  form (validation + success state).
- Works as static files; serve with any static host.

If recreating in a framework (e.g. Next.js + Tailwind), preserve the **design
tokens**, **component anatomy**, and **section structure** below.

---

## 3. File Structure

```
vaporwave.html   # markup + content
vaporwave.css    # all styling (design tokens + components)
vaporwave.js     # scroll-reveal + contact form handler
```

---

## 4. Design Tokens

### 4.1 Color (CSS variables on :root)

| Token        | Value                  | Use                                  |
|--------------|------------------------|--------------------------------------|
| `--bg`       | `#0a0918`              | Page background base (deep indigo)   |
| `--bg-2`     | `#100d27`              | Alt surface base                     |
| `--surface`  | `rgba(255,255,255,.035)` | Card backgrounds                   |
| `--surface-2`| `rgba(255,255,255,.06)`  | Card hover background              |
| `--border`   | `rgba(180,170,255,.14)`  | Default 1px borders               |
| `--border-2` | `rgba(180,170,255,.28)`  | Stronger borders / button outline |
| `--text`     | `#ece9ff`              | Primary text                         |
| `--muted`    | `#9c97c4`              | Secondary text                       |
| `--faint`    | `#6f6a96`              | Labels, captions, footer             |
| `--pink`     | `#ff5d9e`              | Accent 1                             |
| `--magenta`  | `#c061ff`              | Accent 2                             |
| `--cyan`     | `#45e0ff`              | Accent 3 (links, eyebrow text)       |
| `--gold`     | `#ffd27d`              | Metric highlights                    |

**Signature gradient:**
`--grad: linear-gradient(120deg, var(--pink), var(--magenta) 55%, var(--cyan));`
Used for: gradient text, primary button, project hover border, timeline spine.

**Page background** layers two soft radial glows over `--bg`:
```css
radial-gradient(900px 500px at 80% -5%, rgba(192,97,255,.18), transparent 60%),
radial-gradient(800px 500px at 0% 10%, rgba(69,224,255,.10), transparent 55%),
var(--bg);
```

### 4.2 Typography

| Role     | Font            | Weights      | Notes                                  |
|----------|-----------------|--------------|----------------------------------------|
| Display  | `Space Grotesk` | 400–700      | Headings, name, stat numbers           |
| Body     | `Inter`         | 400/500/600  | Paragraphs, descriptions               |
| Mono     | `Space Mono`    | 400/700      | Eyebrows, labels, metrics, nav links   |

- Headings: tight tracking (`letter-spacing: -0.5px` to `-1.5px`), `line-height` ~1.0–1.1.
- Body `line-height: 1.6`.
- **Eyebrow pattern:** uppercase mono, `letter-spacing: 3px`, color `--cyan`, prefixed
  with a pink `// ` via `::before`.
- **Gradient text** (`.grad-text`): apply `--grad` with `background-clip: text`.

### 4.3 Spacing / Layout

- Container: `--maxw: 1140px`, centered, horizontal padding `--pad: clamp(20px,5vw,64px)`.
- Section vertical padding: `clamp(64px, 11vh, 130px)`.
- Card radius: 14–18px. Chip/pill radius: 999px. Button radius: 10px.
- Card padding: 22–26px.

### 4.4 Motion

- **Scroll-reveal:** elements with `.reveal` start `opacity:0; translateY(24px)`,
  transition to visible (`.in`) over 0.6s ease. Stagger via small per-index
  `transition-delay` (0–300ms, capped).
- Hover lifts: `translateY(-2px to -5px)` with glow/border change.
- **Respect `prefers-reduced-motion`:** disable reveal transition.

---

## 5. Global Components

### 5.1 Buttons (`.btn`, `.btn--primary`)
- Base: mono font, `13px 24px`, radius 10px, 1px `--border-2`, `--surface` bg.
- Hover: lift + border turns `--pink`.
- Primary: gradient bg, dark text `#190a1a`, weight 700, pink drop-shadow.

### 5.2 Chips (`.chip`)
- Pill, 1px border, faint bg; hover turns text + border `--pink`. Used for skills/tech.

### 5.3 Section header (`.section-head`)
- Eyebrow (mono) → `h2` (display, with one phrase in `.grad-text`) → muted `p`.

---

## 6. Section-by-Section Spec

> Layout structure is fixed; **copy is placeholder** — replace from real content
> (see §8 Content Schema). All major blocks carry `.reveal`.

### 6.1 Navbar (`.nav`)
- Sticky, blurred translucent bg, bottom hairline border.
- Left: wordmark `alex.rivera` (the `.` is pink).
- Center: mono links (About, Projects, Experience, Contact) with animated gradient
  underline on hover.
- Right: small "Hire me" button.
- Mobile (<600px): hide center links.

### 6.2 Hero (`.hero`)
- **Background decorations (z-index 0):**
  - `.hero__glow` — blurred pink radial.
  - `.hero__sun` — synthwave sun: vertical gradient (gold→coral→pink→magenta),
    solid top half, **horizontal stripes** on bottom half via a two-layer `mask`,
    `opacity: .5`, positioned top-right.
  - `.hero::after` — **perspective grid floor**: two crossing line gradients
    (cyan + pink), `transform: perspective(420px) rotateX(62deg)` from bottom,
    faded upward with a `mask`.
- **Content (z-index 2):** eyebrow (role) → `h1` (name, ~5rem) → value-prop
  paragraph (with bolded key phrases) → CTA buttons.
- **Stats row** (`.stats`): 4 cards, each big `grad-text` number + mono label.

### 6.3 About + Skills (`#about`)
- Section header (about blurb).
- `.skills-grid`: 3 columns (2 on tablet, 1 on mobile) of `.skill-cat` cards.
  Each card: mono cyan category title + a wrap of `.chip`s.
- Categories: Languages, ML/Deep Learning, LLMs & NLP, Computer Vision,
  MLOps & Infra, Data.

### 6.4 Projects (`#projects`)
- `.projects`: 2-column grid (1 on mobile) of `.project` cards.
- **Project card anatomy** (the credibility centerpiece):
  - Top row: `.project__tag` (category pill, magenta) + `.project__metric`
    (gold impact stat, e.g. "8× cheaper training").
  - `h3` title → `.project__sub` (mono cyan one-liner) → `.project__desc`.
  - `.project__feats`: 2–3 "key feature" bullets (pink ▸ markers).
  - `.project__tech`: small mono tech tags.
  - Hover: lift + animated gradient **border** (via masked `::before`).
  - **Whole card is clickable** → opens the detail modal (§14.4).
- **Filtering + Featured-by-default + "View all" + detail modal** are
  **required, migrated features** — see the dedicated spec in **§14**.

### 6.5 Experience (`#experience`)
- `.timeline`: vertical gradient spine; each `.tl-item` has a glowing dot,
  a head row (role + cyan company + right-aligned mono date) and a muted blurb.
- Include roles + an education entry at the end.
- **Content source:** roles/dates/bullets come from **`cv.docx.md`** (§14.7) —
  there are new positions and updates to apply.

### 6.6 Contact (`#contact`)
- `.contact-grid`: 2 columns (1 on mobile).
  - Left (`.contact-info`): eyebrow, big heading, blurb, mono cyan email link,
    `.socials` (GitHub, Hugging Face, Google Scholar, LinkedIn).
  - Right (`.form`): Name, Email, Message fields + primary submit button +
    hidden success message (`.form__ok`).

### 6.7 Footer (`.footer`)
- Hairline top border; mono copyright left, tagline right.

---

## 7. Interactions (`vaporwave.js`)

1. **Scroll reveal** — `IntersectionObserver` (threshold 0.12) adds `.in` to
   `.reveal` elements once, with a staggered `transition-delay`.
2. **Contact form** — `submit` is intercepted; runs `checkValidity()`
   (uses native `reportValidity()` on failure), otherwise shows the success
   message, resets the form, and hides the message after 5s. **No backend** —
   wire to a real endpoint/service when productionizing.

---

## 8. Content Schema (what to write)

Replace placeholder copy using this schema. Keep it **concrete and metric-driven**.

- **Identity:** full name, role/title, 1–2 sentence value prop (years + specialties).
- **Stats (4):** short number + label each (e.g. years, models in prod, papers, latency).
- **About:** 2–3 sentences on how you work end-to-end.
- **Skills (6 categories):** category name + 4–6 items each.
- **Projects:** a configurable data array (§14.1) — each has `id`, `title`,
  `description`, `tech[]`, `image`, `categories[]`, `featured` flag, optional
  `metric`, `longDescription`, `challenges[]`, `outcomes[]`, `links[]`, plus
  optional richer detail fields (§14.5). Card shows tag/metric/title/sub/feats/tech;
  the modal shows the full detail.
- **Experience (+ education):** role, company, date range, 1–2 sentence
  impact-focused blurb. **Sourced from `cv.docx.md`** (§14.7).
- **Contact:** email, 1-line availability statement, social links.

> Current placeholder content lives in `vaporwave.html` as a working example of the
> **tone and density** to aim for. **Real content must be sourced from
> `information.md`** in the deploy repo (see §12). Map its fields onto the schema
> above. If `information.md` is missing a metric or bullet, keep the placeholder's
> *style* but flag the gap to the user rather than inventing facts.

---

## 9. Responsive Breakpoints

- **≤900px:** skills → 2 cols, projects → 1 col, contact → 1 col, stats → 2 cols.
- **≤600px:** hide nav links, skills → 1 col, timeline date wraps to its own line.
- **`prefers-reduced-motion`:** disable reveal animation.

---

## 10. Recreation Checklist

1. Add the three Google Fonts (`Space Grotesk`, `Inter`, `Space Mono`).
2. Define the `:root` tokens in §4 (colors, gradient, fonts, spacing).
3. Set the layered radial-glow page background.
4. Build global components: buttons, chips, section-head, eyebrow pattern, `.grad-text`.
5. Build sections in order (§6), all wrapped in `.wrap` containers and tagged `.reveal`.
6. Implement the hero decorations exactly (glow, striped sun mask, perspective grid).
7. Add `vaporwave.js` (reveal observer + form handler).
8. Fill content from the Content Schema (§8) / the user's `info/` directory.
9. Verify responsive behavior (§9) and reduced-motion.

---

## 11. Tuning Knobs

- **More overt vaporwave:** raise `--pink/--cyan` saturation, increase `.hero__sun`
  and grid `opacity`, add more gradient text, add a subtle scanline overlay.
- **More corporate-safe:** lower decoration opacity, use gradient only on the
  primary button + one heading word, increase dark spacing.

---

## 12. Deployment Target & Repo Migration

**Deploy repo:** `aprirachmadi.github.io` — a GitHub Pages **user site**, served at
`https://aprirachmadi.github.io/` from the repository root (base path `/`).

The repo currently holds a **legacy Vite + React + TypeScript + Tailwind + shadcn**
app that is being **fully replaced** by this static site. Plain static is the goal —
GitHub Pages serves it with **no build step**.

### 12.1 Files to remove (legacy scaffold)
`src/` (**but first migrate `src/assets/project/` images out** — see §14.6),
old `index.html`, `package.json`, `package-lock.json`, `bun.lockb`,
`vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `components.json`,
`eslint.config.js`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`,
`.env`, and `node_modules/` (if present).
Also check `.github/workflows/` — **delete any Vite/Node build workflow**, or it will
conflict with the static deploy.

### 12.2 Files to KEEP
- **`.git/`** — never delete (history + remote origin).
- **`LICENSE.txt`**
- **`information.md`** — the real content source (map into the Content Schema, §8).
- **`cv.docx.md`** — source of truth for new/updated work experience (§14.7).
- **`src/assets/project/`** — project images to migrate into the static site (§14.6).
- **`public/`** — inspect first; keep any favicon/images worth reusing, else remove.
- **`.gitignore`** — update to a static-site-appropriate version.

### 12.3 Files to add (the site)
Bring in the reference implementation from the `test-web-style` prototype:
- `vaporwave.html` → rename to **`index.html`** (so it serves at root).
- `vaporwave.css` (and update the `<link>` in `index.html` if you rename it).
- `vaporwave.js` (and update the `<script>` src accordingly).
- `DESIGN.md` (this file).
- Optionally add an empty **`.nojekyll`** file at root to bypass Jekyll processing
  (harmless; avoids any surprises with static asset serving).

> Asset links in the HTML are **relative** (`vaporwave.css`, `vaporwave.js`), which is
> correct for a root-served user site. Keep them relative or root-absolute (`/...`).

### 12.4 GitHub Pages settings (manual, done by user in GitHub UI)
**Settings → Pages → Build and deployment → Source: "Deploy from a branch" →
Branch: `main` (or default) / folder: `/ (root)`.** If it was previously set to
"GitHub Actions", switch it to branch-based after removing the workflow file.

### 12.5 Deploy flow
```
git add -A
git commit -m "Replace legacy site with refined-vaporwave static portfolio"
git push origin main
```
Pages redeploys automatically; live within ~1 minute at the user-site URL.

---

## 13. Kickoff Prompt for the Next Agent

Paste this to the agent working inside the `aprirachmadi.github.io` repo:

> You are building a **plain static** (HTML/CSS/JS, no framework, no build) personal
> portfolio for a **AI/ML Engineer**, deployed via GitHub Pages at the repo root.
> Follow `DESIGN.md` exactly — it is the full design spec (tokens, components, section
> structure, interactions, responsive rules).
>
> Steps:
> 1. **Clean the repo** per §12.1 (remove the legacy Vite/React scaffold). Keep
>    `.git`, `LICENSE.txt`, `information.md`, and useful `public/` assets.
> 2. **Install the site:** use the reference files (`vaporwave.html/css/js`) as the
>    source of truth; rename `vaporwave.html` → `index.html` and fix asset links.
>    Add a `.nojekyll` file.
> 3. **Wire real content:** read `information.md` and map it onto the Content Schema
>    (§8) — identity, stats, skills, projects (with key-feature bullets + impact
>    metrics), experience timeline, contact. Do **not** invent facts; flag any gaps.
> 4. **Polish & verify:** check responsive breakpoints (§9), reduced-motion, and that
>    the contact form's success state works. Optionally add sections the user has
>    content for (publications, certs, testimonials) using the same component styles.
> 5. **Deploy:** confirm Pages is set to "Deploy from a branch → root" (§12.4), then
>    commit and push (§12.5). Share the live URL.
>
> Design intent (do not lose): clarity-first information architecture wearing a
> **disciplined retro-futurist** skin — deep indigo canvas, restrained
> pink→magenta→cyan accents, mono technical labels, subtle motion. **Neon is
> seasoning, not the meal.**

---

## 14. Projects: Data, Filtering & Detail Modal (MIGRATED FEATURES)

These behaviors exist in the legacy React site (`src/components/Projects.tsx`) and
**must be preserved** in the static rebuild. Reimplement them in plain HTML/CSS/JS
(no shadcn/Radix), styled in the refined-vaporwave skin (§4–§5).

### 14.1 Project data model (single configurable source)
Keep all projects in **one config array** (e.g. a `projects` const in
`vaporwave.js`, or a separate `projects.js` / `projects.json`) so content is trivial
to edit. Each project object:

```js
{
  id: "fire-smoke",                 // stable slug
  title: "Fire Smoke Classification",
  description: "...",               // short one-liner → card subtitle
  tech: ["Python", "cv2"],          // tag chips
  image: "assets/project/fire-smoke.jpg",
  categories: ["computer vision"],  // taxonomy keys (see 14.2)
  featured: true,                   // controls default view (CONFIGURABLE)
  metric: "90% accuracy",           // optional gold headline badge
  longDescription: "...",           // modal body
  challenges: ["..."],
  outcomes: ["..."],
  links: [{ type: "github"|"ppt"|"streamlit"|"demo", url: "..." }],
  // optional richer fields (14.5): role, year, dataset, methods, results, images[], paperUrl
}
```

- **Featured is configurable:** a project shows in the default view **iff
  `featured: true`**. Changing which projects are featured = flip this one flag —
  no markup changes. (Legacy encoded this as a `"featured"` string inside
  `category[]`; **normalize to a boolean `featured` field**.)

### 14.2 Category taxonomy & filtering
- Canonical category keys (normalize casing): `computer vision`, `nlp`,
  `data science` (extend as content grows). Legacy used inconsistent casing
  (`"NLP"`, `"computer vision"`, `"data science"`) — **standardize** to lowercase
  keys + display labels (e.g. `nlp` → "NLP").
- **Filter bar** = pill buttons: **`Featured`** (default/active), **`All`**, then one
  pill per category.
- Behavior: a filter shows projects whose `categories` include that key;
  `Featured` shows `featured === true`; `All` shows everything. Render the grid from
  the filtered list; re-run the scroll-reveal on filter change.

### 14.3 Default = featured + "View all projects" button
- **Default render:** only **featured** projects.
- Add a prominent **"View all projects"** button below the grid (in addition to the
  `All` filter pill). Clicking it reveals the full set; provide a way back to
  featured-only (toggle label to "Show featured only", or just rely on the filter
  pills). Keep state in JS.

### 14.4 Detail modal (popup) — KEEP, and FIX issues
Clicking a card opens a **scrollable modal** with full detail.

- **Structure:** dim overlay (click-to-close) + centered panel,
  `max-width ≈ 720px`, `max-height: 85vh`, refined-vaporwave styling (dark surface,
  gradient accent border, mono labels).
- **FIX scrolling:** the **modal body** scrolls internally (`overflow-y: auto`),
  header can stay pinned. **Lock background scroll** while open
  (`document.body.style.overflow = "hidden"`) and restore on close. Close via:
  overlay click, an explicit **× close button**, and the **`Esc`** key. Reset scroll
  position to top on open.
- **FIX thumbnail / photo issues:**
  - Card thumbnails: fixed aspect ratio + `object-fit: cover` (no stretching);
    `loading="lazy"`.
  - **Graceful fallback:** if an image is missing/fails, show a placeholder
    (e.g. gradient block with the project title) via an `onerror` handler — don't
    leave a broken-image icon.
  - Modal hero image: avoid awkward cropping — use `object-fit: cover` with a
    sensible `max-height`, or `contain` when the full figure matters (e.g. diagrams).
- **Content order in modal:** title → short description → hero image → action
  buttons (open in **new tab**; labels: `github`→"GitHub Repository",
  `ppt`→"Presentation", `streamlit`/`demo`→"Live Demo") → **Challenges** →
  **Outcomes** → any present richer fields (14.5). Omit empty sections (legacy had
  blank `challenges: [""]` entries — **filter out empties**).

### 14.5 Add MORE detail per project
Extend each project (and the modal) with optional fields where content exists
(source from `information.md` / the user). Render only the fields that are present:
- `role`, `year` / `timeline`, `team`, `dataset`, `methods` / architecture,
  `results` (metrics or a small table), `images[]` (screenshot gallery), `paperUrl`.

### 14.6 Asset migration
Legacy project images live in **`src/assets/project/`**:
`Train Data (6).jpg` (fire/smoke), `hoax.png`, `nids.png`, `sirekap.png`,
`vehiclecounting.png`, `carbon.png`, `pilahin.jpg`, `goldensection.png`.
- **Move them into the static site** (e.g. `assets/project/…`) and reference by
  relative path.
- **Rename** messy names to clean slugs (e.g. `Train Data (6).jpg` →
  `fire-smoke.jpg`) and update the data array accordingly.

### 14.7 Experience updates — source: `cv.docx.md`
New work experience and edits to the Experience/Education sections must be taken
from **`cv.docx.md`** (roles, companies, dates, bullet points).

> ⚠️ **`cv.docx.md` was NOT present** in `aprirachmadi.github.io` (or anywhere under
> `D:\myprojects`) at spec-writing time. The next agent must **obtain it first**
> (ask the user to add it / convert the source `.docx` to markdown) before updating
> these sections. **Do not invent** roles or dates — use the file as the source of
> truth and flag anything missing.

### 14.8 Legacy reference (for fidelity)
The original data + behavior to migrate is in
`aprirachmadi.github.io/src/components/Projects.tsx`: a `projects` array (fields
`title, description, tech, image, category[], longDescription, challenges[],
outcomes[], links[]`), a `filters` list, `activeFilter` state, a `filteredProjects`
computation, and a shadcn `Dialog` + `ScrollArea` modal. Preserve the **feature
set**, not the framework.
