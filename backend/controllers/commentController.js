import commentModel from "../models/commentModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";


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
        const { commentId, replyText } = req.body;
        const userId = req.user.id;

        const sender = await userModel.findById(userId);
        if (!sender) return res.json({ success: false, message: "Người dùng không tồn tại" });

        const updatedComment = await commentModel.findByIdAndUpdate(
            commentId,
            {
                $push: {
                    replies: {
                        senderId: userId,
                        senderName: sender.name,
                        senderRole: sender.role,
                        text: replyText,
                        createdAt: new Date(),
                    }
                }
            },
            { new: true }
        );

        res.json({ success: true, message: "Đã gửi phản hồi", data: updatedComment });
    } catch (error) {
        res.json({ success: false, message: "Lỗi Server" });
    }
}

const postComment = async (req, res) => {
    try {
        const userId = req.user.id;

        // Lấy thông tin User để có tên hiển thị
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Không tìm thấy người dùng" });
        }

        const image_filename = req.file ? req.file.filename : "";

        const newComment = new commentModel({
            foodId: req.body.foodId,
            userId: userId,
            userName: user.name, // Lưu tên để hiển thị nhanh
            text: req.body.text,
            rating: req.body.rating,
            image: image_filename
        });

        await newComment.save();
        res.json({ success: true, message: "Bình luận thành công!" });
    } catch (error) {
        console.error("LỖI POST COMMENT:", error);
        res.json({ success: false, message: "Lỗi Server" });
    }
};

const getCommentsByFood = async (req, res) => {
    try {
        const { foodId } = req.params;
        const comments = await commentModel.find({ foodId }).populate("userId", "name");

        res.json({ success: true, data: comments });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Lỗi khi lấy danh sách bình luận" });
    }
};

export {getCommentsByFoodId, getShopComments, addReply, postComment,getCommentsByFood };