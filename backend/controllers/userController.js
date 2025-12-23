import dotenv from 'dotenv';
dotenv.config();
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Tài khoản không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Sai mật khẩu" });
        }

        // ĐẢM BẢO user._id tồn tại
        if (!user._id) {
            return res.json({ success: false, message: "Lỗi dữ liệu user" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "fallback_secret");
        res.json({ success: true,
            token,
            message: "Đăng nhập thành công"
        });
    } catch (error) {
        console.log("Login error:", error);
        res.json({ success: false, message: "Lỗi server: " + error.message });
    }
};

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// register user
const registerUser = async (req, res) => {
    const { ho,name, password, email, role } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Email đã được sử dụng" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Email không hợp lệ" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Mật khẩu phải từ 8 ký tự" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            ho,
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        const user = await newUser.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "fallback_secret");
        res.json({ success: true, token });
    } catch (error) {
        console.log("Register error:", error);
        res.json({ success: false, message: "Lỗi server: " + error.message });
    }
};
const getUserProfile = async (req, res) => {
    try {
        // Lấy userId từ token
        const userId = req.user.id;

        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: "Không tìm thấy người dùng" });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        console.error("Lỗi lấy thông tin cá nhân:", error);
        res.json({ success: false, message: "Lỗi Server" });
    }
};
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        // Chỉ cho phép cập nhật tên và các trường
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                ho: updates.ho,
                name: updates.name,
                phone: updates.phone,
                tinh: updates.tinh,
                phuongXa: updates.phuongXa,
                tenDuong: updates.tenDuong
            },
            { new: true, runValidators: true } //true để trả về document đã cập nhật
        ).select('-password');

        if (!updatedUser) {
            return res.json({ success: false, message: "Cập nhật thất bại" });
        }

        res.json({ success: true, message: "Cập nhật thành công", data: updatedUser });
    } catch (error) {
        console.error("Lỗi cập nhật thông tin:", error);
        res.json({ success: false, message: "Lỗi Server: " + error.message });
    }
};
const changePassword = async (req, res) => {
    try {
        console.log("--- BẮT ĐẦU ĐỔI MẬT KHẨU ---");
        console.log("req.user:", req.user);
        console.log("req.body:", req.body);
        const userId = req.user.id;
        console.log("UserID lấy được:", userId);
        if (!userId) {
            return res.json({ success: false, message: "Lỗi: Không tìm thấy ID từ Token" });
        }
        const { oldPassword, newPassword } = req.body;

        console.log("ID từ token:", userId);

        // 1. Tìm user
        const user = await userModel.findById(userId); // userId lấy từ middleware giải mã token
        if (!user) {
            console.log("-> Tìm trong DB không thấy user này!");
            return res.json({ success: false, message: "User không tồn tại" });
        }

        console.log("-> Tìm thấy user:", user.email);

        // 2. So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.json({ success: false, message: "Mật khẩu cũ không đúng!" });

        // 3. Mã hóa mật khẩu mới và lưu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });

        res.json({ success: true, message: "Đổi mật khẩu thành công!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Lỗi server" });
    }
}
export {loginUser,registerUser, getUserProfile, updateProfile,changePassword}