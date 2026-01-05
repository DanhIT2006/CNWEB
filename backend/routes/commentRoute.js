import express from "express";
import { addComment, getCommentsByFoodId,getShopComments, addReply } from "../controllers/commentController.js";
import authMiddleware from "../middleware/auth.js";

const commentRouter = express.Router();

// Route cần đăng nhập (token)
commentRouter.post("/add", authMiddleware, addComment);

// Route không cần đăng nhập
commentRouter.get("/get/:foodId", getCommentsByFoodId);

commentRouter.get("/shop/:shopId", getShopComments);

commentRouter.post("/reply", authMiddleware, addReply);

export default commentRouter;