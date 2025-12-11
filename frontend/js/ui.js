import { Auth } from "./auth.js";
import { Cart } from "./cart.js";

export const renderNavbar = () => {
  const user = Auth.getUser();
  const cartCount = Cart.get().reduce((sum, item) => sum + item.quantity, 0);

  const nav = document.querySelector(".navbar");
  if (!nav) return;

  nav.innerHTML = `
    <div class="navbar-inner">
      <a href="index.html" class="brand">
        <div class="brand-logo"></div>
        <div>
          <div class="brand-text">ApexcifyTechnologys</div>
          <div class="brand-sub">Premium Ecommerce</div>
        </div>
      </a>
      <div class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="cart.html" class="nav-link">Cart (${cartCount})</a>
        ${
          user && user.role === "vendor"
            ? `<a href="vendor-dashboard.html" class="nav-link">Vendor</a>`
            : ""
        }
        ${
          user && user.role === "admin"
            ? `<a href="admin-dashboard.html" class="nav-link">Admin</a>`
            : ""
        }
        ${
          user
            ? `<span class="nav-link">Hi, ${user.name}</span>
               <button class="nav-link btn-ghost" id="logoutBtn">Logout</button>`
            : `<a href="#auth" class="nav-link nav-link--primary" id="openAuth">Login / Signup</a>`
        }
      </div>
    </div>
  `;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Auth.clear();
      location.href = "index.html";
    });
  }
};