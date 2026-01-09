import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Liên kết với ID của chủ cửa hàng
        ref: 'users', // Tham chiếu đến userModel
        required: true,
        unique: true
    },
    shopName: {
        type: String,
        required: true,
        default: 'Tên cửa hàng mới'
    },
    address: {
        type: String,
        default: 'Địa chỉ chưa cập nhật'
    },
    phone: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: 'Giới thiệu về cửa hàng của bạn'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const shopModel = mongoose.models.shop || mongoose.model("shop", shopSchema);

export default shopModel;