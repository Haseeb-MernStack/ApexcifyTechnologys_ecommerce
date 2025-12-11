import Product from "../models/productModel.js";

// VENDOR: POST /vendor/products
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const product = await Product.create({
      vendor: req.user._id,
      name,
      description,
      price,
      stock: stock || 0,
      image: image || "",
      category
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// VENDOR: PUT /vendor/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendor: req.user._id
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or not owned by vendor" });
    }

    const { name, description, price, stock, image, category } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (image !== undefined) product.image = image;
    if (category !== undefined) product.category = category;

    const updatedProduct = await product.save();
    res.json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// VENDOR: DELETE /vendor/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      vendor: req.user._id
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or not owned by vendor" });
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// VENDOR: GET /vendor/my-products
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id });
    res.json(products);
  } catch (error) {
    console.error("Get my products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUBLIC: GET /products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("vendor", "name email");
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUBLIC: GET /products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "vendor",
      "name email"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Get product by id error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUBLIC: GET /products/category/:category
export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};