import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getAllOrders,
  deleteUser,
  deleteOrder
} from "../controllers/adminController.js";

const router = express.Router();

// ADMIN ONLY
router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.get("/orders", getAllOrders);
router.delete("/user/:id", deleteUser);
router.delete("/order/:id", deleteOrder);

export default router;