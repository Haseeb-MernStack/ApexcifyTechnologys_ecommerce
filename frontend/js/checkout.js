import { Cart } from "./cart.js";
import { Auth } from "./auth.js";
import { Api } from "./api.js";
import { renderNavbar } from "./ui.js";

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

renderNavbar();

const summaryBody = document.getElementById("summaryBody");
const summaryTotalEl = document.getElementById("summaryTotal");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutError = document.getElementById("checkoutError");

const items = Cart.get();

const renderSummary = () => {
    summaryBody.innerHTML = "";
    if (!items.length) {
        summaryBody.innerHTML = `<tr><td colspan="3">Your cart is empty.</td></tr>`;
    } else {
        for (const item of items) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price * item.quantity}</td>
      `;
            summaryBody.appendChild(tr);
        }
    }
    summaryTotalEl.textContent = `₹${Cart.total()}`;
};

renderSummary();

// Pre-fill from logged-in user if available
const user = Auth.getUser();
if (user) {
    document.getElementById("name").value = user.name || "";
    document.getElementById("email").value = user.email || "";
}

checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    checkoutError.textContent = "";

    if (!Auth.isLoggedIn()) {
        checkoutError.textContent = "Please log in before placing an order.";
        return;
    }

    if (!items.length) {
        checkoutError.textContent = "Your cart is empty.";
        return;
    }

    const address = document.getElementById("address").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;

    if (!address || !paymentMethod) {
        checkoutError.textContent = "Please fill in all required fields.";
        return;
    }

    const orderItems = items.map((i) => ({
        product: i.id,
        quantity: i.quantity
    }));

    try {
        const res = await Api.createOrder({
            items: orderItems,
            address,
            paymentMethod
        });

        alert(`Order placed successfully! Order ID: ${res.order._id}`);
        Cart.clear();
        location.href = "index.html";
    } catch (err) {
        checkoutError.textContent = err.message;
    }
});