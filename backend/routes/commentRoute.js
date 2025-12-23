import express from "express";
import { addComment, getCommentsByFoodId } from "../controllers/commentController.js";
import authMiddleware from "../middleware/auth.js"; // Giả sử authMiddleware nằm ở middleware/auth.js

const commentRouter = express.Router();

// Route cần đăng nhập (token)
commentRouter.post("/add", authMiddleware, addComment);

// Route không cần đăng nhập
commentRouter.get("/get/:foodId", getCommentsByFoodId);

export default commentRouter;