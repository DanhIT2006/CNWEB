import React, { useEffect, useState, useContext } from 'react'
import './Orders.css'
import { toast } from "react-toastify"
import axios from "axios"
import { assets } from "../../assets/assets"
import { StoreContext } from '../../context/StoreContext';
import { useTranslation } from 'react-i18next';


const Orders = () => {
  const { url, token } = useContext(StoreContext); // Lấy thêm token
  const [orders, setOrders] = useState([]);

  const { t } = useTranslation();


  //Lấy ID Shops mình & Lấy danh sách đơn hàng rồi lọc
  const fetchAndFilterOrders = async () => {
    if (!token) return;

    try {
      // 1. Lấy thông tin Shops hiện tại
      const shopRes = await axios.get(url + "/api/shop/profile", { headers: { token } });
      if (!shopRes.data.success) return;

      const myShopId = shopRes.data.data._id; // ID của quán mình

      // 2. Lấy danh sách tất cả đơn hàng
      const orderRes = await axios.get(url + "/api/order/list");

      if (orderRes.data.success) {
        const allOrders = orderRes.data.data;

        // 3. LOGIC LỌC: Chỉ giữ lại đơn hàng nào có chứa món ăn của Shops mình
        const myOrders = allOrders.filter(order => {
          // Kiểm tra xem trong đơn hàng này, có món nào thuộc shop mình không
          const isMyOrder = order.items.some(item => {
            // Xử lý shopId
            const itemShopId = item.shopId && (typeof item.shopId === 'object' ? item.shopId._id : item.shopId);
            return itemShopId === myShopId;
          });
          return isMyOrder;
        });

        // 4. Lưu danh sách đã lọc vào state
        setOrders(myOrders.reverse());
      } else {
        toast.error("Lỗi tải danh sách đơn hàng");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối");
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value
      })
      if (response.data.success) {
        await fetchAndFilterOrders(); // Gọi lại hàm lọc sau khi cập nhật
        toast.success("Cập nhật trạng thái thành công!");
      }
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    }
  }

  useEffect(() => {
    if (token) {
      fetchAndFilterOrders();
    }
  }, [token])

  return (
      <div className='order add'>
        <h3>{t('shop_orders')}</h3>
        <div className="order-list">
          {orders.length > 0 ? (
              orders.map((order, index) => (
                  <div key={index} className='order-item'>
                    <img src={assets.parcel_icon} alt="" />
                    <div>
                      <p className='order-item-food'>
                        {order.items.map((item, idx) => {
                          if (idx === order.items.length - 1) {
                            return item.name + " x " + item.quantity
                          } else {
                            return item.name + " x " + item.quantity + ", "
                          }
                        })}
                      </p>
                      <p className='order-item-name'>{order.address.ho + " " + order.address.ten}</p>
                      <div className="order-item-address">
                        <p>{order.address.tenDuong + ", " + order.address.phuongXa}</p>
                        <p>{order.address.tinh + ", " + order.address.phone}</p>
                      </div>
                    </div>
                    <p>{t('sl_mon')} {order.items.length}</p>
                    <p>{order.amount.toLocaleString('vi-VN')}₫</p>

                    <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                      <option value="Đang xử lý">{t('status_processing')}</option>
                      <option value="Đang chế biến">{t('status_cooking')}</option>
                      <option value="Đang giao hàng">{t('status_shipping')}</option>
                      <option value="Đã giao hàng">{t('status_delivered')}</option>
                      <option value="Đã hủy">{t('status_cancelled')}</option>
                    </select>
                  </div>
              ))
          ) : (
              <p>{t('no_order')}</p>
          )}
        </div>
      </div>
  )
}

export default Orders