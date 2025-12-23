import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();

    const { t } = useTranslation();

    // State lưu thông tin hiển thị
    const [userData, setUserData] = useState({
        ho: '',
        name: '',
        phone: '',
        tinh: '',
        phuongXa: '',
        tenDuong: '',
        email: '',
        role: ''
    });

    // State form chỉnh sửa thông tin
    const [formData, setFormData] = useState({
        name: '',
    });

    //  State cho đổi mật khẩu
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(true);

    // 1. Lấy dữ liệu profile
    const fetchProfileData = async () => {
        if (!token) {
            navigate('/');
            return;
        }
        try {
            const response = await axios.get(url + "/api/user/profile", { headers: { token } });
            if (response.data.success) {
                const data = response.data.data;
                setUserData(data);
                // KHỞI TẠO ĐẦY ĐỦ CÁC TRƯỜNG CHO FORM
                setFormData({
                    ho: data.ho || '',
                    name: data.name || '',
                    phone: data.phone || '',
                    tinh: data.tinh || '',
                    phuongXa: data.phuongXa || '',
                    tenDuong: data.tenDuong || ''
                });
            }
        } catch (err) {
            console.error(err);
            toast.error("Lỗi tải thông tin");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [token]);

    // Xử lý thay đổi input thông tin
    const onChangeHandler = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Xử lý thay đổi input mật khẩu
    const onPasswordChangeHandler = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    }

    // Cập nhật thông tin cơ bản
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(url + "/api/user/profile", formData, { headers: { token } });
            if (response.data.success) {
                toast.success("Cập nhật thông tin thành công!");
                setUserData(prev => ({ ...prev, ...formData }));
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error("Lỗi kết nối server");
        }
    };

    // Xử lý đổi mật khẩu
    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault(); // Ngăn reload trang

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error("Mật khẩu mới phải có ít nhất 8 ký tự");
            return;
        }

        try {
            // Gọi API đổi mật khẩu
            const response = await axios.post(url + "/api/user/change-password", {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }, { headers: { token } });

            if (response.data.success) {
                toast.success("Đổi mật khẩu thành công!");
                setShowPasswordChange(false);
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Lỗi đổi mật khẩu");
        }
    }

    if (loading) return <div className='profile-page loading'>Đang tải...</div>;


    return (
        <div className='profile-page'>
            <h2>{t('profile_title')}</h2>

            {/* Form cập nhật thông tin cơ bản */}
            <form onSubmit={handleUpdate} className="profile-container">
                <div className='profile-info-display'>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>{t('role')}:</strong> {userData.role === 'shop_owner' ? t('shop_owner') : t('customer')}</p>
                </div>
                <hr/>
                <div className='profile-edit-section'>
                    <h3>{t('basic_info')}</h3>
                    <div className="multi-fields-profile" style={{display:'flex', gap:'10px'}}>
                        <div style={{flex:1}}>
                            <label>Họ</label>
                            <input name="ho" value={formData.ho} onChange={onChangeHandler} />
                        </div>
                        <div style={{flex:1}}>
                            <label>Tên</label>
                            <input name="name" value={formData.name} onChange={onChangeHandler} />
                        </div>
                    </div>
                        <div style={{flex:1}}>
                    <label>Số điện thoại</label>
                    <input name="phone" value={formData.phone} onChange={onChangeHandler} />
                        </div>
                        <div style={{flex:1}}>
                    <label>Tỉnh/Thành phố</label>
                    <input name="tinh" value={formData.tinh} onChange={onChangeHandler} />
                        </div>
                        <div style={{flex:1}}>
                            <label>Phường/Xã</label>
                            <input name="phuongXa" value={formData.phuongXa} onChange={onChangeHandler} />
                        </div>
                    <div style={{flex:1}}>
                        <label>Tên đường</label>
                        <input name="tenDuong" value={formData.tenDuong} onChange={onChangeHandler} />
                    </div>

                    <button type='submit' className='update-button'>{t('update')}</button>
                </div>
            </form>

            {/*Khu vực đổi mật khẩu tách riêng */}
            <div className="profile-edit-section" style={{marginTop: '30px'}}>
                <button
                    type='button'
                    className='password-button'
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                >
                    {showPasswordChange ? t('cancel_password') : t('change_password')}
                </button>

                {showPasswordChange && (
                    <form onSubmit={handleChangePasswordSubmit} className="password-form" style={{marginTop: '20px', padding: '20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px'}}>
                        <h4 style={{marginBottom: '15px'}}>{t('set_password')}</h4>

                        <label>{t('old_password')}</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={onPasswordChangeHandler}
                            required
                            placeholder={t('enter_oldpassword')}
                        />

                        <label>{t('new_password')}</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={onPasswordChangeHandler}
                            required
                            placeholder={t('enter_newpassword')}
                        />

                        <label>{t('confirm_newpassword')}</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={onPasswordChangeHandler}
                            required
                            placeholder={t('enter_confirm')}
                        />

                        <button type="submit" className="update-button" style={{backgroundColor: '#ff6347'}}>
                            {t('save_password')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;