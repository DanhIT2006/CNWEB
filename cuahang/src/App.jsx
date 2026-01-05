import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import LoginPopup from './components/LoginPopup/LoginPopup'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import StoreContextProvider from './context/StoreContext'
import ShopProfile from "./pages/ShopProfile/ShopProfile.jsx";
import AddCoupon from "./pages/AddCoupon/AddCoupon.jsx";
import ShopStats from "./pages/ShopStats/ShopStats.jsx";
import ShopComments from "./pages/ShopComments/ShopComments.jsx";

const App = () => {
    const [showLogin, setShowLogin] = useState(false)
    const url = "http://localhost:5000"
    const [shopId, setShopId] = useState(localStorage.getItem("shopId") || "");
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    return (
        <StoreContextProvider>
            {showLogin && <LoginPopup setShowLogin={setShowLogin} setToken={setToken} setShopId={setShopId} />}
            <ToastContainer />
            <Navbar setShowLogin={setShowLogin} token={token} setToken={setToken} />
            <hr />
            <div className="app-content">
                <Sidebar />
                <Routes>
                    <Route path="/" element={<Navigate to="/add" replace />} />
                    <Route path="/add" element={<Add />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/shopProfile" element={<ShopProfile setShopId={setShopId} />} />
                    <Route path="/coupon" element={<AddCoupon url={url}/>} />
                    <Route path="/stats" element={<ShopStats />} />
                    <Route path="/comments" element={<ShopComments url={url} shopId={shopId} />} />
                </Routes>
            </div>
        </StoreContextProvider>
    )
}

export default App