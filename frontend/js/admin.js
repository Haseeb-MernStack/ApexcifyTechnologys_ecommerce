import { Auth } from "./auth.js";
import { Api } from "./api.js";
import { renderNavbar } from "./ui.js";

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

renderNavbar();

const user = Auth.getUser();
if (!user || user.role !== "admin") {
    alert("Admin access required.");
    location.href = "index.html";
}

const adminUsersError = document.getElementById("adminUsersError");
const adminUsersBody = document.getElementById("adminUsersBody");
const adminOrdersError = document.getElementById("adminOrdersError");
const adminOrdersBody = document.getElementById("adminOrdersBody");

const formatDate = (str) =>
    new Date(str).toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "short"
    });

// Load users
const loadUsers = async () => {
    try {
        adminUsersError.textContent = "";
        adminUsersBody.innerHTML = "<tr><td colspan='5'>Loading…</td></tr>";

        const users = await Api.adminGetUsers();
        adminUsersBody.innerHTML = "";

        if (!users.length) {
            adminUsersBody.innerHTML = "<tr><td colspan='5'>No users found.</td></tr>";
            return;
        }

        for (const u of users) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>
          <span class="badge-pill">${u.role}</span>
        </td>
        <td>${u.createdAt ? formatDate(u.createdAt) : "-"}</td>
        <td>
          ${u.role === "admin"
                    ? ""
                    : `<button class="btn btn-ghost btn-sm" data-delete-user="${u._id}">
                   Delete
                 </button>`
                }
        </td>
      `;
            adminUsersBody.appendChild(tr);
        }
    } catch (err) {
        adminUsersError.textContent = err.message;
        adminUsersBody.innerHTML = "";
    }
};

// Load orders
const loadOrders = async () => {
    try {
        adminOrdersError.textContent = "";
        adminOrdersBody.innerHTML = "<tr><td colspan='6'>Loading…</td></tr>";

        const orders = await Api.adminGetOrders();
        adminOrdersBody.innerHTML = "";

        if (!orders.length) {
            adminOrdersBody.innerHTML = "<tr><td colspan='6'>No orders found.</td></tr>";
            return;
        }

        for (const o of orders) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${o._id}</td>
        <td>${o.customer ? o.customer.name : "-"}</td>
        <td>₹${o.totalAmount}</td>
        <td>${o.status}</td>
        <td>${o.createdAt ? formatDate(o.createdAt) : "-"}</td>
        <td>
          <button class="btn btn-ghost btn-sm" data-delete-order="${o._id}">
            Delete
          </button>
        </td>
      `;
            adminOrdersBody.appendChild(tr);
        }
    } catch (err) {
        adminOrdersError.textContent = err.message;
        adminOrdersBody.innerHTML = "";
    }
};

adminUsersBody.addEventListener("click", async (e) => {
    const userId = e.target.dataset.deleteUser;
    if (userId) {
        if (!confirm("Delete this user?")) return;
        try {
            await Api.adminDeleteUser(userId);
            await loadUsers();
        } catch (err) {
            alert(err.message);
        }
    }
});

adminOrdersBody.addEventListener("click", async (e) => {
    const orderId = e.target.dataset.deleteOrder;
    if (orderId) {
        if (!confirm("Delete this order?")) return;
        try {
            await Api.adminDeleteOrder(orderId);
            await loadOrders();
        } catch (err) {
            alert(err.message);
        }
    }
});

loadUsers();
loadOrders();