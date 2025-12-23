import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {type:String, required:true},
    description: {type:String, required:true},
    price: {type:Number, required:true},
    image: {type:String, required:true},
    category: {type:String, required:true},

    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    // THÊM TRƯỜNG NÀY: Để biết món này thuộc Shop nào
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shop', // Tham chiếu đến shopModel
        required: true
    }
});

const foodModel = mongoose.models.foods || mongoose.model("foods", foodSchema);

export default foodModel;