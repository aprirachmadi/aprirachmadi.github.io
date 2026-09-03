(function () {
  "use strict";

  const registry = new Map();

  window.StoryScenes = {
    register(name, render) {
      registry.set(name, render);
    },
    render(name, target, context) {
      const scene = registry.get(name);
      if (!scene || !target) return null;
      target.replaceChildren();
      return scene(target, context || {});
    }
  };

  function startShell(shell) {
    const chapters = Array.from(shell.querySelectorAll("[data-story-chapter]"));
    const stage = shell.querySelector("[data-story-stage]");
    const progress = shell.querySelector("[data-story-progress]");
    const mobileTargets = Array.from(shell.querySelectorAll("[data-mobile-scene]"));
    if (!chapters.length || !stage) return;

    let activeIndex = 0;
    let cleanup = null;
    let transitionFrame = 0;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

    function activate(index, announce) {
      if (index < 0 || index >= chapters.length || (index === activeIndex && stage.childElementCount)) return;
      activeIndex = index;
      chapters.forEach((chapter, chapterIndex) => {
        const active = chapterIndex === index;
        chapter.classList.toggle("is-active", active);
        chapter.setAttribute("aria-current", active ? "step" : "false");
      });
      if (cleanup) cleanup();
      cancelAnimationFrame(transitionFrame);
      stage.classList.add("is-changing");
      cleanup = window.StoryScenes.render(chapters[index].dataset.storyChapter, stage, {
        reducedMotion: reducedMotion.matches,
        announce: Boolean(announce)
      });
      stage.dataset.activeScene = chapters[index].dataset.storyChapter;
      if (progress) progress.style.transform = `scaleX(${(index + 1) / chapters.length})`;
      if (reducedMotion.matches) {
        stage.classList.remove("is-changing");
      } else {
        transitionFrame = requestAnimationFrame(() => {
          transitionFrame = requestAnimationFrame(() => stage.classList.remove("is-changing"));
        });
      }
    }

    mobileTargets.forEach((target) => {
      window.StoryScenes.render(target.dataset.mobileScene, target, { reducedMotion: true, mobile: true });
    });

    const linkedChapter = location.hash && shell.querySelector(location.hash);
    if (linkedChapter && matchMedia("(max-width: 920px)").matches) {
      const restoreDeepLink = () => linkedChapter.scrollIntoView({ block: "start" });
      requestAnimationFrame(restoreDeepLink);
      addEventListener("load", () => setTimeout(restoreDeepLink, 0), { once: true });
      Promise.all(Array.from(shell.querySelectorAll("img")).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      })).then(restoreDeepLink);
    }

    activate(0, false);

    const observer = new IntersectionObserver(() => {
      const readingLine = innerHeight / 2;
      const index = chapters.findIndex((chapter) => {
        const rect = chapter.getBoundingClientRect();
        return rect.top <= readingLine && rect.bottom > readingLine;
      });
      if (index >= 0) activate(index, true);
    }, { rootMargin: "-49.5% 0px -49.5% 0px", threshold: 0 });

    chapters.forEach((chapter) => observer.observe(chapter));

    shell.addEventListener("keydown", (event) => {
      if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
      const focused = document.activeElement.closest("[data-story-chapter]");
      if (!focused) return;
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const next = chapters[Math.max(0, Math.min(chapters.length - 1, chapters.indexOf(focused) + direction))];
      next.focus({ preventScroll: true });
      next.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
    });

    reducedMotion.addEventListener?.("change", () => activate(activeIndex, false));
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-story-shell]").forEach(startShell);
  });
})();
