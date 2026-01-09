import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './FoodDetail.css';
import CommentSection from "../../components/CommentSection/CommentSection.jsx";
import {toast} from "react-toastify";
import { useTranslation } from 'react-i18next';

const FoodDetail = ({shopAddress}) => {
    const { foodId } = useParams();
    const { food_list, url, addToCart } = useContext(StoreContext);
    const navigate = useNavigate();

    const { t } = useTranslation();

    // Tìm món ăn trong food_list
    const foodItem = food_list.find(item => item._id === foodId);

    if (!foodItem) {
        return <div className='food-detail-error'>Không tìm thấy món ăn này.</div>;
    }

    // Hàm để xử lý thêm vào giỏ hàng từ trang chi tiết
    const handleAddToCart = () => {
        addToCart(foodId);
        toast.success(`${foodItem.name} đã được thêm vào giỏ hàng!`);
    };

    return (
        <div className='food-detail-page'>
            <button onClick={() => navigate(-1)} className='back-button'>
                &larr; Quay lại
            </button>
            <div className='food-detail-container'>

                <div className='food-detail-left'>
                    <img
                        className='detail-image'
                        src={url + "/images/" + foodItem.image}
                        alt={foodItem.name}
                    />
                </div>

                <div className='food-detail-right-content'>

                    {/* Cột 1: Thông tin cơ bản */}
                    <div className='food-detail-info'>
                        <h2 className='detail-name'>{foodItem.name}</h2>
                        {foodItem.shopId && (
                            <p className='detail-shop' style={{marginBottom: '10px', fontSize: '1.1em'}}>
                                Cửa hàng: <span style={{fontWeight: 'bold', color: '#ff6347'}}>{foodItem.shopId.shopName}</span>
                            </p>
                        )}
                        <p className='detail-category'>Danh mục: <span>{t(foodItem.category)}</span></p>
                        <div className='detail-price-section'>
                            <p className='detail-price'>Giá: <span>{foodItem.price.toLocaleString('vi-VN')}₫</span></p>
                        </div>
                        <p className='detail-description'>
                            <strong>Mô tả chi tiết:</strong> {foodItem.description}
                        </p>
                        {foodItem.shopId && (
                            <p className='detail-shop-address' style={{ marginTop: '10px', fontSize: '1em', color: '#555' }}>
                                <strong style={{ color: '#333' }}>Địa chỉ cửa hàng: </strong>
                                {foodItem.shopId.address}
                            </p>
                        )}
                        <button onClick={handleAddToCart} className='add-to-cart-button'>
                            Thêm vào Giỏ hàng
                        </button>
                    </div>

                    {/* Cột 2: Bình luận */}
                    <div className='food-detail-reviews'>
                        <CommentSection foodId={foodId} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FoodDetail;