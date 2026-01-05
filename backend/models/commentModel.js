import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId, // Liên kết với ID món ăn
        ref: "foods",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
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
    rating: { type: Number, required: true, min: 1, max: 5 },
    reply: {
        text: { type: String, default: '' },
        created_at: { type: Date},
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Kiểm tra xem model 'comment' đã tồn tại chưa
const commentModel = mongoose.models.comment || mongoose.model("comment", commentSchema);

export default commentModel;