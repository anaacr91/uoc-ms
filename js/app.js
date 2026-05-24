function initFilters() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-category-card]");

  if (!filterButtons.length || !cards.length) {
    return;
  }

  for (const button of filterButtons) {
    button.addEventListener("click", () => {
      const filterValue = button.dataset.filter;

      for (const item of filterButtons) {
        item.classList.remove("is-active");
      }
      button.classList.add("is-active");

      for (const card of cards) {
        const cardType = card.dataset.type;
        const isMatch = filterValue === "todos" || cardType === filterValue;
        card.hidden = !isMatch;
      }
    });
  }
}

function initAbsoluteLinks() {
  const baseUrl = "https://anaacr91.github.io/uoc-ms/";
  const routes = {
    home: "index.html",
    categoria: "categoria/index.html",
    det1: "det1/index.html",
    det2: "det2/index.html",
    links: "links/index.html",
  };

  const routeLinks = document.querySelectorAll("a[data-route]");
  for (const link of routeLinks) {
    const routeKey = link.dataset.route;
    const routePath = routes[routeKey];

    if (routePath) {
      link.href = `${baseUrl}${routePath}`;
    }
  }
}

async function loadAOS() {
  if (!document.querySelector("[data-aos]")) {
    return;
  }

  try {
    const [{ default: AOS }] = await Promise.all([
      import("aos"),
      import("aos/dist/aos.css"),
    ]);

    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
      disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  } catch (error) {
    // Keep page functional even if the animation dependency fails to load.
    console.warn("No se pudo cargar AOS", error);
  }
}

function initPage() {
  initAbsoluteLinks();
  initFilters();

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => {
      void loadAOS();
    }, { timeout: 1200 });
  } else {
    setTimeout(() => {
      void loadAOS();
    }, 200);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage, { once: true });
} else {
  initPage();
}
