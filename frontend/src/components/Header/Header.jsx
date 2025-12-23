import React, { useState, useEffect } from 'react'
import './Header.css'
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t } = useTranslation();

    const images = [
        '/header_img.png',
        '/header_img_2.png',
        '/header_img_3.png',
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div
            className='header'
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
        >
            <div className="header-contents">
                <h2>{t('title_header')}</h2>
                <p>{t("header_desc")}</p>
                <a href="#explore-menu">
                    <button className='buttonwl'>{t('view_menu')}</button>
                </a>
            </div>
            <div className="header-dots">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                    ></div>
                ))}
            </div>
        </div>
    )
}

export default Header