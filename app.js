const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const bagCount = document.querySelector(".bag-count");
const toast = document.querySelector(".toast");
const cartDialog = document.querySelector(".cart-dialog");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartFooter = document.querySelector(".cart-footer");
const cartSubtotal = document.querySelector(".cart-subtotal strong");
const cartClose = document.querySelector(".cart-close");
const heroVideo = document.querySelector(".hero-video");

const products = {
  "noir-absolu": { name: "Noir Absolu", notes: "Ámbar · Cedro · Vainilla", price: 2450, style: "mini-noir" },
  "rose-eternelle": { name: "Rose Éternelle", notes: "Rosa de Grasse · Almizcle", price: 2650, style: "mini-rose" },
  "oud-sauvage": { name: "Oud Sauvage", notes: "Oud · Azafrán · Incienso", price: 2850, style: "mini-oud" },
};
const cart = new Map();

if (heroVideo instanceof HTMLVideoElement && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  heroVideo.pause();
}

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

let toastTimeout;

function formatPrice(amount) {
  return `$${amount.toLocaleString("es-MX")}`;
}

function updateCart() {
  if (!cartItems || !cartEmpty || !cartFooter || !cartSubtotal || !bagCount) return;

  const entries = Array.from(cart.entries());
  const itemCount = entries.reduce((total, [, quantity]) => total + quantity, 0);
  const subtotal = entries.reduce((total, [id, quantity]) => total + products[id].price * quantity, 0);
  bagCount.textContent = String(itemCount);
  cartEmpty.hidden = itemCount > 0;
  cartFooter.hidden = itemCount === 0;
  cartSubtotal.textContent = formatPrice(subtotal);
  cartItems.replaceChildren();

  entries.forEach(([id, quantity]) => {
    const product = products[id];
    const item = document.createElement("li");
    item.className = "cart-item";

    const visual = document.createElement("span");
    visual.className = `cart-item-visual ${product.style}`;
    visual.setAttribute("aria-hidden", "true");

    const details = document.createElement("div");
    details.className = "cart-item-details";

    const name = document.createElement("h3");
    name.textContent = product.name;
    const notes = document.createElement("p");
    notes.textContent = product.notes;
    const price = document.createElement("strong");
    price.textContent = formatPrice(product.price * quantity);

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Quitar una unidad de ${product.name}`);
    decrease.addEventListener("click", () => changeQuantity(id, -1));
    const quantityLabel = document.createElement("span");
    quantityLabel.textContent = String(quantity);
    const increase = document.createElement("button");
    increase.type = "button";
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Añadir una unidad de ${product.name}`);
    increase.addEventListener("click", () => changeQuantity(id, 1));
    controls.append(decrease, quantityLabel, increase);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "cart-remove";
    remove.textContent = "Eliminar";
    remove.addEventListener("click", () => {
      cart.delete(id);
      updateCart();
    });

    details.append(name, notes, price, controls, remove);
    item.append(visual, details);
    cartItems.append(item);
  });
}

function changeQuantity(id, amount) {
  const quantity = (cart.get(id) || 0) + amount;
  if (quantity <= 0) cart.delete(id);
  else cart.set(id, quantity);
  updateCart();
}

document.querySelector(".bag-link")?.addEventListener("click", () => {
  if (cartDialog instanceof HTMLDialogElement) cartDialog.showModal();
});

cartClose?.addEventListener("click", () => {
  if (cartDialog instanceof HTMLDialogElement) cartDialog.close();
});

cartDialog?.addEventListener("cancel", () => {
  if (cartDialog instanceof HTMLDialogElement) cartDialog.close();
});

cartDialog?.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDialog instanceof HTMLDialogElement) {
    cartDialog.close();
  }
});

cartDialog?.addEventListener("click", (event) => {
  if (event.target === cartDialog) cartDialog.close();
});

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.product;
    const product = id ? products[id] : undefined;
    if (!id || !product) return;

    cart.set(id, (cart.get(id) || 0) + 1);
    updateCart();

    if (toast) {
      toast.textContent = `${product.name} añadido a tu bolsa`;
      toast.classList.add("is-visible");
      window.clearTimeout(toastTimeout);
      toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
    }
  });
});

updateCart();