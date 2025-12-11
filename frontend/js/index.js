import { Api } from "./api.js";
import { Cart } from "./cart.js";
import { renderNavbar } from "./ui.js";

const productGrid = document.getElementById("productGrid");
const productError = document.getElementById("productError");
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

renderNavbar();

const renderProducts = (products) => {
  productGrid.innerHTML = "";
  if (!products.length) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  for (const p of products) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-img-wrap">
        <img class="product-img" src="${p.image || "https://via.placeholder.com/400x300"}" alt="${p.name}" />
      </div>
      <div class="product-meta">
        <div>
          <div class="product-title">${p.name}</div>
          <div class="product-category">${p.category}</div>
        </div>
        <div class="product-price">₹${p.price}</div>
      </div>
      <div class="product-meta">
        <span class="product-rating">★ ${p.rating?.toFixed(1) || "0.0"}</span>
        <span class="badge">${p.stock > 0 ? "In stock" : "Out of stock"}</span>
      </div>
      <div class="product-actions">
        <button class="btn btn-primary btn-sm" data-view="${p._id}">
          View
        </button>
        <button class="btn btn-ghost btn-sm" data-cart="${p._id}">
          Add to cart
        </button>
      </div>
    `;
    productGrid.appendChild(card);
  }
};

const loadProducts = async (category = "") => {
  try {
    productError.textContent = "";
    productGrid.innerHTML = "<p>Loading products…</p>";
    const data = await Api.getProducts(category || undefined);
    renderProducts(data);
  } catch (err) {
    productError.textContent = err.message;
    productGrid.innerHTML = "";
  }
};

productGrid.addEventListener("click", async (e) => {
  const viewId = e.target.dataset.view;
  const cartId = e.target.dataset.cart;

  if (viewId) {
    location.href = `product.html?id=${viewId}`;
  }

  if (cartId) {
    try {
      const product = (await Api.getProductById(cartId));
      Cart.add(product, 1);
      alert("Added to cart");
      renderNavbar(); // update cart count
    } catch (err) {
      alert(err.message);
    }
  }
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("chip--active"));
    chip.classList.add("chip--active");
    const category = chip.dataset.category || "";
    loadProducts(category);
  });
});

loadProducts();