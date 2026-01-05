import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Shops from "./pages/Shops/Shops";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Users from "./pages/Users/Users";
import Dashboard from "./pages/Dashboard/Dashboard";

const App = () => {
    const url = "http://localhost:5000";

    useEffect(() => {
        // 1. Kiểm tra xem URL có chứa token không (ví dụ: ?token=abc...)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
            // 2. Nếu có, lưu ngay vào LocalStorage của port 3001
            localStorage.setItem("token", tokenFromUrl);
            // 3. Xóa token trên URL để giao diện trông sạch sẽ
            window.history.replaceState({}, document.title, "/shops");
            // 4. Load lại trang để các component nhận token mới
            window.location.reload();
        }
    }, []);
    const token = localStorage.getItem("token");

    return (
        <div className="app-admin">
            <ToastContainer />
            <div className="navbar-admin">
                <h2 className="logo">FOOD-ONLINE <span>Quản Trị Viên</span></h2>
            </div>
            <hr />
            <div className="admin-content" style={{display: "flex"}}>
                <Sidebar />
                <div className="main-view" style={{flex: 1, padding: "20px"}}>
                    <Routes>
                        <Route path="/shops" element={<Shops url={url} token={token} />} />
                        <Route path="/users" element={<Users url={url} token={token} />} />
                        <Route path="/stats" element={<Dashboard url={url} token={token} />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};
export default App;