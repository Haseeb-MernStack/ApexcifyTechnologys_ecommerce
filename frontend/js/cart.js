const CART_KEY = "apexcify_cart";

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const Cart = {
  get: readCart,
  add(product, quantity = 1) {
    const cart = readCart();
    const existing = cart.find((c) => c.id === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      });
    }
    writeCart(cart);
  },
  update(id, quantity) {
    let cart = readCart();
    cart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
      .filter((item) => item.quantity > 0);
    writeCart(cart);
  },
  remove(id) {
    const cart = readCart().filter((item) => item.id !== id);
    writeCart(cart);
  },
  clear() {
    writeCart([]);
  },
  total() {
    return readCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
};