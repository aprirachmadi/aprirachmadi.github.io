const { chromium } = require("playwright");

const pageUrl = process.env.GEO_LENS_TEST_URL || "http://127.0.0.1:8765/projects/geo-lens/";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function storyState(page) {
  return page.evaluate(() => {
    const chapters = Array.from(document.querySelectorAll("[data-story-chapter]"));
    const readingLine = innerHeight / 2;
    const expected = chapters.findIndex((chapter) => {
      const rect = chapter.getBoundingClientRect();
      return rect.top <= readingLine && rect.bottom > readingLine;
    });
    const active = chapters.findIndex((chapter) => chapter.classList.contains("is-active"));
    const sceneName = document.querySelector("[data-story-stage]").dataset.activeScene;
    const visual = chapters.findIndex((chapter) => chapter.dataset.storyChapter === sceneName);
    return { expected, active, visual, sceneName };
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(pageUrl, { waitUntil: "load" });

  const boundaries = await page.locator("[data-story-chapter]").evaluateAll((chapters) =>
    chapters.slice(1).map((chapter) => chapter.getBoundingClientRect().top + scrollY - innerHeight / 2)
  );
  const positions = boundaries.flatMap((boundary) => [boundary - 24, boundary + 24]);

  for (const y of positions) {
    await page.evaluate((nextY) => scrollTo(0, nextY), y);
    await page.waitForTimeout(50);
    const state = await storyState(page);
    assert(state.expected === state.active, `highlight mismatch at y=${y}: ${JSON.stringify(state)}`);
    assert(state.active === state.visual, `visual mismatch at y=${y}: ${JSON.stringify(state)}`);
  }

  for (const y of [...positions, ...positions.reverse()]) {
    await page.evaluate((nextY) => scrollTo(0, nextY), y);
    await page.waitForTimeout(20);
    const state = await storyState(page);
    assert(state.active === state.visual, `rapid-scroll visual mismatch at y=${y}: ${JSON.stringify(state)}`);
  }

  await browser.close();
  console.log(`PASS ${positions.length * 2} boundary and rapid-scroll checks`);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
