import React, { useContext, useEffect, useState } from 'react';
import './CommentSection.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const CommentSection = ({ foodId }) => {
    const { url, token } = useContext(StoreContext);
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [rating, setRating] = useState(5);
    const [image, setImage] = useState(false);

    // lấy danh sách bình luận
    const fetchComments = async () => {
        const response = await axios.get(`${url}/api/comment/list/${foodId}`);
        if (response.data.success) {
            setComments(response.data.data);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [foodId]);

    // Xử lý gửi bình luận
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            return toast.error("Vui lòng đăng nhập để bình luận");
        }

        const formData = new FormData();
        formData.append("foodId", foodId);
        formData.append("text", text);
        formData.append("rating", rating);
        if (image) formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/comment/add`, formData, { headers: { token } });
            if (response.data.success) {
                setText("");
                setImage(false);
                toast.success(`Đã đăng bình luận thành công!`);


                fetchComments();
            }
        } catch (error) {
            toast.error("Lỗi khi đăng bình luận");
        }
    };

    const [replyToId, setReplyToId] = useState(null);
    const [replyText, setReplyText] = useState("");

    const handleSendReply = async (commentId) => {
        if (!replyText) return toast.error("Vui lòng nhập nội dung");

        try {
            const response = await axios.post(`${url}/api/comment/reply`, {
                commentId,
                replyText
            }, { headers: { token } });

            if (response.data.success) {
                toast.success("Đã gửi phản hồi" ) ;
                setReplyToId(null);
                fetchComments();
            }
        } catch (error) {
            toast.error("Lỗi khi phản hồi");
        }
    };

    return (
        <div className='comment-section'>
            <h3>Bình luận & Đánh giá</h3>

            {/* Form nhập bình luận */}
            <form onSubmit={handleSubmit} className="comment-form">
                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Cảm nhận của bạn..." required />
                <div className="form-controls">
                    <div className="upload-img">
                        <label htmlFor="image">
                            <img
                                src={image ? URL.createObjectURL(image) : "https://cdn-icons-png.flaticon.com/512/126/126477.png"}
                                alt="Chọn ảnh"
                                style={{ width: '40px', height: '40px', objectFit: 'cover', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '4px', marginRight: '30px' }}
                            />
                        </label>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                    </div>
                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Sao</option>)}
                    </select>
                    <button type="submit">Gửi</button>
                </div>
            </form>

            {/* Danh sách bình luận */}
            <div className="comments-list">
                {comments.map((item, index) => (
                    <div key={index} className="comment-item">
                        <div className="comment-main">
                            <b>{item.userId.name}</b> - <span>{item.rating} ⭐</span>
                            <p>{item.text}</p>
                            {item.image && <img className="comment-img" src={`${url}/images/${item.image}`} alt="" />}

                            <button
                                className="reply-btn"
                                onClick={() => {
                                    setReplyToId(item._id);
                                    setReplyText("");
                                }}
                            >
                                Trả lời
                            </button>
                        </div>

                        {replyToId === item._id && (
                            <div className="reply-input-box">
                                <input
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Nhập phản hồi của bạn..."
                                />
                                <button onClick={() => handleSendReply(item._id)}>Gửi</button>
                                <button onClick={() => setReplyToId(null)}>Hủy</button>
                            </div>
                        )}

                        {/* Hiển thị danh sách Phản hồi (Replies) */}
                        {item.replies && item.replies.map((rep, idx) => (
                            <div key={idx} className={`comment-reply ${rep.senderRole === 'shop_owner' ? 'shop-style' : 'user-style'}`}>
                                <b style={{ color: rep.senderRole === 'shop_owner' ? '#ff6347' : '#333' }}>
                                    {rep.senderName} {rep.senderRole === 'shop_owner' ? '(Cửa hàng)' : ''}:
                                </b>
                                <p>{rep.text}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;