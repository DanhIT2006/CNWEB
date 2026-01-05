import express from "express";
import { listShops, updateShopStatus, listUsers, getDashboardStats, updateUserStatus } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";


const adminRouter = express.Router();

// Sử dụng adminAuth để bảo vệ các đường dẫn này
adminRouter.get("/list-shops", adminAuth, listShops);
adminRouter.post("/status", adminAuth, updateShopStatus);
adminRouter.get("/list-users", adminAuth, listUsers);
adminRouter.get("/stats", adminAuth, getDashboardStats);
adminRouter.post("/user-status", adminAuth, updateUserStatus);

export default adminRouter;