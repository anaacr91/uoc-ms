import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 700,
  once: true,
  offset: 80,
});

const filterButtons = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll("[data-category-card]");

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
