import mongoose, { Schema, Document } from "mongoose";

// Product Interface
export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
  customAttributes?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Product Schema
const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }], // Array of image URLs
    customAttributes: { type: Schema.Types.Mixed, default: {} }, // Flexible custom fields
  },
  { timestamps: true } // Auto-add createdAt and updatedAt
);

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
