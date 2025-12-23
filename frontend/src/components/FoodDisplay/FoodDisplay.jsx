import React, { useContext, useState } from 'react' // Thêm useState
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import { useTranslation } from 'react-i18next';

const FoodDisplay = ({category}) => {
    const {food_list} = useContext(StoreContext)
    const { t } = useTranslation();

    // Tạo state để lưu từ khóa tìm kiếm
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className='food-display' id='food-display'>
            <div className="food-display-header">
                <h2 className='h2we'>{t('display_title')}</h2>

                <div className="food-search-box">
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                    />
                </div>
            </div>

            <div className="food-display-list">
                {food_list
                    .filter(item => {
                        // 1. Lọc theo Category
                        const matchesCategory = category === "All" || category === item.category;

                        // 2. Lọc theo Tên món ăn hoặc Tên quán
                        const matchesSearch =
                            item.name.toLowerCase().includes(searchTerm) ||
                            (item.shopId?.shopName && item.shopId.shopName.toLowerCase().includes(searchTerm));

                        return matchesCategory && matchesSearch;
                    })
                    .map(item => (
                        <FoodItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            shopName={item.shopId?.shopName}
                            shopAddress={item.shopId?.address}
                        />
                    ))}
            </div>
        </div>
    )
}

export default FoodDisplay