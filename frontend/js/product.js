import { Api } from "./api.js";
import { Cart } from "./cart.js";
import { renderNavbar } from "./ui.js";

const detailEl = document.getElementById("productDetail");
const errorEl = document.getElementById("productError");
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

renderNavbar();

const params = new URLSearchParams(location.search);
const id = params.get("id");

const loadProduct = async () => {
  try {
    detailEl.innerHTML = "<p>Loading product…</p>";
    const p = await Api.getProductById(id);
    detailEl.innerHTML = `
      <div class="detail-image">
        <img src="${p.image || "https://via.placeholder.com/600x500"}" alt="${p.name}" />
      </div>
      <div class="detail-panel">
        <div class="badge-pill">${p.category}</div>
        <h1 class="detail-title">${p.name}</h1>
        <div class="detail-price">₹${p.price}</div>
        <p class="detail-description">${p.description}</p>
        <p class="product-rating">★ ${p.rating?.toFixed(1) || "0.0"} rating</p>
        <p>Stock: <span class="${p.stock > 0 ? "text-success" : "text-danger"}">
          ${p.stock > 0 ? "Available" : "Out of Stock"}
        </span></p>
        <div class="hero-actions">
          <button class="btn btn-primary" id="addToCart">Add to cart</button>
        </div>
      </div>
    `;

    document.getElementById("addToCart").addEventListener("click", () => {
      Cart.add(p, 1);
      alert("Added to cart");
      renderNavbar();
    });
  } catch (err) {
    errorEl.textContent = err.message;
    detailEl.innerHTML = "";
  }
};

if (id) loadProduct();
else {
  errorEl.textContent = "No product id provided.";
}