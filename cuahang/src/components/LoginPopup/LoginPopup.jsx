// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"

// eslint-disable-next-line react/prop-types
const LoginPopup = ({setShowLogin, setShopId,setToken}) => {

  const {url, decodeJWT} = useContext(StoreContext)


  const [currState,setCurrState] = useState("Login")
  const [data,setData] = useState({
    name:"",
    email:"test@gmail.com",
    password:"123456789",
    role:"user"
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }


  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);
      console.log("Phản hồi từ backend:", response.data);

      if (response.data.success) {
        if (currState === "Sign Up" && data.role === "shop_owner") {
          // Backend lúc này KHÔNG gửi token về
          alert("Yêu cầu đã gửi! Vui lòng chờ Admin phê duyệt trước khi đăng nhập.");
          setShowLogin(false);
          return;
        }

        if (response.data.token) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);

          if (response.data.shopId) {
            localStorage.setItem("shopId", response.data.shopId);
            setShopId(response.data.shopId);
          }

          setShowLogin(false);

          const payload = decodeJWT(response.data.token);
          if (payload) {
            if (payload.role === 'admin') {
              window.location.href = 'http://localhost:3001';
            } else if (payload.role === 'shop_owner') {
              window.location.href = '/shopprofile';
            } else if (payload.role === 'user') {
              window.location.href = '/';
            } else {
              window.location.reload();
            }
          }
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối server");
    }
  }

  return (
      <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
          <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
          </div>
          <div className="login-popup-inputs">
            {currState==="Login"?<></>:
                // Form Đăng ký
                <>
                  <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Tên tài khoản' required/>
                  {/* Trường chọn Role */}
                  <label className="role-select-label">
                    Đăng ký với tư cách:
                    <select name='role' onChange={onChangeHandler} value={data.role} required>
                      <option value="user">Khách hàng</option>
                      <option value="shop_owner">Chủ cửa hàng</option>
                    </select>
                  </label>
                </>
            }
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' required/>
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Mật khẩu' required/>
          </div>
          <button type='submit'>{currState==="Login"?"Đăng nhập":"Tạo tài khoản"}</button>
          <div className="login-popup-condition">
            <input type="checkbox" required/>
            <p className='continuee'>Tôi đồng ý với các điều khoản sử dụng và chính sách quyền riêng tư</p>
          </div>
          {currState==="Login"
              ?<p>Tạo tài khoản mới? <span onClick={()=>setCurrState("Sign Up")}>Bấm vào đây</span></p>
              :<p>Đã có tài khoản? <span onClick={()=>setCurrState("Login")}>Đăng nhập</span></p>
          }
        </form>
      </div>
  )
}

export default LoginPopup