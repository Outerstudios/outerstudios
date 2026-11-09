// OUTERSTUDIOS — Demo iPhone Case Store

const products = [
  { id: 1, name: "Sandstone Case", model: "iPhone 17", category: "iphone17", price: 24.90, color: "#d8c4ac", label: "SAND" },
  { id: 2, name: "Mocha Case", model: "iPhone 17 Pro", category: "iphone17", price: 29.90, color: "#76584a", label: "MOCHA" },
  { id: 3, name: "Sage Case", model: "iPhone 17 Pro Max", category: "iphone17", price: 24.90, color: "#a7b5a0", label: "SAGE" },
  { id: 4, name: "Cloud Case", model: "iPhone 16", category: "iphone16", price: 22.90, color: "#e8e3da", label: "CLOUD" },
  { id: 5, name: "Rose Case", model: "iPhone 16 Pro", category: "iphone16", price: 26.90, color: "#d6a7a0", label: "ROSE" },
  { id: 6, name: "Midnight Case", model: "iPhone 16 Pro Max", category: "iphone16", price: 29.90, color: "#454b53", label: "NIGHT" },
  { id: 7, name: "Oat Case", model: "iPhone 15", category: "iphone15", price: 21.90, color: "#c9b59d", label: "OAT" },
  { id: 8, name: "Olive Case", model: "iPhone 15 Pro", category: "iphone15", price: 24.90, color: "#777d60", label: "OLIVE" }
];

const cart = [];
const productGrid = document.getElementById("product-grid");
const filters = document.querySelectorAll(".filter");
const cartButton = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");
const closeCartButton = document.getElementById("close-cart");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-button");

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR"
  }).format(amount);
}

// Generate a decorative phone case image without external files.
function createCaseImage(product) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700">
    <rect width="600" height="700" fill="#f2ede6"/>
    <ellipse cx="300" cy="604" rx="150" ry="24" fill="#c6b9ab" opacity=".35"/>
    <g transform="translate(182 85) rotate(-9 118 250)">
      <rect width="236" height="500" rx="43" fill="#292724"/>
      <rect x="8" y="8" width="220" height="484" rx="36" fill="${product.color}"/>
      <rect x="23" y="24" width="102" height="125" rx="27" fill="#d8d0c7" opacity=".85"/>
      <circle cx="53" cy="56" r="20" fill="#494743"/>
      <circle cx="96" cy="56" r="20" fill="#494743"/>
      <circle cx="53" cy="111" r="20" fill="#494743"/>
      <circle cx="96" cy="111" r="7" fill="#f5e7cc"/>
      <text x="118" y="425" text-anchor="middle" font-family="Arial" font-size="16" letter-spacing="3" fill="#ffffff" opacity=".8">OUTERSTUDIOS</text>
    </g>
  </svg>`;

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function renderProducts(category = "all") {
  const visibleProducts = category === "all"
    ? products
    : products.filter(product => product.category === category);

  productGrid.innerHTML = "";

  visibleProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
  

    const image = document.createElement("img");
    const productImages = {
  1: "images/sandstone.png",
  2: "images/mocha.png",
  3: "images/sage.png",
  4: "images/cloud.png",
  5: "images/rose.png",
  6: "images/midnight.png",
  7: "images/oat.png",
  8: "images/olive.png"
};

image.src = productImages[product.id] || createCaseImage(product);
    image.alt = product.name + " illustration for " + product.model;
    image.loading = "lazy";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const model = document.createElement("p");
    model.textContent = product.model;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatPrice(product.price);

    const modelSelect = document.createElement("select");

const availableModels = {
  iphone17: ["iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max"],
  iphone16: ["iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max"],
  iphone15: ["iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max"]
};

availableModels[product.category].forEach(phoneModel => {
  const option = document.createElement("option");
  option.value = phoneModel;
  option.textContent = phoneModel;
  modelSelect.appendChild(option);
});

modelSelect.value = product.model;
modelSelect.setAttribute("aria-label", "Choose iPhone model");

const addButton = document.createElement("button");
addButton.type = "button";
addButton.textContent = "Shop on Etsy";

addButton.addEventListener("click", () => {
  window.open(
    "https://www.etsy.com/shop/OuterStudios",
    "_blank",
    "noopener,noreferrer"
  );
});

card.append(image, title, model, price, modelSelect, addButton);
    productGrid.appendChild(card);
  });
}

function selectCategory(category) {
  filters.forEach(button => {
    button.classList.toggle("active", button.dataset.category === category);
  });
  renderProducts(category);
}

filters.forEach(button => {
  button.addEventListener("click", () => {
    selectCategory(button.dataset.category);
  });
});

document.querySelectorAll("[data-collection]").forEach(link => {
  link.addEventListener("click", () => {
    selectCategory(link.dataset.collection);
  });
});

function addToCart(productId, selectedModel) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const model = selectedModel || product.model;

  const item = cart.find(entry =>
    entry.id === productId && entry.model === model
  );

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      id: productId,
      model: model,
      quantity: 1
    });
  }

  renderCart();
  cartPanel.hidden = false;
};

function changeQuantity(productId, selectedModel, amount) {
  const item = cart.find(entry =>
    entry.id === productId && entry.model === selectedModel
  );

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart.splice(cart.indexOf(item), 1);
  }

  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Your bag is empty.";
    cartItems.appendChild(emptyMessage);
  }

  cart.forEach(entry => {
    const product = products.find(p => p.id === entry.id);
    if (!product) return;

    total += product.price * entry.quantity;
    count += entry.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const name = document.createElement("strong");
    name.textContent = product.name + " — " + entry.model;

    const details = document.createElement("p");
    details.textContent = formatPrice(product.price) + " each";

    const quantity = document.createElement("span");
    quantity.textContent = " Qty: " + entry.quantity + " ";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Remove one " + product.name);
    minus.addEventListener("click", () => changeQuantity(product.id, entry.model, -1));

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Add one " + product.name);
    plus.addEventListener("click", () => changeQuantity(product.id, entry.model, 1));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      const index = cart.findIndex(item =>
  item.id === product.id && item.model === entry.model
);
      if (index !== -1) cart.splice(index, 1);
      renderCart();
    });

    row.append(name, details, minus, quantity, plus, remove);
    cartItems.appendChild(row);
  });

  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);
  checkoutButton.disabled = cart.length === 0;
}

cartButton.addEventListener("click", () => {
  cartPanel.hidden = !cartPanel.hidden;
});

closeCartButton.addEventListener("click", () => {
  cartPanel.hidden = true;
});

checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) return;

  alert("This is an OUTERSTUDIOS demo store. No real orders or payments are accepted.");
});

renderProducts();
renderCart();