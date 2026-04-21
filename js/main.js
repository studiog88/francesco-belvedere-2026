(function () {
  function initHeroWeightRamp() {
    const root = document.querySelector("[data-hero-weight-ramp]");
    if (!root) return;

    const lines = [
      { text: "Francesco", className: "hero__line hero__line--first" },
      { text: "Belvedere", className: "hero__line hero__line--second" },
    ];

    root.replaceChildren();

    for (const line of lines) {
      const row = document.createElement("span");
      row.className = line.className;

      for (const ch of line.text) {
        const span = document.createElement("span");
        span.className = "hero__char";
        span.textContent = ch;
        span.style.setProperty("--hero-wght", "900");
        span.style.fontWeight = "900";
        row.appendChild(span);
      }

      root.appendChild(row);
    }
  }

  function initHeroViewportFit() {
    const root = document.querySelector("[data-hero-weight-ramp]");
    if (!root) return;

    function applyFit() {
      root.style.setProperty("--hero-fit", "1");
      void root.offsetWidth;
      const rows = root.querySelectorAll(".hero__line");
      if (!rows.length) return;
      let maxW = 0;
      rows.forEach((row) => {
        maxW = Math.max(maxW, row.getBoundingClientRect().width);
      });
      const vw = document.documentElement.clientWidth;
      if (maxW <= 0 || vw <= 0) return;
      const raw = vw / maxW;
      const scale = Number.isFinite(raw)
        ? Math.max(0.01, Math.min(1, raw))
        : 1;
      root.style.setProperty("--hero-fit", String(scale));
    }

    function scheduleFit() {
      window.requestAnimationFrame(applyFit);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        scheduleFit();
        scheduleFit();
      });
    } else {
      scheduleFit();
    }

    const ro = new ResizeObserver(() => scheduleFit());
    ro.observe(root);
    window.addEventListener("resize", scheduleFit);
  }

  initHeroWeightRamp();
  initHeroViewportFit();

  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  const preloader = document.getElementById("site-preloader");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const minVisibleMs = prefersReducedMotion ? 0 : 5000;
  const exitDurationMs = prefersReducedMotion ? 50 : 1000;

  function teardownPreloader() {
    document.documentElement.classList.remove("is-preloading");
    preloader?.remove();
  }

  function startExit() {
    if (!preloader) return;
    preloader.classList.add("site-preloader--exiting");
    window.setTimeout(teardownPreloader, exitDurationMs);
  }

  if (preloader) {
    document.documentElement.classList.add("is-preloading");
    window.setTimeout(startExit, minVisibleMs);
  }
})();
