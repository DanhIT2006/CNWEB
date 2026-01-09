import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Shops.css';

const Shops = ({ url, token }) => {
    const [shops, setShops] = useState([]);

    const fetchShops = async () => {
        const res = await axios.get(`${url}/api/admin/list-shops`, { headers: { token } });
        if (res.data.success) setShops(res.data.data);
    };

    const handleAction = async (userId, status) => {
        const res = await axios.post(`${url}/api/admin/status`, { userId, status }, { headers: { token } });
        if (res.data.success) {
            toast.success(res.data.message);
            fetchShops();
        }
    };
    const translateStatus = (status) => {
        switch (status) {
            case "pending":
                return { text: "Đang chờ", color: "#ffa500", bgColor: "#fff4e5" };
            case "approved":
                return { text: "Đã duyệt", color: "#2e7d32", bgColor: "#e8f5e9" };
            case "rejected":
                return { text: "Bị từ chối", color: "#d32f2f", bgColor: "#ffebee" };
            default:
                return { text: status, color: "#333", bgColor: "#f5f5f5" };
        }
    };

    useEffect(() => { if (token) fetchShops(); }, [token]);

    return (
        <div className='admin-list'>
            <h2>Quản lý Phê duyệt Cửa hàng</h2>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Tên Shop</b><b>Email</b><b>Trạng thái</b><b>Hành động</b>
                </div>
                {shops.map((item, index) => {
                    const statusInfo = translateStatus(item.status);
                    return (
                        <div key={index} className='list-table-format'>
                            <p>{item.name}</p>
                            <p>{item.email}</p>
                            <p>
                                <span style={{
                                    padding: "4px 10px",
                                    borderRadius: "15px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    color: statusInfo.color,
                                    backgroundColor: statusInfo.bgColor,
                                    border: `1px solid ${statusInfo.color}`
                                }}>
                                    {statusInfo.text}
                                </span>
                            </p>
                            <div className="btns">
                                <button onClick={() => handleAction(item._id, 'approved')} className='btn-v'>Duyệt</button>
                                <button onClick={() => handleAction(item._id, 'rejected')} className='btn-x'>Khóa</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default Shops;