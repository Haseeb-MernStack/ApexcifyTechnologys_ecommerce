import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import sendEmail from "../utils/sendEmail.js";

// POST /orders
export const createOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;

    if (!items || !items.length || !address || !paymentMethod) {
      return res.status(400).json({ message: "Missing order details" });
    }

    // Calculate total and check stock
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      customer: req.user._id,
      items,
      totalAmount,
      address,
      paymentMethod
    });

    // Send email confirmation (best-effort)
    try {
      await sendEmail({
        to: req.user.email,
        subject: "Order Confirmation - ApexcifyTechnologys",
        html: `<p>Thank you for your order!</p>
               <p>Order ID: ${order._id}</p>
               <p>Total Amount: ₹${totalAmount}</p>`
      });
    } catch (e) {
      console.error("Order email failed:", e.message);
    }

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /orders/:userId
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Only that user or admin can see
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to view these orders" });
    }

    const orders = await Order.find({ customer: userId })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /orders/track/:orderId
export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate(
      "items.product",
      "name image"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only customer or admin
    if (
      req.user.role !== "admin" &&
      order.customer.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not allowed to track this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Track order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};