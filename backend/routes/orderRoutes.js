import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getOrdersByUser,
  trackOrder
} from "../controllers/orderController.js";

const router = express.Router();

// All routes require login
router.use(protect);

// POST /orders
router.post("/", createOrder);

// GET /orders/:userId
router.get("/:userId", getOrdersByUser);

// GET /orders/track/:orderId
router.get("/track/:orderId", trackOrder);

export default router;