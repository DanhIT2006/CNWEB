import React, { useEffect, useState, useContext } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

const PlaceOrder = () => {
    const { t } = useTranslation();
    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Nhận phương thức thanh toán và mã giảm giá từ Cart.jsx
    const paymentMethod = location.state?.paymentMethod || "cod";
    const discount = location.state?.discount || 0;

    // State quản lý Modal QR và dữ liệu tạm
    const [showQRModal, setShowQRModal] = useState(false);
    const [tempOrderData, setTempOrderData] = useState(null);

    const [data, setData] = useState({
        ho: "",
        ten: "",
        email: "",
        tinh: "",
        phuongXa: "",
        tenDuong: "",
        phone: ""
    });

    const subTotal = getTotalCartAmount();
    const deliveryFee = subTotal === 0 ? 0 : 20000;
    const finalTotal = subTotal + deliveryFee - discount > 0 ? subTotal + deliveryFee - discount : 0;

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prev => ({ ...prev, [name]: value }));
    };

    // Hàm thực hiện gửi đơn hàng lên Backend
    const sendOrderToBackend = async (orderData) => {
        try {
            const response = await axios.post(url + "/api/order/place", orderData, {
                headers: { token }
            });

            if (response.data.success) {
                // ĐỒNG BỘ: Cập nhật thông tin vào Profile người dùng
                await axios.put(url + "/api/user/profile", {
                    ho: data.ho,
                    name: data.ten,
                    phone: data.phone,
                    tinh: data.tinh,
                    phuongXa: data.phuongXa,
                    tenDuong: data.tenDuong
                }, { headers: { token } });

                setCartItems({}); // Xóa giỏ hàng
                toast.success(t('order_success_msg'));
                setTimeout(() => navigate("/myorders"), 2000);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error(t('toast_connection_error'));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item };
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });

        const fullAddress = `${data.tenDuong}, ${data.phuongXa}, ${data.tinh}`;
        const orderData = {
            address: { ...data, full_address: fullAddress },
            items: orderItems,
            amount: finalTotal,
            discount: discount,
            paymentMethod: paymentMethod
        };

        if (paymentMethod === 'qr') {
            setTempOrderData(orderData);
            setShowQRModal(true); // Hiện Modal quét mã
        } else {
            sendOrderToBackend(orderData); // Thanh toán COD trực tiếp
        }
    };

    const getQRUrl = () => {
        const selectedFoodNames = food_list
            .filter(item => cartItems[item._id] > 0)
            .map(item => item.name)
            .join(", ");

        const BANK_ID = "BIDV";
        const ACCOUNT_NO = "8852316592";
        const ACCOUNT_NAME = "VO THANH DANH"
        const info = `Thanh toan don hang ${selectedFoodNames}`;
        return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-print.png?amount=${finalTotal}&addInfo=${encodeURIComponent(
            info
        )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
    };

    // Tự động load Profile khi vào trang
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!token) return;
            try {
                const response = await axios.get(url + "/api/user/profile", { headers: { token } });
                if (response.data.success) {
                    const u = response.data.data;
                    setData({
                        ho: u.ho || "",
                        ten: u.name || "",
                        email: u.email || "",
                        tinh: u.tinh || "",
                        phuongXa: u.phuongXa || "",
                        tenDuong: u.tenDuong || "",
                        phone: u.phone || ""
                    });
                }
            } catch (err) {
                console.log("Lỗi tải profile:", err);
            }
        };
        fetchUserProfile();
    }, [token, url]);

    return (
        <>
            <form onSubmit={handleSubmit} className="place-order">
                <div className="place-order-left">
                    <p className="title">{t('delivery_info')}</p>
                    <div className="multi-fields">
                        <input required name='ho' onChange={onChangeHandler} value={data.ho} type="text" placeholder={t('last_name')} />
                        <input required name='ten' onChange={onChangeHandler} value={data.ten} type="text" placeholder={t('first_name')} />
                    </div>
                    <div className="multi-fields">
                    <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' />
                    <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder={t('phone_number')} />
                    </div>
                    <div className="multi-fields">
                        <input required name='tinh' onChange={onChangeHandler} value={data.tinh} type="text" placeholder={t('province')} />
                        <input required name='phuongXa' onChange={onChangeHandler} value={data.phuongXa} type="text" placeholder={t('ward')} />
                    </div>
                    <div className="multi-fields">
                    <input required name='tenDuong' onChange={onChangeHandler} value={data.tenDuong} type="text" placeholder={t('street_name')} />
                    </div>
                    </div>

                <div className="place-order-right">
                    <div className="cart-total">
                        <h2>{t('cart_totals')}</h2>
                        <div>
                            <div className="cart-total-details">
                                <p>{t('subtotal')}</p>
                                <p>{subTotal.toLocaleString('vi-VN')}₫</p>
                            </div>
                            <hr />
                            <div className="cart-total-details">
                                <p>{t('delivery_fee')}</p>
                                <p>{deliveryFee.toLocaleString('vi-VN')}₫</p>
                            </div>
                            <hr />
                            {discount > 0 && (
                                <div className="cart-total-details" style={{ color: 'green' }}>
                                    <p>{t('discount')}</p>
                                    <p>- {discount.toLocaleString('vi-VN')}₫</p>
                                </div>
                            )}
                            <div className="cart-total-details">
                                <b>{t('total')}</b>
                                <b>{finalTotal.toLocaleString('vi-VN')}₫</b>
                            </div>
                        </div>
                        <button type='submit'>
                            {paymentMethod === 'qr' ? t('proceed_to_pay') : t('place_order_btn')}
                        </button>
                    </div>
                </div>
            </form>

            {/* Modal hiển thị QR Code */}
            {showQRModal && (
                <div className="qr-modal-overlay">
                    <div className="qr-modal">
                        <h2>{t('scan_to_pay')}</h2>
                        <p>{t('qr_instruction')} <b>{finalTotal.toLocaleString()}₫</b></p>
                        <img src={getQRUrl()} alt="VietQR" className="qr-image" />
                        <div className="qr-btns">
                            <button className="cancel-btn" onClick={() => setShowQRModal(false)}>{t('cancel')}</button>
                            <button className="confirm-btn" onClick={() => {
                                sendOrderToBackend(tempOrderData);
                                setShowQRModal(false);
                            }}>
                                {t('i_have_paid')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PlaceOrder;