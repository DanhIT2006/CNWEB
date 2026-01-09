import React, { useContext, useState, useEffect } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice'
import axios from 'axios'
import {toast} from 'react-toastify'
import { useTranslation } from 'react-i18next';
import {assets} from "../../assets/assets.js";


const Cart = () => {

    const getCoordinates = async (address) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            if (response.data.length > 0) {
                return {
                    lat: parseFloat(response.data[0].lat),
                    lng: parseFloat(response.data[0].lon)
                };
            }
        } catch (error) {
            console.error("Lỗi lấy tọa độ:", error);
        }
        return null;
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // bán kính của trái
        // đổi độ sang Radiant
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        //Công thức Harversine
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        // tính góc ở tâm giữa hai điểm
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url, token,userData } = useContext(StoreContext)

    const [deliveryFee, setDeliveryFee] = useState(20000);
    const [distance, setDistance] = useState(0);
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cod");

    const updateShippingFee = async () => {
        if (getTotalCartAmount() === 0) {
            setDeliveryFee(0);
            setDistance(0);
            return;
        }

        // Tìm shop trong giỏ hàng
        const currentItem = food_list.find(item => cartItems[item._id] > 0);
        const shopAddress = currentItem?.shopId?.address;

        let userAddress = "";
        if (userData && userData.tenDuong) {
            userAddress = `${userData.tenDuong}, ${userData.phuongXa}, ${userData.tinh}, Việt Nam`;
        } else {
            console.log("Đang đợi dữ liệu người dùng...");
            return;
        }

        console.log("--- DEBUG ĐỊA CHỈ ---");
        console.log("Shop gửi đi:", shopAddress);
        console.log("Khách gửi đi:", userAddress);

        if (shopAddress && userAddress) {
            const shopCoords = await getCoordinates(shopAddress);
            const userCoords = await getCoordinates(userAddress);

            if (shopCoords && userCoords) {
                console.log("Tọa độ Shop:", shopCoords);
                console.log("Tọa độ Khách:", userCoords);
                const d = calculateDistance(shopCoords.lat, shopCoords.lng, userCoords.lat, userCoords.lng);
                setDistance(d);

                // Quy tắc: 5.000đ/km, tối thiểu 15.000đ
                const fee = Math.max(15000, Math.round(d * 5000));
                setDeliveryFee(fee);
            }
        }
    };

    useEffect(() => {
        updateShippingFee();
    }, [cartItems, userData]);

    const subTotal = getTotalCartAmount();
    const finalTotal = subTotal + deliveryFee - discount;


    const navigate = useNavigate();

    const { t } = useTranslation();

    const handleApplyPromo = async () => {
        let currentShopId = null;
        for (const item of food_list) {
            if (cartItems[item._id] > 0) {
                console.log("Món ăn:", item.name);
                console.log("Dữ liệu Shops của món:", item.shopId);

                if (item.shopId) {
                    // Logic an toàn: Nếu shopId là object thì lấy ._id, nếu là chuỗi thì lấy luôn
                    currentShopId = typeof item.shopId === 'object' ? item.shopId._id : item.shopId;
                }
                break;
            }
        }
        console.log("ID Quán gửi đi check:", currentShopId);
        if (!promoCode) return;
        try {
            // Gửi mã và tổng tiền hiện tại lên server check
            const response = await axios.post(url + "/api/coupon/verify", {
                code: promoCode,
                cartAmount: getTotalCartAmount(),
                shopIdOfCart: currentShopId
            },
                {headers: {token}}
                );

            if (response.data.success) {
                setDiscount(response.data.discountAmount);
                toast.success(response.data.message);
            } else {
                setDiscount(0); // Reset nếu mã sai
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi kiểm tra mã");
        }
    }

    return (
        <div className='cart'>
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>{t('img')}</p>
                    <p>{t('dish_name')}</p>
                    <p>{t('price')}</p>
                    <p>{t('quantity')}</p>
                    <p>{t('total')}</p>
                    <p>{t('delete_dish')}</p>
                </div>
                <br />
                <hr />
                {food_list.map((item) => {
                    if (cartItems[item._id] > 0) {
                        return (
                            <div key={item._id}>
                                <div className='cart-items-title cart-items-item'>
                                    <img src={url+"/images/"+item.image} alt="" />
                                    <p>{item.name}</p>

                                    <p>{formatPrice(item.price)}</p>
                                    <div className='quantity-control'>
                                        <button onClick={()=>removeFromCart(item._id)}  style={{color: "red", cursor: "pointer"}}>-</button>
                                        <p>{cartItems[item._id]}</p>
                                        <button onClick={()=>addToCart(item._id)}  style={{color: "green", cursor: "pointer"}} >+</button>
                                    </div>

                                    <p>{formatPrice(item.price * cartItems[item._id])}</p>

                                    <p onClick={()=>removeFromCart(item._id)} className='cross' style={{color: "red", cursor: "pointer"}}>X</p>
                                </div>
                                <hr />
                            </div>
                        )
                    }
                })}
            </div>
            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>{t('total_cart')}</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>{t('price')}</p>
                            <p>{formatPrice(getTotalCartAmount())}</p>
                        </div>
                        <hr/>
                        <div className="cart-total-details">
                            <p>{t('delivery_fee')} ({distance.toFixed(1)} km)</p>
                            <p>{formatPrice(deliveryFee)}</p>
                        </div>
                        <hr/>
                        {/* HIỂN THỊ GIẢM GIÁ NẾU CÓ */}
                        {discount > 0 && (
                            <>
                                <div className="cart-total-details" style={{color: 'green'}}>
                                    <p>{t('discount')}</p>
                                    <p>- {formatPrice(discount)}</p>
                                </div>
                                <hr/>
                            </>
                        )}
                        <div className="cart-total-details">
                            <b>{t('total_money')}</b>
                            <b>{formatPrice(finalTotal)}</b>
                        </div>
                    </div>

                    {/*chọn phương thức*/}
                    <div className="payment-method-selection">
                        <p className='promocodep'>{t('select_payment_method')}</p>
                        <div className="payment-options">
                            <div
                                className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('cod')}
                            >
                                <img src={assets.cash_icon} alt="" />
                                <span>{t('cash_on_delivery')}</span>
                            </div>
                            <div
                                className={`payment-option ${paymentMethod === 'qr' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('qr')}
                            >
                                <img src={assets.qr_icon} alt="" />
                                <span>{t('qr_payment')}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (getTotalCartAmount() === 0) {
                                toast.error("Vui lòng thêm món ăn vào giỏ hàng trước khi thanh toán!");
                            } else {
                                navigate('/order', { state: { discount: discount, paymentMethod: paymentMethod } });
                            }
                        }}
                    >
                        {t('pay')}
                    </button>
                </div>
                <div className="cart-promocode">
                    <div>
                        <p className='promocodep'>{t('promocode_title')}</p>
                        <div className='cart-promocode-input'>
                            <input
                                type="text"
                                placeholder={t('promocode')}
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                            />
                            <button onClick={handleApplyPromo}>{t('submit')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart