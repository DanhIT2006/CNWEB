import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './CommentSection.css';

const CommentSection = ({ foodId }) => {
    const { url, token } = useContext(StoreContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    // 1. Fetch Comments
    const fetchComments = async () => {
        try {
            const response = await axios.get(`${url}/api/comment/get/${foodId}`);
            setComments(response.data.data);
        } catch (error) {
            console.error("Lỗi khi fetch bình luận:", error);
        }
    };

    // 2. Submit Comment
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            alert("Vui lòng đăng nhập để bình luận.");
            return;
        }
        if (newComment.trim() === '') return;

        try {
            await axios.post(`${url}/api/comment/add`,
                { foodId, text: newComment },
                { headers: { token } }
            );
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error("Lỗi khi gửi bình luận:", error);
            alert("Không thể gửi bình luận. Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        fetchComments();
    }, [foodId]);

    return (
        <div className='comment-section'>
            <h3 className='comment-title'>Đánh giá ({comments.length})</h3>

            {/* Form gửi bình luận */}
            <form onSubmit={handleSubmit} className='comment-form'>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    required
                ></textarea>
                <button type="submit">Gửi Bình luận</button>
            </form>

            {/* Danh sách bình luận */}
            <div className='comments-list'>
                {comments.length === 0 ? (
                    <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                ) : (
                    comments.map((comment, index) => (
                        <div key={index} className='comment-item'>
                            <p className='comment-user'><strong>{comment.userName}</strong></p>
                            <p className='comment-text'>{comment.text}</p>
                            <span className='comment-date'>{comment.createdAt}</span>

                            {comment.reply && comment.reply.text && (
                                <div className="customer-view-reply">
                                    <p className="reply-header">
                                        <i className="fa-solid fa-reply"></i> <b>Phản hồi từ Cửa hàng:</b>
                                    </p>
                                    <p className="reply-content">{comment.reply.text}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        className={star <= (hover || rating) ? "on" : "off"}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(rating)}
                    >
                        <span className="star">&#9733;</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;