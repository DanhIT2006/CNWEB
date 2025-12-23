import commentModel from "../models/commentModel.js";
import userModel from "../models/userModel.js";

// @route   POST /api/comment/add
// @desc    Thêm bình luận mới (Cần token để lấy userId)
const addComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { foodId, text, rating } = req.body;

        // 1. Tìm tên người dùng
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Không tìm thấy người dùng" });
        }

        // 2. Tạo đối tượng bình luận
        const newComment = new commentModel({
            foodId: foodId,
            userId: userId,
            userName: user.name,
            text: text,
            rating: rating || 5
        });

        // 3. Lưu vào DB
        await newComment.save();
        res.json({ success: true, message: "Thêm bình luận thành công" });

    } catch (error) {
        console.error("LỖI ADD COMMENT:", error);
        res.json({ success: false, message: "Lỗi Server" });
    }
}

// @route   GET /api/comment/get/:foodId
// @desc    Lấy tất cả bình luận cho một món ăn cụ thể
const getCommentsByFoodId = async (req, res) => {
    try {
        const { foodId } = req.params;

        // 1. Tìm và sắp xếp theo thời gian mới nhất
        const comments = await commentModel.find({ foodId: foodId }).sort({ createdAt: -1 });

        res.json({ success: true, data: comments });

    } catch (error) {
        console.error("LỖI GET COMMENTS:", error);
        res.json({ success: false, message: "Lỗi Server" });
    }
}

export { addComment, getCommentsByFoodId };