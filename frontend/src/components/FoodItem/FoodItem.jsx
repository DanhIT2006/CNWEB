
import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { formatPrice } from '../../utils/formatPrice'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function FoodItem ({id,name,price,description,image, shopName, shopAddress}) {
    const {cartItems = {},addToCart,removeFromCart,url} = useContext(StoreContext);
    const navigate = useNavigate();

    const handleItemClick = (e) => {
        // Ngăn chặn sự kiện click lan truyền lên khi bấm nút Add/Remove
        if (e.target.closest('.food-item-counter') || e.target.closest('.add')) {
            return;
        }
        // Chuyển hướng đến trang chi tiết món ăn
        navigate(`/food/${id}`);
    };
    const { t } = useTranslation();
    return (
        <div className='food-item' onClick={handleItemClick}>
            <div className="food-item-img-container">
                <img className='food-item-image' src={url+"/images/"+image} alt="" />
                {!cartItems[id]
                    ?<img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="" />
                    :<div className='food-item-counter'>
                        <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt='' />
                        <p className='cartitemsp'>{cartItems[id]}</p>
                        <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt='' />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p className='namewe'>{name}</p>
                    <img className='ratingstars' src={assets.rating_starts} alt="" />
                </div>
                {shopName && (
                    <p className="food-item-shop-name" style={{fontSize: '15px', color: '#ff6347', fontWeight: 'bold', marginBottom: '5px'}}>
                        🏡 {t('store')}: {shopName}
                    </p>
                )}
                <p className="food-item-desc">{description}</p>
                <div className="food-item-price-address">
                    <p className="food-item-price">{formatPrice(price)}</p>
                    {shopAddress && (
                        <p className="food-item-address">
                            📍 {shopAddress}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FoodItem