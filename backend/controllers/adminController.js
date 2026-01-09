import userModel from "../models/userModel.js";
import shopModel from "../models/shopModel.js";
import { sendStatusEmail } from "../config/emailConfig.js";

// 1. Lấy danh sách tất cả Khách hàng
const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({ role: 'user' }).select("-password");
        res.json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi lấy danh sách khách hàng" });
    }
};

// 2. Lấy danh sách tất cả Cửa hàng
const listShops = async (req, res) => {
    try {
        const shops = await userModel.find({ role: 'shop_owner' }).select("-password");
        res.json({ success: true, data: shops });
    } catch (error) {
        res.json({ success: false, message: "Lỗi lấy danh sách shop" });
    }
};

// 3. Cập nhật trạng thái và gửi mail
const updateShopStatus = async (req, res) => {
    const { userId, status } = req.body;
    try {
        const user = await userModel.findByIdAndUpdate(userId, { status }, { new: true });
        // Gửi email thông báo tự động
        await sendStatusEmail(user.email, user.name, status);
        res.json({ success: true, message: `Đã cập nhật trạng thái: ${status}` });
    } catch (error) {
        res.json({ success: false, message: "Lỗi cập nhật trạng thái" });
    }
};

const updateUserStatus = async (req, res) => {
    const { userId, status } = req.body;
    try {
        // Cập nhật trường status trong userModel
        await userModel.findByIdAndUpdate(userId, { status });
        res.json({ success: true, message: `Trạng thái khách hàng: ${status}` });
    } catch (error) {
        res.json({ success: false, message: "Lỗi khi khóa/mở khóa khách hàng" });
    }
};

// 4. Lấy thống kê cho Dashboard
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments({ role: 'user' });
        const totalShops = await userModel.countDocuments({role: 'shop_owner'});

        const pending = await userModel.countDocuments({
            role: 'shop_owner',
            $or: [{ status: 'pending' }, { status: { $exists: false } }]
        });

        const approved = await userModel.countDocuments({ role: 'shop_owner', status: 'approved' });
        const rejected = await userModel.countDocuments({ role: 'shop_owner', status: 'rejected' });

        const pieData = [
            { name: 'Khách hàng', value: totalUsers },
            { name: 'Cửa hàng', value: totalShops }
        ];

        const barData = [
            { name: 'Chờ duyệt', count: pending },
            { name: 'Đã duyệt', count: approved },
            { name: 'Bị từ chối', count: rejected }
        ];

        res.json({ success: true, pieData, barData, summary: { totalUsers, totalShops } });
    } catch (error) {
        res.json({ success: false, message: "Lỗi lấy thống kê" });
    }
};

export { listUsers, listShops, updateShopStatus, getDashboardStats, updateUserStatus };