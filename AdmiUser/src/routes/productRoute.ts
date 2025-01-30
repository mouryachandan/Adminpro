import express from "express";
import { upload } from "../middleware/uploadmiddleware"; 
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = express.Router();
import { adminOnly,protect } from "../middleware/authmiddleware";
router.use(protect);
// this is accessible by everyone
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// only admin can access
router.use(adminOnly);
router.post("/create", upload.array("images", 5), createProduct); 
router.put("/update/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
