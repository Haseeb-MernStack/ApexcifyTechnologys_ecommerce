import { Cart } from "./cart.js";
import { renderNavbar } from "./ui.js";

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

renderNavbar();

const cartBody = document.getElementById("cartBody");
const cartTotalEl = document.getElementById("cartTotal");
const cartEmpty = document.getElementById("cartEmpty");
const checkoutBtn = document.getElementById("checkoutBtn");

const renderCart = () => {
    const items = Cart.get();
    cartBody.innerHTML = "";

    if (!items.length) {
        cartEmpty.style.display = "block";
        checkoutBtn.classList.add("btn-ghost");
        checkoutBtn.classList.remove("btn-primary");
        checkoutBtn.style.pointerEvents = "none";
        cartTotalEl.textContent = "₹0";
        return;
    }

    cartEmpty.style.display = "none";
    checkoutBtn.classList.remove("btn-ghost");
    checkoutBtn.classList.add("btn-primary");
    checkoutBtn.style.pointerEvents = "auto";

    for (const item of items) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <img src="${item.image ||
            "https://via.placeholder.com/60x60"}" alt="${item.name}"
            style="width:46px;height:46px;border-radius:10px;object-fit:cover;" />
          <div>
            <div>${item.name}</div>
          </div>
        </div>
      </td>
      <td>₹${item.price}</td>
      <td>
        <input
          type="number"
          min="1"
          value="${item.quantity}"
          data-qty="${item.id}"
          class="input"
          style="max-width:80px;"
        />
      </td>
      <td>₹${item.price * item.quantity}</td>
      <td>
        <button class="btn btn-ghost btn-sm" data-remove="${item.id}">Remove</button>
      </td>
    `;
        cartBody.appendChild(tr);
    }

    cartTotalEl.textContent = `₹${Cart.total()}`;
};

cartBody.addEventListener("input", (e) => {
    const id = e.target.dataset.qty;
    if (id) {
        const qty = parseInt(e.target.value || "1", 10);
        Cart.update(id, qty);
        renderCart();
    }
});

cartBody.addEventListener("click", (e) => {
    const id = e.target.dataset.remove;
    if (id) {
        Cart.remove(id);
        renderCart();
    }
});

renderCart();