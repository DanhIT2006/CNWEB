import commentModel from "../models/commentModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

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

const getShopComments = async (req, res) => {
    try {
        const { shopId } = req.params;
        console.log("Đang tìm bình luận cho Shop ID:", shopId);
        // 1. Tìm tất cả món ăn của shop
        const foods = await foodModel.find({ shopId });
        console.log("Danh sách món ăn tìm thấy:", foods.length);
        const foodIds = foods.map(food => food._id);

        // 2. Lấy bình luận thuộc danh sách món ăn đó
        const comments = await commentModel.find({ foodId: { $in: foodIds } })
            .populate('userId', 'name ho')
            .populate('foodId', 'name image')
            .sort({ createdAt: -1 });
        console.log("Số lượng bình luận tìm thấy:", comments.length);

        res.json({ success: true, data: comments });
    } catch (error) {
        res.json({ success: false, message: "Lỗi lấy dữ liệu" });
    }
};
const addReply = async (req, res) => {
    try {
        const {commentId, replyText} = req.body;
        const updatedComment = await commentModel.findByIdAndUpdate(
            commentId,
            {
                reply: {
                    text: replyText,
                    createdAt: new Date(),
                }
            },
            { new: true }
        );
        if (!updatedComment) {
            return res.json({success: false, message: "Không tìm thấy bình luận"});
        }
        res.json({success: true, message: "Phản hồi thành công", data: updatedComment});
    } catch (error) {
        res.json({success: false, message: "Lỗi Server" });
    }
}

export { addComment, getCommentsByFoodId, getShopComments, addReply };