import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

// GET /admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("items.product", "name price");
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /admin/user/:id
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user._id.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "Admin cannot delete themselves" });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /admin/order/:id
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};