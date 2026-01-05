import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ShopComments.css';
import {StoreContext} from "../../context/StoreContext.jsx";

const ShopComments = ({ url, shopId }) => {
    const [comments, setComments] = useState([]);
    const {token} = useContext(StoreContext);

    const fetchComments = async () => {
        try {
            // API lấy bình luận theo shopId
            const response = await axios.get(`${url}/api/comment/shop/${shopId}`);
            if (response.data.success) {
                setComments(response.data.data);
            }
        } catch (error) {
            toast.error("Không thể tải bình luận");
        }
    };
// phản hồi
    const [replyTexts, setReplyTexts] = useState({});

    const handleReply = async (commentId) => {
        if (!token) {
            toast.error("Vui lòng đăng nhập!!!");
            return;
        }
        try {
            const response = await axios.post(`${url}/api/comment/reply`,
                {commentId, replyText: replyTexts[commentId]},
                {headers: {token}}
                );
            if (response.data.success) {
                toast.success("Đã gửi phản hồi");
                setReplyTexts(prev =>({...prev, [commentId]: ""})); // Xóa sau khi gửi
                fetchComments();// tải lại danh sách để hiển thị phản hồi mới
            }
        } catch (error) {
            toast.error("Lỗi gửi phản hồi");
        }
    };


    useEffect(() => {
        if (shopId) fetchComments();
    }, [shopId]);

    // Hàm hiển thị số sao
    const renderStars = (rating) => {
        return "⭐".repeat(rating) + "☆".repeat(5 - rating);
    };



    return (
        <div className='shop-comments'>
            <h2>Đánh giá từ khách hàng</h2>
            <div className="comment-list">
                {comments.length > 0 ? comments.map((item, index) => (
                    <div key={index} className="comment-card">
                        <div className="comment-header">
                            <img src={`${url}/images/${item.foodId?.image}`} alt="" />
                            <div>
                                <h4>{item.foodId.name}</h4>
                                <p className="customer-name">Bởi: {item.userId?.ho} {item.userId?.name}</p>
                            </div>
                            <div className="comment-rating">{renderStars(item.rating)}</div>
                        </div>
                        <p className="comment-content">&quot;{item.text}&quot;</p>
                        <p className="comment-date">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</p>

                        {item.reply && item.reply.text && (
                            <div className="shop-reply">
                                <p><strong>Cửa hàng phản hồi:</strong> {item.reply.text}</p>
                            </div>
                        )}

                        <div className="reply-input-group">
                            <input
                                type="text"
                                placeholder="Viết phản hồi..."
                                value={replyTexts[item._id] || ""}
                                onChange={(e) => setReplyTexts({...replyTexts, [item._id]: e.target.value})}
                                />
                            <button onClick={() => handleReply(item._id)}>Gửi</button>
                        </div>
                    </div>
                )) : <p>Chưa có đánh giá nào.</p>}
            </div>
        </div>
    );
};

export default ShopComments;