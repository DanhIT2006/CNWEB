import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
    const { t } = useTranslation();
  return (
    <div className='sidebar'>
        <div className="sidebar-options">
            <NavLink to='/add' className="sidebar-option">
                <img className='addd' src={assets.add_icon} alt="" />
                <p>{t('add_dish')}</p>
            </NavLink>
            <NavLink to='/list' className="sidebar-option">
                <img className='listt' src={assets.order_icon} alt="" />
                <p>{t('list_dish')}</p>
                </NavLink>
            <NavLink to='/orders' className="sidebar-option">
                <img className='orderr' src={assets.order_icon} alt="" />
                <p>{t('orders')}</p>
                </NavLink>
            <NavLink to='/coupon' className="sidebar-option">
                <img className='couponn' src={assets.coupon_icon} alt="" />
                <p>{t('sale')}</p>
            </NavLink>
            <NavLink to='/stats' className="sidebar-option">
                <img className='stats' src={assets.stats_icon} alt="" />
                <p>{t('stats')}</p>
            </NavLink>
            <NavLink to='/comments' className="sidebar-option">
                <img className='comments' src={assets.stats_icon} alt="" />
                <p>{t('comments_of_customer')}</p>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar