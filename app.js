const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const bagCount = document.querySelector(".bag-count");
const toast = document.querySelector(".toast");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    mainNav.classList.toggle("is-open", !isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      mainNav.classList.remove("is-open");
    });
  });
}

let itemsInBag = 0;
let toastTimeout;

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    itemsInBag += 1;
    if (bagCount) bagCount.textContent = String(itemsInBag);

    if (toast) {
      toast.textContent = `${button.dataset.product} añadido a tu bolsa`;
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimeout);
      toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
    }
  });
});