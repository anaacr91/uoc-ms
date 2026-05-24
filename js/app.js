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
