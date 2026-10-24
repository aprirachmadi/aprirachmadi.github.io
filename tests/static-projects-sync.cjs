// Checks that the static project cards in index.html match PROJECTS in site.js.
// The static cards are what crawlers, link previews, and no-JS readers see.
//   node tests/static-projects-sync.cjs          # check, exit 1 on drift
//   node tests/static-projects-sync.cjs --write  # regenerate the static block
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const siteJs = fs.readFileSync(path.join(root, "site.js"), "utf8");
const indexPath = path.join(root, "index.html");
const rawIndex = fs.readFileSync(indexPath, "utf8");
const crlf = rawIndex.includes("\r\n");
const indexHtml = rawIndex.replace(/\r\n/g, "\n");

function grab(name, closer) {
  const marker = `const ${name} = `;
  const start = siteJs.indexOf(marker) + marker.length;
  const end = siteJs.indexOf(closer, start) + closer.length;
  return eval("(" + siteJs.slice(start, end).replace(/;$/, "") + ")");
}

const PROJECTS = grab("PROJECTS", "\n]");
const CATEGORY_LABELS = grab("CATEGORY_LABELS", "\n}");
const LINK_LABELS = grab("LINK_LABELS", "\n}");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const I = "          ";

function card(p) {
  const top = [`<span class="project__tag">${esc(CATEGORY_LABELS[p.categories[0]] || p.categories[0])}</span>`];
  if (p.year) top.push(`<span class="project__year">${esc(p.year)}</span>`);
  if (p.metric) top.push(`<span class="project__metric">${esc(p.metric)}</span>`);
  const links = (p.links || []).map((l) => {
    const ext = l.url.startsWith("projects/") ? "" : ' target="_blank" rel="noopener"';
    return `<a class="btn" href="${esc(l.url)}"${ext}>${esc(LINK_LABELS[l.type] || l.type)}</a>`;
  });
  return [
    `${I}<article class="project project--static reveal">`,
    `${I}  <div class="project__top">${top.join("")}</div>`,
    `${I}  <h3 class="project__title">${esc(p.title)}</h3>`,
    `${I}  <p class="project__desc">${esc(p.description)}</p>`,
    links.length ? `${I}  <div class="project__actions">${links.join("")}</div>` : null,
    `${I}</article>`,
  ].filter(Boolean).join("\n");
}

const expected = PROJECTS.map(card).join("\n") + "\n";
const startMarker = "Keep in sync: node tests/static-projects-sync.cjs -->\n";
const start = indexHtml.indexOf(startMarker) + startMarker.length;
const end = indexHtml.indexOf("        </div>\n", start);
if (start < startMarker.length || end < 0) throw new Error("Static project block not found in index.html");

if (process.argv.includes("--write")) {
  const out = indexHtml.slice(0, start) + expected + indexHtml.slice(end);
  fs.writeFileSync(indexPath, crlf ? out.replace(/\n/g, "\r\n") : out);
  console.log(`Wrote ${PROJECTS.length} static project cards to index.html`);
} else if (indexHtml.slice(start, end) !== expected) {
  console.error("Static project cards in index.html are out of sync with PROJECTS in site.js.");
  console.error("Run: node tests/static-projects-sync.cjs --write");
  process.exit(1);
} else {
  console.log(`OK: ${PROJECTS.length} static project cards match PROJECTS`);
}
