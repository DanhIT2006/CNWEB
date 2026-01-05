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

    useEffect(() => { if (token) fetchShops(); }, [token]);

    return (
        <div className='admin-list'>
            <h2>Quản lý Phê duyệt Cửa hàng</h2>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Tên Shop</b><b>Email</b><b>Trạng thái</b><b>Hành động</b>
                </div>
                {shops.map((item, index) => (
                    <div key={index} className='list-table-format'>
                        <p>{item.name}</p>
                        <p>{item.email}</p>
                        <p className={`status ${item.status}`}>{item.status}</p>
                        <div className="btns">
                            <button onClick={() => handleAction(item._id, 'approved')} className='btn-v'>Duyệt</button>
                            <button onClick={() => handleAction(item._id, 'rejected')} className='btn-x'>Khóa</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Shops;