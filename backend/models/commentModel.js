import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId, // Liên kết với ID món ăn
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Kiểm tra xem model 'comment' đã tồn tại chưa
const commentModel = mongoose.models.comment || mongoose.model("comment", commentSchema);

export default commentModel;