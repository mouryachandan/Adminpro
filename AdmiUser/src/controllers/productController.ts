import { Request, Response } from "express";
import Product from "../models/product";
import uploadMultipleImagesOnCloudinary from "../config/cloudinary"; 

// Create Product with Multiple Image Uploads
export const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description, price, category, stock, customAttributes } = req.body;
    const imageFiles = req.files as Express.Multer.File[]; // Multer uploaded files

    // Upload images to Cloudinary
    let imageUrls: string[] = [];
    if (imageFiles && imageFiles.length > 0) {
      const uploadResults = await uploadMultipleImagesOnCloudinary(imageFiles.map(file => file.path));
      if (Array.isArray(uploadResults)) {
        imageUrls = uploadResults
          .filter(result => "secure_url" in result) // Filter successful uploads
          .map(result => (result as any).secure_url); // Extract URLs
      }
    }

    // Create product with uploaded images
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images: imageUrls,
      customAttributes,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product with Multiple Image Uploads
export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description, price, category, stock, customAttributes } = req.body;
    const imageFiles = req.files as Express.Multer.File[];

    // Find existing product
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ message: "Product not found" });

    let imageUrls = existingProduct.images; // Preserve old images if no new ones are uploaded

    if (imageFiles && imageFiles.length > 0) {
      const uploadResults = await uploadMultipleImagesOnCloudinary(imageFiles.map(file => file.path));
      let newImageUrls: string[] = [];
      if (Array.isArray(uploadResults)) {
        newImageUrls = uploadResults
          .filter(result => "secure_url" in result)
          .map(result => (result as any).secure_url);
      }

      imageUrls = [...imageUrls, ...newImageUrls]; // Append new images to existing ones
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        stock,
        images: imageUrls,
        customAttributes,
      },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Products
export const getAllProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Product by ID
export const getProductById = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
