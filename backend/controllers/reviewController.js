import Product from "../models/productModel.js";

// POST /products/:id/review
export const addProductReview = async (req, res) => {
  try {
    const { comment, stars } = req.body;
    const productId = req.params.id;

    if (!comment || !stars) {
      return res.status(400).json({ message: "Comment and stars are required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    product.reviews.push({
      user: req.user._id,
      comment,
      stars
    });

    // Recalculate rating
    const totalStars = product.reviews.reduce((sum, r) => sum + r.stars, 0);
    product.rating = totalStars / product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added", reviews: product.reviews });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};