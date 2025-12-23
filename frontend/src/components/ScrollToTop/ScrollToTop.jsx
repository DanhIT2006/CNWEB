import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    // Lấy đối tượng location (chứa thông tin về URL hiện tại)
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [pathname]); // Hook sẽ chạy lại mỗi khi đường dẫn (pathname) thay đổi

    return null;
}

export default ScrollToTop;