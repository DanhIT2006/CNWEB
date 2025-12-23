import React, { useEffect } from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
import { useTranslation } from 'react-i18next';

const Footer = () => {
    useEffect(() => {
        // Ensure the footer logo stays the same for both light and dark modes
        document.querySelector(".tomatologofooter").style.filter = "none";
    }, []);
    const { t } = useTranslation();
    return (
        <div className="footer" id="footer">
            <div className="footer-content">
                <div className="footer-content-left">
                    <img
                        className="tomatologofooter"
                        src={assets.logo}
                        alt=""
                    />
                    <div className="footer-social-icons">

                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <a
                            href="https://www.linkedin.com/in/your-linkedin-profile"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src={assets.linkedin_icon} alt="LinkedIn" />
                        </a>
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>{t('company')}</h2>
                    <ul>
                        <li>{t('home_footer')}</li>
                        <li>{t('about_footer')}</li>
                        <li>{t('transport')}</li>
                        <li>{t('privacy_policy')}</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>{t('contact_footer')}</h2>
                    <ul>
                        <li>+84865412596</li>
                        <li>danhvt.24it@vku.udn.vn</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">
                Copyright 2025 © VTD - All rights reserved.
            </p>
        </div>
    );
};

export default Footer;
