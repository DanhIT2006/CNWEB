import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Users.css';

const Users = ({ url, token }) => {
    const [users, setUsers] = useState([]);

    const toggleUserStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'approved' ? 'blocked' : 'approved';
        const response = await axios.post(`${url}/api/admin/user-status`, { userId, status: newStatus }, { headers: { token } });

        if (response.data.success) {
            toast.success(response.data.message);
            fetchUsers(); // Tải lại danh sách để cập nhật giao diện
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/list-users`, { headers: { token } });
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            toast.error("Không thể kết nối đến máy chủ");
        }
    };

    useEffect(() => {
        if (token) fetchUsers();
    }, [token]);

    return (
        <div className='admin-list'>
            <h2>Quản lý Khách hàng</h2>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Họ Tên</b><b>Email</b><b>Trạng thái</b><b>Hành động</b>
                </div>
                {users.map((item, index) => (
                    <div key={index} className='list-table-format'>
                        <p>{item.ho} {item.name}</p>
                        <p>{item.email}</p>
                        <p style={{ color: item.status === 'blocked' ? 'red' : 'green' }}>
                            {item.status === 'blocked' ? 'Đã khóa' : 'Hoạt động'}
                        </p>
                        <button
                            onClick={() => toggleUserStatus(item._id, item.status)}
                            className={item.status === 'blocked' ? 'btn-v' : 'btn-x'}
                        >
                            {item.status === 'blocked' ? 'Mở khóa' : 'Khóa'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Users;