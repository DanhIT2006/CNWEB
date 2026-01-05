import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="sidebar-options">
                <NavLink title="Quản lý Shop" to='/shops' className="sidebar-option">
                    <p>Quản lý Cửa hàng</p>
                </NavLink>
                <NavLink title="Quản lý Khách hàng" to='/users' className="sidebar-option">
                    <p>Quản lý Khách hàng</p>
                </NavLink>
                <NavLink to="/stats" className="sidebar-option">
                    <p>Tổng quan hệ thống</p>
                </NavLink>
            </div>
        </div>
    )
}
export default Sidebar