import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            //proflie
            "login": "Login",
            "shop_info": "Shop information",
            "logout": "Logout",
            //Shop order
            "shop_orders" : "Shop Orders",
            "sl_mon": "Quantity",
            "status_processing": "Processing",
            "status_cooking": "Cooking",
            "status_shipping": "Shipping",
            "status_delivered": "Delivered",
            "status_cancelled": "Cancelled",
            "no_order" : "No order",
            //Thực đơn
            "noodles": "Noodles",
            "rice": "Rice",
            "bread": "Bread",
            "grilled_dishes": "Grilled dishes",
            "hot_pot": "Hot pot",
            "drink": "Drink",
            "snacks": "Snacks",
            "healthy_food" : "Healthy food",
            //Sidebar
            "add_dish": "Add dish",
            "list_dish" :"List of dishes",
            "orders": "Orders",
            "sale": "Sales",
            "stats": "Stats",
            //ADD
            "upload_img" : "Upload image",
            "name_dish" : "Name dish",
            "category" : "Category",
            "description_dish" : "Description dish",
            "price_dish" : "Price dish",
            "price": "Price",
            "add": "Add",
            "plc1" : "Type here",
            "plc2": "Write the content here",
            //List
            "ctr": "Category",
            "img" : "Image",
            "name": "Name dish",
            // "catetory"
            // "price"
            "delete":"Delete",
            //Add Coupon
            "add_coupon_title": "Create New Coupon",
            "coupon_code": "Coupon Code",
            "placeholder_coupon_code": "Ex: SALE50",
            "discount_type": "Discount Type",
            "type_percent": "Discount by Percentage (%)",
            "type_fixed": "Discount by Cash (VNĐ)",
            "discount_value": "Discount Value",
            "placeholder_discount_value": "Ex: 20 (20%)",
            "expiry_date": "Expiry Date",
            "apply_to_food": "Apply to Food",
            "no_food_found": "No food items found from your shop.",
            "create_coupon_btn": "Create Coupon",
            "toast_coupon_success": "Coupon created successfully!",
            "toast_coupon_error": "Failed to create coupon.",
            "toast_connection_error": "Connection error, please try again.",
            //Shop Stats
            "business_stats_title": "Business Statistics",
            "total_weekly_revenue": "Total weekly revenue",
            "revenue_last_week": "Revenue last week",
            "revenue_label": "Revenue",
            "order_trend_title": "Order Trends & New Customers",
            "orders_label": "Orders",
            "new_customers_label": "New Customers",
            "monday_short": "Mon",
            "tuesday_short": "Tue",
            "wednesday_short": "Wed",
            "thursday_short": "Thu",
            "friday_short": "Fri",
            "saturday_short": "Sat",
            "sunday_short": "Sun",
            //Shop Profile
            "manage_shop_info_title": "Manage Shop Information",
            "shop_name_label": "Shop Name",
            "placeholder_shop_name": "Enter shop name",
            "shop_address_label": "Shop Address",
            "placeholder_shop_address": "Enter address",
            "shop_phone_label": "Contact Phone Number",
            "placeholder_shop_phone": "Enter phone number",
            "shop_description_label": "About the Shop",
            "placeholder_shop_description": "Brief description of your shop...",
            "update_shop_info_btn": "Update Shop Information",
            "loading_profile": "Loading shop profile...",
            "error_label": "Error",
            "error_no_permission": "You do not have shop management permissions!",
            "error_fetch_profile": "Could not load shop profile",
            "toast_update_profile_success": "Shop information updated successfully!",
            "toast_update_profile_error": "Update failed. Please try again.",


        }
    },
    vi: {
        translation: {
            //proflie
            "login": "Đăng nhập",
            "shop_info": "Thông tin cửa hàng",
            "logout": "Đăng xuất",
            //Shop order
            "shop_orders" : "Đơn Hàng Của Quán",
            "sl_mon": "Số lượng:",
            "status_processing": "Đang xử lý",
            "status_cooking": "Đang chế biến",
            "status_shipping": "Đang giao hàng",
            "status_delivered": "Đã giao hàng",
            "status_cancelled": "Đã hủy",
            "no_order" : "Chưa có đơn hàng nào.",
            //Thực đơn
            "noodles": "Mì",
            "rice": "Cơm",
            "bread": "Bánh mì",
            "grilled_dishes": "Món nướng",
            "hot_pot": "Lẩu",
            "drink": "Đồ uống",
            "snacks": "Ăn vặt",
            "healthy_food" : "Món Healthy",
            //Sidebar
            "add_dish": "Thêm món",
            "list_dish" :"Danh mục món",
            "orders": "Đơn hàng",
            "sale": "Giảm giá",
            "stats": "Thống kê",
            //ADD
            "upload_img" : "Tải ảnh lên",
            "name_dish" : "Tên món",
            "category" : "Thực đơn",
            "description_dish" : "Mô tả món ăn",
            "price_dish" : "Giá món",
            "price": "Giá:",
            "add": "Thêm",
            "plc1" : "Ghi vào đây",
            "plc2": "Viết nội dung vào đây",
            //List
            "ctr": "Danh mục",
            "img" : "Ảnh",
            "name": "Tên món",
            // "catetory"
            // "price"
            "delete":"Xóa",
            //Add Coupon
            "add_coupon_title": "Tạo Mã Giảm Giá Mới",
            "coupon_code": "Mã giảm giá (Code)",
            "placeholder_coupon_code": "VD: SALE50",
            "discount_type": "Loại giảm giá",
            "type_percent": "Giảm theo Phần trăm (%)",
            "type_fixed": "Giảm theo Tiền mặt (VNĐ)",
            "discount_value": "Giá trị giảm",
            "placeholder_discount_value": "VD: 20 (20%)",
            "expiry_date": "Hạn sử dụng",
            "apply_to_food": "Áp dụng cho món ăn",
            "no_food_found": "Không tìm thấy món ăn nào của quán bạn.",
            "create_coupon_btn": "Tạo Mã",
            "toast_coupon_success": "Tạo mã giảm giá thành công!",
            "toast_coupon_error": "Tạo mã không thành công.",
            "toast_connection_error": "Lỗi kết nối, vui lòng thử lại sau.",
            //Shop Stats
            "business_stats_title": "Thống Kê Kinh Doanh",
            "total_weekly_revenue": "Tổng doanh thu tuần",
            "revenue_last_week": "Doanh thu tuần qua",
            "revenue_label": "Doanh Thu",
            "order_trend_title": "Xu hướng đơn hàng & Khách mới",
            "orders_label": "Đơn hàng",
            "new_customers_label": "Khách mới",
            "monday_short": "T2",
            "tuesday_short": "T3",
            "wednesday_short": "T4",
            "thursday_short": "T5",
            "friday_short": "T6",
            "saturday_short": "T7",
            "sunday_short": "CN",
            //Shop Profile
            "manage_shop_info_title": "Quản lý Thông tin Cửa hàng",
            "shop_name_label": "Tên Cửa hàng",
            "placeholder_shop_name": "Nhập tên cửa hàng",
            "shop_address_label": "Địa chỉ Cửa hàng",
            "placeholder_shop_address": "Nhập địa chỉ",
            "shop_phone_label": "Số điện thoại liên hệ",
            "placeholder_shop_phone": "Nhập số điện thoại",
            "shop_description_label": "Mô tả về Cửa hàng",
            "placeholder_shop_description": "Mô tả ngắn về cửa hàng của bạn...",
            "update_shop_info_btn": "Cập nhật Thông tin Cửa hàng",
            "loading_profile": "Đang tải hồ sơ cửa hàng...",
            "error_label": "Lỗi",
            "error_no_permission": "Bạn không có quyền quản trị cửa hàng!",
            "error_fetch_profile": "Không thể tải hồ sơ cửa hàng",
            "toast_update_profile_success": "Cập nhật thông tin cửa hàng thành công!",
            "toast_update_profile_error": "Cập nhật thất bại. Vui lòng thử lại.",






        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "vi",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;