import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from "../controllers/userController";
import { protect} from "../middleware/authmiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.use(protect);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
