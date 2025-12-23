import express from "express"
import { loginUser,registerUser, getUserProfile, updateProfile, changePassword } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.post("/change-password", authMiddleware, changePassword);
export default userRouter;