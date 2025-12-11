import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON body
app.use(morgan("dev"));

// Simple test route
app.get("/", (req, res) => {
    res.json({ message: "ApexcifyTechnologys Ecommerce API is running..." });
});

// API route placeholders (we’ll implement these in next steps)
app.use("/api/auth", authRoutes);

// Public product + review routes
app.use("/api/products", productRoutes);
app.use("/api/products", reviewRoutes); // /:id/review

// Orders
app.use("/api/orders", orderRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// Vendor
app.use("/api/vendor", vendorRoutes);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});