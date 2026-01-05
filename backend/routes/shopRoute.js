import express from "express";
import shopOwnerAuthMiddleware from "../middleware/shopOwnerAuth.js";
import multer from "multer";

import { addFood, listShopFood, removeFood } from "../controllers/foodController.js";
import { createShopCoupon } from "../controllers/couponController.js";
import { listOrders, updateStatus } from "../controllers/orderController.js";
import {getOrCreateShopProfile, updateShopProfile} from "../controllers/shopController.js";

const shopRouter = express.Router();

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})
const upload = multer({storage:storage})

// Quản lý món ăn
shopRouter.post("/add", shopOwnerAuthMiddleware, upload.single("image"), addFood);
shopRouter.post("/remove", shopOwnerAuthMiddleware, removeFood);
shopRouter.get("/list",shopOwnerAuthMiddleware, listShopFood);

// Quản lý đơn hàng (Đơn hàng chi tiết cho Shops)
shopRouter.get("/orders/list", shopOwnerAuthMiddleware, listOrders);
shopRouter.post("/orders/status", shopOwnerAuthMiddleware, updateStatus);

// lấy/tạo hồ sơ
shopRouter.get("/profile", shopOwnerAuthMiddleware, getOrCreateShopProfile);
// Cập nhật hồ sơ
shopRouter.put("/profile", shopOwnerAuthMiddleware, updateShopProfile);

shopRouter.post("/coupon/add", shopOwnerAuthMiddleware, createShopCoupon);

export default shopRouter;