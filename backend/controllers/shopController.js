import shopModel from "../models/shopModel.js";
import userModel from "../models/userModel.js";

// Lấy hoặc tạo hồ sơ cửa hàng
const getOrCreateShopProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Tìm hồ sơ cửa hàng đã tồn tại
        let shopProfile = await shopModel.findOne({ userId });

        if (!shopProfile) {

            const user = await userModel.findById(userId);

            shopProfile = new shopModel({
                userId,
                shopName: user ? `${user.ho} ${user.name}` : "Tên cửa hàng mới",
            });
            await shopProfile.save();
            return res.json({ success: true, message: "Tạo hồ sơ mới thành công", data: shopProfile });
        }

        // 3. Nếu đã có, trả về hồ sơ
        res.json({ success: true, data: shopProfile });

    } catch (error) {
        console.error("LỖI LẤY/TẠO HỒ SƠ SHOP:", error);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};

const updateShopProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        // Cập nhật thông tin cửa hàng dựa trên userId
        const updatedShop = await shopModel.findOneAndUpdate(
            { userId },
            { $set: updates }, // Cập nhật tất cả các trường được gửi trong body
            { new: true, runValidators: true } // Trả về document đã cập nhật
        );

        if (!updatedShop) {
            return res.json({ success: false, message: "Không tìm thấy hồ sơ cửa hàng để cập nhật" });
        }

        res.json({ success: true, message: "Cập nhật thành công", data: updatedShop });

    } catch (error) {
        console.error("LỖI CẬP NHẬT HỒ SƠ SHOP:", error);
        res.status(500).json({ success: false, message: "Lỗi Server: " + error.message });
    }
};

export { getOrCreateShopProfile, updateShopProfile };