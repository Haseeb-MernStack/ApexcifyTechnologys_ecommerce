import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;