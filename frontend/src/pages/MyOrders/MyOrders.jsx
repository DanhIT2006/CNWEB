import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';



    const MyOrders = () => {
        const navigate = useNavigate();
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

        const { t } = useTranslation();

        // Map từ dữ liệu DB -> Key trong i18n
        const statusMap = {
            "Đang xử lý": "status_processing",
            "Đang chế biến": "status_cooking",
            "Đang giao hàng": "status_shipping",
            "Đã giao hàng": "status_delivered",
            "Đã hủy": "status_cancelled"
        };

        const fetchOrders = async () => {
        if (!token) return;
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, {
                headers: { token }
            });

            console.log("Response MyOrders:", response.data); // ← THÊM LOG ĐỂ XEM CÓ DATA KHÔNG

            if (response.data.success) {
                setData(response.data.data);
            } else {
                console.log("Lỗi MyOrders:", response.data.message);
            }
        } catch (err) {
            console.error("Lỗi fetch orders:", err);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    if (data.length === 0) {
        return (
            <div className='my-orders'>
                <h2 className='myordersp'>Đơn hàng của tôi</h2>
                <div className="container" style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                    <p>Chưa có đơn hàng nào</p>
                </div>
            </div>
        )
    }

    return (
        <div className='my-orders'>
            <h2 className='myordersp'>{t('myorder_title')}</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt="" />
                        <p>
                            {order.items.map((item, idx) => {
                                if (idx === order.items.length - 1) {
                                    return item.name + " x " + item.quantity;
                                } else {
                                    return item.name + " x " + item.quantity + ", ";
                                }
                            })}
                        </p>
                        <p>{order.amount.toLocaleString('vi-VN')}₫</p>
                        <p>{t('quantity_order')} {order.items.length}</p>
                        <p><span>&#x25cf;</span> <b>{t(statusMap[order.status] || order.status)}</b></p>                        <button onClick={() => navigate(`/track-order/${order._id}`)}>
                        {t('track_order')}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyOrders