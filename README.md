# aprirachmadi.github.io

Personal portfolio of **Apri Dwi Rachmadi** — AI Engineer & Data Scientist.

A single-page portfolio built as a **plain static site** (no framework, no build step):
hand-written HTML, CSS, and vanilla JavaScript. It showcases an about/skills
overview, a filterable single-column projects list with inline expandable details
(accordion), a work-experience and awards timeline, and a contact section, in a
refined academic editorial theme (warm neutral base, indigo/cyan accents).

## Tech stack

- **HTML / CSS / vanilla JS** — zero dependencies, no bundler.
- **Google Fonts** (Inter + Lora) loaded via CDN.
- **Formspree** for the contact form (`site.js` posts to Formspree).
- Hosted on **GitHub Pages** (served straight from the repo root).

## Project structure

```
index.html          # markup for every section
site.css            # all styles + responsive breakpoints
site.js             # project data, filtering, accordion details, scroll reveal, canvas
assets/             # site icon, CV, project images (assets/project/)
public/             # legacy favicon / images kept from the previous app
.nojekyll           # tells GitHub Pages to serve files as-is (skip Jekyll)
```

To add or edit a project, update the `PROJECTS` array near the top of
`site.js` — each entry controls the card, the filter category, the
`featured` flag, and the expandable detail (overview, methods, outcomes,
links, image).

## Run locally

Because it's a static site, you only need any local HTTP server. Any port
works — pick one and open that same port in your browser:

```bash
# Python 3 (built in on most systems) — 8765 is used as an example
python -m http.server 8765

# or Node.js
npx serve -l 8765
```

Then open <http://localhost:8765> in your browser. If you use a different
port (e.g. `8123`), open `http://localhost:8123` instead — the number is just
the door you chose.

> Opening `index.html` directly via `file://` mostly works, but using a local
> server avoids path/CORS quirks and matches how GitHub Pages serves the site.
> If you see old content after editing, hard-refresh (`Ctrl+F5` / `Ctrl+Shift+R`)
> — the browser caches each port separately.

### Test it on your phone

With the server running, find your computer's LAN IP (`ipconfig` on Windows,
`ifconfig` / `ip addr` on macOS/Linux) and, from a phone on the **same Wi-Fi**,
visit `http://<your-computer-ip>:8765` (allow the port through your firewall if
prompted). Use whatever port you started the server on.

## Deploy (GitHub Pages)

This repo is a GitHub **user site**, so the `main` branch is published
automatically. To ship changes:

```bash
git add -A
git commit -m "Update portfolio"
git push origin main
```

GitHub Pages rebuilds within ~1 minute. Make sure **Settings → Pages** is set to
**Deploy from a branch → `main` / `/ (root)`**. The live site is then available
at <https://aprirachmadi.github.io/>.
