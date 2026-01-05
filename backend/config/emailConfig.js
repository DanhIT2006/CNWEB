import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'danhvt.24it@vku.udn.vn',
        pass: 'bkbqcvclbcfhchgt'
    }
});

export const sendStatusEmail = async (email, name, status) => {
    const mailOptions = {
        from: 'danhvt.24it@vku.udn.vn',
        to: email,
        subject: 'Thông báo từ Food Online',
        text: status === 'approved'
            ? `Chào ${name}, Cửa hàng của bạn đã được duyệt thành công!`
            : `Chào ${name}, Yêu cầu của bạn đã bị từ chối.`
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Lỗi gửi mail:", error);
    }
};