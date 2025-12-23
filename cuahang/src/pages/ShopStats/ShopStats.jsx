import React from 'react'
import './ShopStats.css'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { assets } from '../../assets/assets';
import { useTranslation } from 'react-i18next';

const ShopStats = () => {
    const { t, i18n } = useTranslation(); // Khởi tạo i18n

    const data = [
        { name: t('monday_short'), doanhThu: 4000000, donHang: 24, khachMoi: 5 },
        { name: t('tuesday_short'), doanhThu: 3000000, donHang: 18, khachMoi: 3 },
        { name: t('wednesday_short'), doanhThu: 2500000, donHang: 15, khachMoi: 2 },
        { name: t('thursday_short'), doanhThu: 2780000, donHang: 20, khachMoi: 6 },
        { name: t('friday_short'), doanhThu: 1890000, donHang: 12, khachMoi: 1 },
        { name: t('saturday_short'), doanhThu: 6390000, donHang: 40, khachMoi: 10 },
        { name: t('sunday_short'), doanhThu: 7490000, donHang: 45, khachMoi: 12 },
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            style: 'currency',
            currency: i18n.language === 'vi' ? 'VND' : 'USD',
        }).format(i18n.language === 'vi' ? value : value / 25000);
    };

    return (
        <div className='shop-stats'>
            <div className="stats-header">
                <img src={assets.stats_icon} alt="" style={{width: '40px'}} />
                <h2 className='stats-title'>{t('business_stats_title')}</h2>
            </div>

            <div className="stats-cards">
                <div className="card">
                    <div className="card-info">
                        <h3>{formatCurrency(27550000)}</h3>
                        <p>{t('total_weekly_revenue')}</p>
                    </div>
                </div>
            </div>

            <div className="stats-charts">
                <div className="chart-container">
                    <h3>{t('revenue_last_week')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis
                                width={60}
                                tickFormatter={(value) => i18n.language === 'vi' ? (value / 1000000) + 'tr' : (value / 25000 / 1000).toFixed(1) + 'k'}
                            />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="doanhThu" name={t('revenue_label')} fill="#ff6347" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container" style={{marginTop: '20px'}}>
                    <h3>{t('order_trend_title')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis width={40} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="donHang" name={t('orders_label')} stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="khachMoi" name={t('new_customers_label')} stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default ShopStats