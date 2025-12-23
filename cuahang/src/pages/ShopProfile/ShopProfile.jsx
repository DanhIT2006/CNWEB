import React, { useContext, useEffect, useState } from 'react';
import './ShopProfile.css';
import { StoreContext } from '../../../../cuahang/src/context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const ShopProfile = () => {
    const { url, token, decodeJWT } = useContext(StoreContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [shopData, setShopData] = useState({
        shopName: '',
        address: '',
        phone: '',
        description: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }
        const payload = decodeJWT(token);
        if (!payload || payload.role !== 'shop_owner') {
            toast.error(t('error_no_permission'));
            navigate('/');
        }
    }, [token, navigate, t]);

    const fetchShopProfile = async () => {
        if (!token) return;

        try {
            const response = await axios.get(url + "/api/shop/profile", {
                headers: { token }
            });

            if (response.data.success) {
                setShopData(response.data.data);
            } else {
                setError(t('error_fetch_profile'));
            }
        } catch (err) {
            console.error("Lỗi fetch shop profile:", err);
            setError(t('toast_connection_error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShopProfile();
    }, [token]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setShopData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        if (!token) return;

        try {
            const response = await axios.put(url + "/api/shop/profile", shopData, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success(t('toast_update_profile_success'));
                setShopData(response.data.data);
            } else {
                toast.error(t('toast_update_profile_error'));
            }
        } catch (err) {
            console.error("Lỗi cập nhật:", err);
            toast.error(t('toast_connection_error'));
        }
    };

    if (loading) return <div className='shop-profile-page loading'>{t('loading_profile')}</div>;
    if (error) return <div className='shop-profile-page error'>{t('error_label')}: {error}</div>;

    return (
        <div className='shop-profile-page'>
            <h2>{t('manage_shop_info_title')}</h2>
            <form onSubmit={handleUpdate} className="shop-profile-container">

                <label htmlFor="shopName">{t('shop_name_label')}</label>
                <input
                    id="shopName"
                    name="shopName"
                    type="text"
                    value={shopData.shopName}
                    onChange={onChangeHandler}
                    placeholder={t('placeholder_shop_name')}
                    required
                />

                <label htmlFor="address">{t('shop_address_label')}</label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    value={shopData.address}
                    onChange={onChangeHandler}
                    placeholder={t('placeholder_shop_address')}
                    required
                />

                <label htmlFor="phone">{t('shop_phone_label')}</label>
                <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={shopData.phone}
                    onChange={onChangeHandler}
                    placeholder={t('placeholder_shop_phone')}
                />

                <label htmlFor="description">{t('shop_description_label')}</label>
                <textarea
                    id="description"
                    name="description"
                    value={shopData.description}
                    onChange={onChangeHandler}
                    placeholder={t('placeholder_shop_description')}
                />

                <button type='submit' className='update-button'>
                    {t('update_shop_info_btn')}
                </button>
            </form>
        </div>
    );
};

export default ShopProfile;