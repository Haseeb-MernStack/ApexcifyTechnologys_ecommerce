import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} from "../controllers/productController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// VENDOR ONLY
router.use(protect, authorizeRoles("vendor", "admin"));

router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/my-products", getMyProducts);

export default router;