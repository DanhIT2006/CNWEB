import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    const { token } = req.headers; // Lấy token từ header gửi lên
    if (!token) {
        return res.json({ success: false, message: "Không có quyền truy cập, hãy đăng nhập lại" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Kiểm tra xem role trong token có phải admin không
        if (token_decode.role !== 'admin') {
            return res.json({ success: false, message: "Bạn không phải Admin! Truy cập bị từ chối." });
        }

        next(); // Nếu đúng là admin thì cho phép tiếp tục
    } catch (error) {
        res.json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

export default adminAuth;