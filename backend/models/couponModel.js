// models/couponModel.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true }, // Tên mã: SALE50, TET2025

    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shop',
        default: null  // Mặc định là null (Admin), nếu Shop tạo thì ghi đè ID vào
    },

    discountType: { type: String, enum: ['percent', 'fixed'], required: true }, // Loại: phần trăm (%) hoặc số tiền cố định (VND)
    discountValue: { type: Number, required: true }, // Giá trị: 10 (nếu là %) hoặc 20000 (nếu là fixed)
    minOrderValue: { type: Number, default: 0 }, // Đơn tối thiểu để dùng mã
    maxDiscountAmount: { type: Number, default: 0 }, // Giảm tối đa (ví dụ giảm 10% nhưng tối đa 50k)
    expiryDate: { type: Date, required: true }, // Hạn sử dụng
    usageLimit: { type: Number, default: 100 }, // Số lượng mã (ví dụ chỉ có 100 mã)
    usedCount: { type: Number, default: 0 }, // Số lần đã dùng
    isActive: { type: Boolean, default: true }, // Trạng thái kích hoạt
    applicableFoods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'food' }],
});

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);

export default couponModel;