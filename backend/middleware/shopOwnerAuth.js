import jwt from "jsonwebtoken";

const shopOwnerAuthMiddleware = async (req, res, next) => {
    // 1. Lấy token
    const token = req.header("token") ||
        req.headers["token"] ||
        req.headers.authorization?.split(" ")[1] ||
        req.body.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "Yêu cầu đăng nhập (Không có token)" });
    }

    try {
        // 2. Giải mã token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // req.user = { id: ..., role: 'shop_owner' }

        // 3. KIỂM TRA ROLE
        if (req.user.role !== 'shop_owner') {
            return res.status(403).json({ success: false, message: "Bạn không có quyền quản lý cửa hàng" });
        }

        next(); // Nếu là shop_owner, cho phép tiếp tục

    } catch (error) {
        console.error("LỖI XÁC THỰC SHOP OWNER:", error.message);
        return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc hết hạn" });
    }
};

export default shopOwnerAuthMiddleware;