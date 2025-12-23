import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const token = req.header("token") ||
        req.headers["token"] ||
        req.headers.authorization?.split(" ")[1] ||
        req.body.token;
    if (!token) {
        return res.json({ success: false, message: "Không có token" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        console.error("LỖI XÁC THỰC TOKEN:", error.message);
        return res.json({ success: false, message: "Token sai hoặc hết hạn" });
    }
};

export default authMiddleware;