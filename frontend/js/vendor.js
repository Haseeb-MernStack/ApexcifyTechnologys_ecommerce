import { Auth } from "./auth.js";
import { Api } from "./api.js";
import { renderNavbar } from "./ui.js";

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

renderNavbar();

const user = Auth.getUser();
if (!user || (user.role !== "vendor" && user.role !== "admin")) {
    alert("Vendor or admin access required.");
    location.href = "index.html";
}

// Elements
const productForm = document.getElementById("productForm");
const vendorFormError = document.getElementById("vendorFormError");
const vendorError = document.getElementById("vendorError");
const vendorProducts = document.getElementById("vendorProducts");
const formButtonText = document.getElementById("formButtonText");

const idInput = document.getElementById("productId");
const nameInput = document.getElementById("name");
const descInput = document.getElementById("description");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");

const loadProducts = async () => {
    try {
        vendorError.textContent = "";
        vendorProducts.innerHTML = "<tr><td colspan='6'>Loading…</td></tr>";
        const products = await Api.vendorGetMyProducts();

        if (!products.length) {
            vendorProducts.innerHTML = "<tr><td colspan='6'>No products yet.</td></tr>";
            return;
        }

        vendorProducts.innerHTML = "";
        for (const p of products) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>₹${p.price}</td>
        <td>${p.stock}</td>
        <td>${(p.rating || 0).toFixed(1)}★</td>
        <td>
          <button class="btn btn-ghost btn-sm" data-edit="${p._id}">Edit</button>
          <button class="btn btn-ghost btn-sm" data-delete="${p._id}">Delete</button>
        </td>
      `;
            vendorProducts.appendChild(tr);
        }
    } catch (err) {
        vendorError.textContent = err.message;
        vendorProducts.innerHTML = "";
    }
};

vendorProducts.addEventListener("click", async (e) => {
    const editId = e.target.dataset.edit;
    const deleteId = e.target.dataset.delete;

    if (editId) {
        // Load product list again to find the one
        const products = await Api.vendorGetMyProducts();
        const p = products.find((x) => x._id === editId);
        if (!p) return;

        idInput.value = p._id;
        nameInput.value = p.name;
        descInput.value = p.description;
        priceInput.value = p.price;
        stockInput.value = p.stock;
        categoryInput.value = p.category;
        imageInput.value = p.image || "";
        formButtonText.textContent = "Update product";
    }

    if (deleteId) {
        if (!confirm("Delete this product?")) return;
        try {
            await Api.vendorDeleteProduct(deleteId);
            await loadProducts();
        } catch (err) {
            alert(err.message);
        }
    }
});

productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    vendorFormError.textContent = "";

    const payload = {
        name: nameInput.value.trim(),
        description: descInput.value.trim(),
        price: Number(priceInput.value),
        stock: Number(stockInput.value),
        category: categoryInput.value.trim(),
        image: imageInput.value.trim()
    };

    try {
        if (idInput.value) {
            await Api.vendorUpdateProduct(idInput.value, payload);
            formButtonText.textContent = "Create product";
        } else {
            await Api.vendorCreateProduct(payload);
        }

        productForm.reset();
        idInput.value = "";
        await loadProducts();
    } catch (err) {
        vendorFormError.textContent = err.message;
    }
});

loadProducts();