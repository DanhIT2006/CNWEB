import foodModel from '../models/foodModel.js'
import shopModel from '../models/shopModel.js'
import fs from 'fs'

// add food item
const addFood = async (req, res) => {
    try {
        let image_filename = `${req.file.filename}`;
        const userId = req.user.id; // Lấy ID User từ token

        // 1. TÌM SHOP CỦA USER NÀY TRƯỚC
        const shop = await shopModel.findOne({ userId: userId });

        // Nếu user này chưa tạo hồ sơ cửa hàng thì không cho đăng món
        if (!shop) {
            return res.json({ success: false, message: "Bạn cần tạo hồ sơ Cửa hàng trước khi thêm món!" });
        }

        // 2. TẠO MÓN ĂN VỚI SHOP ID
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
            ownerID: userId,    // ID người dùng (để phân quyền)
            shopId: shop._id    // ID cửa hàng (để hiển thị quán) <--- QUAN TRỌNG
        });

        await food.save();
        res.json({ success: true, message: "Thêm món thành công" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error: " + error.message })
    }
}

// Lấy danh sách món ăn CỦA CỬA HÀNG ĐÓ
const listShopFood = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Tìm Shop của user đang đăng nhập
        const shop = await shopModel.findOne({ userId: userId });

        if (!shop) {
            return res.json({ success: false, message: "Chưa tìm thấy cửa hàng" });
        }

        // 2. Lọc món ăn theo shopId
        const foods = await foodModel.find({ shopId: shop._id });

        res.json({ success: true, data: foods });
    } catch (error) {
        console.error("Lỗi lấy danh sách món:", error);
        res.json({ success: false, message: "Lỗi Server" });
    }
};

// all food list
const listFood = async (req,res) => {
    try {
        const foods = await foodModel.find({}).populate("shopId");
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// remove food item
const removeFood = async (req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


export {addFood,listFood,removeFood,listShopFood};