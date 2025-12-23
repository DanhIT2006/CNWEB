import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"

const placeOrder = async (req, res) => {
    console.log("=== REQUEST /api/order/place ===");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    try {
        const userId = req.user.id;
        if (!userId) {
            console.error("Lỗi xác thực: Không tìm thấy ID trong payload token");
            return res.status(401).json({ success: false, message: "Unauthorized: Không tìm thấy userId trong Token" });
        }

        const newOrder = new orderModel({
            userId: req.user.id,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });

        await newOrder.save();
        console.log("Order saved id:", newOrder._id);

        // Lấy thông tin địa chỉ từ body gửi lên
        const addr = req.body.address;
        await userModel.findByIdAndUpdate(req.body.userId, {
            ho: addr.ho,
            name: addr.ten,
            phone: addr.phone,
            tinh: addr.tinh,
            phuongXa: addr.phuongXa,
            tenDuong: addr.tenDuong
        });

        try {
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            console.log("Cart cleared for user:",userId);
        } catch (uerr) {
            console.error("Xóa cart thất bại:", uerr);
        }

        return res.status(201).json({ success: true, message: "Đặt hàng thành công!", orderId: newOrder._id });

    } catch (error) {
        console.error("LỖI KHI LƯU ORDER (stack):", error);
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
}



// verify order
const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            return res.json({ success: true, message: "Paid" });
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            return res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}


// user orders for khach hang
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId: req.user.id});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


// admin: list all orders
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        return res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}


// update order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status});
        res.json({success: true, message: "Đã cập nhật trạng thái!"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Lỗi cập nhật"});
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus }
