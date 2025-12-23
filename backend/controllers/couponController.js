import couponModel from "../models/couponModel.js";
import shopModel from "../models/shopModel.js";

const createShopCoupon = async (req, res) => {
    try {
        const userId = req.user.id;
        const shop = await shopModel.findOne({ userId });

        if (!shop) {
            return res.json({ success: false, message: "Bạn chưa có cửa hàng!" });
        }

        const { code, discountType, discountValue, minOrderValue, expiryDate, usageLimit, applicableFoods } = req.body;

        const exists = await couponModel.findOne({ code: code.toUpperCase(), shopId: shop._id });
        if (exists) {
            return res.json({ success: false, message: "Mã này bạn đã tạo rồi!" });
        }

        const newCoupon = new couponModel({
            code: code.toUpperCase(),
            shopId: shop._id,
            discountType,
            discountValue,
            minOrderValue,
            expiryDate,
            usageLimit,
            applicableFoods: applicableFoods || []
        });

        await newCoupon.save();
        res.json({ success: true, message: "Tạo mã giảm giá thành công!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi Server" });
    }
}

// Kiểm tra mã giảm giá
const verifyCoupon = async (req, res) => {
    const { code, cartAmount, shopIdOfCart } = req.body;

    try {
        const coupon = await couponModel.findOne({ code: code.toUpperCase() });

        // 1. Kiểm tra tồn tại
        if (!coupon) {
            return res.json({ success: false, message: "Mã giảm giá không tồn tại!" });
        }

        if (coupon.shopId) {
            // Kiểm tra xem mã này có đúng của cái quán đang mua không
            // shopIdOfCart lấy từ giỏ hàng hiện tại
            if (coupon.shopId.toString() !== shopIdOfCart) {
                return res.json({ success: false, message: "Mã này chỉ áp dụng cho quán khác, không phải quán này!" });
            }
        }

        // 2. Kiểm tra hạn sử dụng
        if (new Date() > coupon.expiryDate) {
            return res.json({ success: false, message: "Mã đã hết hạn!" });
        }

        // 3. Kiểm tra số lượng
        if (coupon.usedCount >= coupon.usageLimit) {
            return res.json({ success: false, message: "Mã đã hết lượt sử dụng!" });
        }


        // 4. Kiểm tra giá trị đơn hàng tối thiểu
        if (cartAmount < coupon.minOrderValue) {
            return res.json({
                success: false,
                message: `Đơn hàng phải từ ${coupon.minOrderValue.toLocaleString()}đ mới được dùng mã này!`
            });
        }

        // 5. Tính toán số tiền được giảm
        let discountAmount = 0;
        if (coupon.discountType === 'fixed') {
            discountAmount = coupon.discountValue;
        } else {
            // Nếu là phần trăm (ví dụ 10%)
            discountAmount = (cartAmount * coupon.discountValue) / 100;
            // Kiểm tra giảm tối đa (nếu có set)
            if (coupon.maxDiscountAmount > 0 && discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount;
            }
        }

        return res.json({
            success: true,
            message: "Áp dụng mã thành công!",
            discountAmount: discountAmount,
            code: coupon.code
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi server" });
    }
};

export { verifyCoupon ,createShopCoupon};