import express from "express";
import { verifyCoupon } from "../controllers/couponController.js";

const couponRouter = express.Router();

// Route này dành cho Khách hàng check mã
couponRouter.post("/verify", verifyCoupon);

export default couponRouter;