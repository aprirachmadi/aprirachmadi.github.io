# aprirachmadi.github.io

Personal portfolio of **Apri Dwi Rachmadi** — AI Engineer & Data Scientist.

A single-page portfolio built as a **plain static site** (no framework, no build step):
hand-written HTML, CSS, and vanilla JavaScript. It showcases an about/skills
overview, a filterable projects gallery with detail pop-ups, a work-experience
and awards timeline, and a contact section, all in a retro-futurist "vaporwave"
theme.

## Tech stack

- **HTML / CSS / vanilla JS** — zero dependencies, no bundler.
- **Google Fonts** (Space Grotesk, Inter, Space Mono) loaded via CDN.
- Hosted on **GitHub Pages** (served straight from the repo root).

## Project structure

```
index.html          # markup for every section
vaporwave.css       # all styles + responsive breakpoints
vaporwave.js        # project data, filtering, detail modal, scroll reveal
assets/             # project thumbnails and the site icon
public/             # legacy favicon / images kept from the previous app
.nojekyll           # tells GitHub Pages to serve files as-is (skip Jekyll)
```

To add or edit a project, update the `PROJECTS` array near the top of
`vaporwave.js` — each entry controls the card, the filter category, the
`featured` flag, and the detail pop-up.

## Run locally

Because it's a static site, you only need any local HTTP server. Pick one:

```bash
# Python 3 (built in on most systems)
python -m http.server 8123

# or Node.js
npx serve -l 8123
```

Then open <http://localhost:8123> in your browser.

> Opening `index.html` directly via `file://` mostly works, but using a local
> server avoids path/CORS quirks and matches how GitHub Pages serves the site.

### Test it on your phone

With the server running, find your computer's LAN IP (`ipconfig` on Windows,
`ifconfig` / `ip addr` on macOS/Linux) and, from a phone on the **same Wi-Fi**,
visit `http://<your-computer-ip>:8123` (allow the port through your firewall if
prompted).

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