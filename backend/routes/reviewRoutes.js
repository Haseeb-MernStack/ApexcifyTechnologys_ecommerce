import express from "express";
import { addProductReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authenticated customers/vendors/admin can review
router.post("/:id/review", protect, addProductReview);

export default router;