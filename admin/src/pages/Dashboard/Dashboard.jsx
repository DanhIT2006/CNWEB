import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = ({ url, token }) => {
    const [data, setData] = useState({ pieData: [], barData: [], summary: {} });
    const COLORS = ['#FF4C24', '#27AE60', '#F39C12', '#E74C3C'];

    const fetchStats = async () => {
        const res = await axios.get(`${url}/api/admin/stats`, { headers: { token } });
        if (res.data.success) setData(res.data);
    };

    useEffect(() => {
        console.log("Token tại Dashboard:", token);
        if (token) {
            fetchStats();
        }
    }, [token]);

    return (
        <div className='dashboard-main'>
            <h2>Tổng quan Hệ thống</h2>

            {/* Thẻ thống kê nhanh */}
            <div className="stats-cards">
                <div className="card">
                    <h3>Tổng Khách hàng</h3>
                    <p>{data.summary.totalUsers || 0}</p>
                </div>
                <div className="card shop">
                    <h3>Tổng Cửa hàng</h3>
                    <p>{data.summary.totalShops || 0}</p>
                </div>
            </div>

            {/* Khu vực Biểu đồ */}
            <div className="charts-grid">
                <div className="chart-box">
                    <h3>Tỉ lệ Người dùng</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={data.pieData} innerRadius={60} outerRadius={80} dataKey="value">
                                {data.pieData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-box">
                    <h3>Trạng thái Phê duyệt Shop</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data.barData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#FF4C24" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;