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
const productImage = document.querySelector(".product-image");
const productCaption = document.querySelector(".product-visual .visual-caption");

const products = {
  "guss-mani-parfum": {
    name: "Guss mani parfum",
    notes: "Una esencia creada para dejar huella.",
    price: 2450,
    image: "imagenes/perfume%201.jpg",
  },
};
const cart = new Map();

if (heroVideo instanceof HTMLVideoElement && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  heroVideo.pause();
}

document.querySelectorAll(".product-thumbnail").forEach((thumbnail) => {
  thumbnail.addEventListener("click", () => {
    const imageIndex = Number(thumbnail.dataset.image);
    const image = imageIndex === 1
      ? { src: "imagenes/perfume%202.png", alt: "Guss mani parfum, frasco sobre arena" }
      : { src: "imagenes/perfume%201.jpg", alt: "Guss mani parfum, frasco negro con detalles dorados" };

    if (productImage instanceof HTMLImageElement && productCaption) {
      productImage.src = image.src;
      productImage.alt = image.alt;
      productCaption.textContent = `FOTO ${imageIndex + 1} DE 2`;
    }

    products["guss-mani-parfum"].image = image.src;
    updateCart();

    document.querySelectorAll(".product-thumbnail").forEach((option) => {
      const isSelected = option === thumbnail;
      option.classList.toggle("is-selected", isSelected);
      option.setAttribute("aria-pressed", String(isSelected));
    });
  });
});

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
    visual.className = "cart-item-visual";
    visual.setAttribute("aria-hidden", "true");
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = "";
    visual.append(image);

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