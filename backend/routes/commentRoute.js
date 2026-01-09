import express from "express";
import { getCommentsByFoodId,getShopComments, addReply, postComment,getCommentsByFood } from "../controllers/commentController.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const commentRouter = express.Router();

commentRouter.get("/get/:foodId", getCommentsByFoodId);

commentRouter.get("/shop/:shopId", getShopComments);

commentRouter.post("/reply", authMiddleware, addReply);

commentRouter.post("/add", authMiddleware, upload.single('image'), postComment);

commentRouter.get("/list/:foodId", getCommentsByFood);


export default commentRouter;