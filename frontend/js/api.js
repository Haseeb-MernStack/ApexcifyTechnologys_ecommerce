const API_BASE = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const apiRequest = async (path, options = {}) => {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.message || "Request failed");
    }
    return data;
};

export const Api = {
    // Public
    getProducts: (category) =>
        apiRequest(
            category ? `/products/category/${encodeURIComponent(category)}` : "/products"
        ),
    getProductById: (id) => apiRequest(`/products/${id}`),

    // Auth
    register: (payload) =>
        apiRequest("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
    login: (payload) =>
        apiRequest("/auth/login", { method: "POST", body: JSON.stringify(payload) }),

    // Orders
    createOrder: (payload) =>
        apiRequest("/orders", { method: "POST", body: JSON.stringify(payload) }),

    // Vendor
    vendorGetMyProducts: () => apiRequest("/vendor/my-products"),
    vendorCreateProduct: (payload) =>
        apiRequest("/vendor/products", {
            method: "POST",
            body: JSON.stringify(payload)
        }),
    vendorUpdateProduct: (id, payload) =>
        apiRequest(`/vendor/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        }),
    vendorDeleteProduct: (id) =>
        apiRequest(`/vendor/products/${id}`, { method: "DELETE" }),

    // Admin
    adminGetUsers: () => apiRequest("/admin/users"),
    adminGetOrders: () => apiRequest("/admin/orders"),
    adminDeleteUser: (id) => apiRequest(`/admin/user/${id}`, { method: "DELETE" }),
    adminDeleteOrder: (id) =>
        apiRequest(`/admin/order/${id}`, { method: "DELETE" })
};