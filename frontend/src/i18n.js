import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "home": "Home",
            "menu": "Menu",
            "contact": "Contact Us",
            "login": "Login",
            "cart": "Cart",
            "logout": "Logout",
            "orders": "My Orders",
            "profile": "Profile",
            //header
            "title_header": "Order your favorite dishes here",
            "header_desc": "Choose from a diverse menu featuring a range of delicious dishes prepared with the finest ingredients,\n" +
                "satisfy your cravings and enhance your dining experience, every time a delicious meal.",
            "view_menu": "View Menu",
            //Explore menu
            "explore_title": "Explore our menu",
            "explore_desc": "Choose from a diverse menu featuring many delicious dishes.",
            //Thực đơn
            "noodles": "Noodles",
            "rice": "Rice",
            "bread": "Bread",
            "grilled_dishes": "Grilled dishes",
            "hot_pot": "Hot pot",
            "drink": "Drink",
            "snacks": "Snacks",
            "healthy_food" : "Healthy food",
            //food display
            "display_title": "All dishes",
            "search_placeholder" : "Search",
            //food item
            "store" : "Store",
            //footer
            "company": "Company",
            "home_footer": "Home",
            "about_footer": "About us",
            "transport": "Transport",
            "privacy_policy": "Privacy policy",
            "contact_footer": "Contact",
            //cart
            "img": "Image",
            "dish_name" : "Dish name",
            "price" : "Price",
            "quantity" : "Quantity",
            "total" : "Total",
            "delete_dish" : "Delete dish",
            "select_payment_method": "Select Payment Method",
            "cash_on_delivery": "Cash on Delivery",
            "qr_payment": "Online via QR Code",
            // Cart bottom
            "total_cart" : "Total cost of the shopping cart",
            "fee" : "Fee",
            "delivery_fee" : "Delivery fee",
            "discount" : "Discount",
            "total_money" : "Total money",
            "promocode_title": "If you have a discount code, please enter it here",
            "promocode": "Promo code",
            "submit": "Submit",
            "pay": "Pay",
            //Profile
            "profile_title": "Personal Information",
            "role": "Role",
            "basic_info": "Edit Basic Information",
            "name": "Name",
            "update": "Update Information",
            "cancel_password": "Cancel Password Change",
            "change_password": "Change Password",
            "set_password": "Set New Password",
            "old_password": "Old Password",
            "enter_oldpassword": "Enter Current Password",
            "new_password": "New Password",
            "enter_newpassword": "Enter New Password",
            "confirm_newpassword": "Confirm New Password",
            "enter_confirm": "Re-enter New Password",
            "save_password": "Save New Password",
            "shop_owner": "Shops Owner",
            "customer": "Customer",
            //My order
            "myorder_title": "My order",
            "quantity_order": "Quantity",
            "track_order" : "Track order",
            //Shops order
            "shop_orders" : "Shops Orders:",
            "sl_mon": "Quantity",
            "status_processing": "Processing",
            "status_cooking": "Cooking",
            "status_shipping": "Shipping",
            "status_delivered": "Delivered",
            "status_cancelled": "Cancelled",
            "no_order" : "No order",
            //Place Order
            "delivery_info": "Delivery Information",
            "last_name": "Last Name",
            "first_name": "First Name",
            "province": "Province/City",
            "ward": "Ward",
            "street_name": "Street/House Number",
            "phone_number": "Phone Number",
            "cart_totals": "Cart Totals",
            "subtotal": "Subtotal",
            "proceed_to_pay": "Proceed to Pay",
            "place_order_btn": "Place Order",
            "scan_to_pay": "Scan to Pay",
            "qr_instruction": "Please scan the QR code below to complete your order of",
            "cancel": "Cancel",
            "i_have_paid": "I have paid",
            "order_success_msg": "Order placed successfully!",
            "toast_connection_error": "Connection error, please try again"



        }
    },
    vi: {
        translation: {
            "home": "Trang chủ",
            "menu": "Thực đơn",
            "contact": "Liên hệ",
            "login": "Đăng nhập",
            "cart": "Giỏ hàng",
            "logout": "Đăng xuất",
            "orders": "Đơn hàng",
            "profile": "Thông tin cá nhân",
            //header
            "title_header" : "Đặt món ăn yêu thích của bạn tại đây",
            "header_desc" : "Chọn từ thực đơn đa dạng bao gồm một loạt các món ăn ngon được chế biến từ những nguyên liệu tốt nhất,\n" +
                "thỏa mãn cơn thèm ăn và nâng cao trải nghiệm ăn uống của bạn, mỗi lần một bữa ăn ngon.",
            "view_menu": "Xem Menu",
            //Explore menu
            "explore_title": "Khám phá thực đơn của chúng tôi",
            "explore_desc" : "Chọn từ thực đơn đa dạng với nhiều món ăn ngon.",
            //Thực đơn
            "noodles": "Mì",
            "rice": "Cơm",
            "bread": "Bánh mì",
            "grilled_dishes": "Món nướng",
            "hot_pot": "Lẩu",
            "drink": "Đồ uống",
            "snacks": "Ăn vặt",
            "healthy_food" : "Món Healthy",
            //food display
            "display_title": "Tất cả món ăn",
            "search_placeholder" : "Tìm kiếm",
            // food item
            "store" : "Cửa hàng",
            //footer
            "company": "Công ty",
            "home_footer": "Trang chủ",
            "about_footer": "Về chúng tôi",
            "transport": "Vận chuyển",
            "privacy_policy": "Chính sách bảo mật",
            "contact_footer": "Liên hệ",
            //cart
            "img": "Ảnh",
            "dish_name" : "Tên món",
            "price" : "Giá",
            "quantity" : "Số lượng",
            "total" : "Tổng tiền",
            "delete_dish" : "Xóa món",
            "select_payment_method": "Chọn phương thức thanh toán",
            "cash_on_delivery": "Tiền mặt",
            "qr_payment": "Quét mã QR Online",
            // Cart bottom
            "total_cart" : "Tổng chi chí của giỏ hàng",
             //price
            "delivery_fee" : "Phí giao hàng",
            "discount" : "Giảm giá",
            "total_money" : "Tổng tiền",
            "promocode_title": "Nếu bạn có mã giảm giá. Hãy nhập ở đây",
            "promocode": "Mã giám giá",
            "submit": "Áp dụng",
            "pay": "Thanh toán",
            //Profile
            "profile_title": "Thông tin cá nhân",
            "role": "Vai trò",
            "name" : "Tên",
            "basic_info" : "Chỉnh sửa thông tin cơ bản",
            "update" : "Cập nhật thông tin",
            "cancel_password" : "Hủy đổi mật khẩu",
            "change_password" : "Đổi mật khẩu",
            "set_password" : "Thiết lập mật khẩu mới",
            "old_password" : "Mật khẩu cũ",
            "enter_oldpassword" : "Nhập mật khẩu hiện tại",
            "new_password" : "Mật khẩu mới",
            "enter_newpassword" : "Nhập mật khẩu mới",
            "confirm_newpassword" : "Xác nhận mật khẩu mới",
            "enter_confirm" : "Nhập lại mật khẩu mới",
            "save_password" : "Lưu mật khẩu mới",
            "shop_owner": "Chủ cửa hàng",
            "customer": "Khách hàng",
            //My order
            "myorder_title": "Đơn hàng của tôi",
            "quantity_order": "Số lượng:",
            "track_order" : "Theo dõi",
            //Shops order
            "shop_orders" : "Đơn Hàng Của Quán",
            "sl_mon": "Số lượng:",
            "status_processing": "Đang xử lý",
            "status_cooking": "Đang chế biến",
            "status_shipping": "Đang giao hàng",
            "status_delivered": "Đã giao hàng",
            "status_cancelled": "Đã hủy",
            "no_order" : "Chưa có đơn hàng nào.",
            //Place order
            "delivery_info": "Thông tin giao hàng",
            "last_name": "Họ",
            "first_name": "Tên",
            "province": "Tỉnh/Thành phố",
            "ward": "Phường/Xã",
            "street_name": "Tên đường/Số nhà",
            "phone_number": "Số điện thoại",
            "cart_totals": "Tổng giỏ hàng",
            "subtotal": "Tạm tính",
            "proceed_to_pay": "Tiến hành thanh toán",
            "place_order_btn": "Đặt hàng",
            "scan_to_pay": "Quét mã thanh toán",
            "qr_instruction": "Vui lòng quét mã bên dưới để hoàn tất đơn hàng trị giá",
            "cancel": "Hủy",
            "i_have_paid": "Tôi đã chuyển khoản",
            "order_success_msg": "Đặt hàng thành công!",
            "toast_connection_error": "Lỗi kết nối, vui lòng thử lại sau"



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