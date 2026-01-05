import dotenv from 'dotenv';
dotenv.config();
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import shopModel from "../models/shopModel.js";

// 1. Tạo Token
const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "fallback_secret");
}

// 2. Đăng nhập
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "Tài khoản không tồn tại" });

        if (user.status === 'blocked') {
            return res.json({ success: false, message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Sai mật khẩu" });

        // KIỂM TRA TRẠNG THÁI PHÊ DUYỆT
        if (user.role === 'shop_owner' && user.status !== 'approved') {
            const msg = user.status === 'pending'
                ? "Tài khoản đang chờ Admin phê duyệt. Vui lòng quay lại sau."
                : "Tài khoản của bạn đã bị từ chối truy cập.";
            return res.json({ success: false, message: msg });
        }

        const token = createToken(user._id, user.role);
        // lay id shop
        let shopId = "";
        if (user.role === 'shop_owner') {
            const shop = await shopModel.findOne({ userId: user._id });
            shopId = shop ? shop._id : "";
        }
        res.json({ success: true, token, shopId, message: "Đăng nhập thành công" });
    } catch (error) {
        res.json({ success: false, message: "Lỗi server: " + error.message });
    }
};

// 3. Đăng ký
const registerUser = async (req, res) => {
    const { ho, name, password, email, role } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "Email đã được sử dụng" });
        if (!validator.isEmail(email)) return res.json({ success: false, message: "Email không hợp lệ" });
        if (password.length < 8) return res.json({ success: false, message: "Mật khẩu phải từ 8 ký tự" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Thiết lập trạng thái
        const status = role === 'shop_owner' ? 'pending' : 'approved';

        const newUser = new userModel({
            ho, name, email,
            password: hashedPassword,
            role: role || 'user',
            status: status
        });

        const user = await newUser.save();

        if (role === 'shop_owner') {
            return res.json({ success: true, message: "Đăng ký thành công! Chờ Admin phê duyệt." });
        }

        const token = createToken(user._id, user.role);
        res.json({ success: true, token });
    } catch (error) {
        res.json({ success: false, message: "Lỗi server: " + error.message });
    }
};

// 4. Lấy thông tin cá nhân
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) return res.json({ success: false, message: "Không tìm thấy người dùng" });
        res.json({ success: true, data: user });
    } catch (error) {
        res.json({ success: false, message: "Lỗi Server" });
    }
};

// 5. Cập nhật Profile
const updateProfile = async (req, res) => {
    try {
        const { ho, name, phone, tinh, phuongXa, tenDuong } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user.id,
            { ho, name, phone, tinh, phuongXa, tenDuong },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) return res.json({ success: false, message: "Cập nhật thất bại" });
        res.json({ success: true, message: "Cập nhật thành công", data: updatedUser });
    } catch (error) {
        res.json({ success: false, message: "Lỗi Server: " + error.message });
    }
};

// 6. Đổi mật khẩu
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await userModel.findById(req.user.id);
        if (!user) return res.json({ success: false, message: "User không tồn tại" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.json({ success: false, message: "Mật khẩu cũ không đúng!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await userModel.findByIdAndUpdate(req.user.id, { password: hashedPassword });

        res.json({ success: true, message: "Đổi mật khẩu thành công!" });
    } catch (error) {
        res.json({ success: false, message: "Lỗi server" });
    }
}

export { loginUser, registerUser, getUserProfile, updateProfile, changePassword };