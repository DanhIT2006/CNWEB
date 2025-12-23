import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"

const LoginPopup = ({setShowLogin}) => {

  const {url, setToken, decodeJWT} = useContext(StoreContext)

  const [currState, setCurrState] = useState("Login")
  const [data, setData] = useState({
    ho:"",
    name: "",
    email: "",
    password: "",
    role: "user"
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]: value}))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login"
    } else {
      newUrl += "/api/user/register"
    }

    try {
      const response = await axios.post(newUrl, data);
      console.log("Phản hồi:", response.data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);

        // Kiểm tra role để chuyển hướng
        const payload = decodeJWT(response.data.token);
        if (payload && payload.role === 'shop_owner') {
          window.location.href = '/stats';
        } else {
          window.location.reload();
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Lỗi kết nối đến Server. Vui lòng kiểm tra lại Backend!");
    }
  }

  return (
      <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
          <div className="login-popup-title">
            <h2>{currState === "Login" ? "Đăng nhập" : "Đăng ký"}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
          </div>

          <div className="login-popup-inputs">
            {currState === "Login" ? <></> :
                // Form Đăng ký
                <>
                  <input name='ho' onChange={onChangeHandler} value={data.ho} type="text" placeholder='Họ' required/>
                  <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Tên' required/>

                  <label className="role-select-label" style={{display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '14px'}}>
                    Đăng ký với tư cách:
                    <select name='role' onChange={onChangeHandler} value={data.role} style={{padding: '8px', border: '1px solid #c9c9c9', borderRadius: '4px'}}>
                      <option value="user">Khách hàng</option>
                      <option value="shop_owner">Chủ cửa hàng</option>
                    </select>
                  </label>
                </>
            }
            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' required/>
            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Mật khẩu' required/>
          </div>

          <button type='submit'>
            {currState === "Sign Up" ? "Tạo tài khoản" : "Đăng nhập"}
          </button>

          <div className="login-popup-condition">
            <input type="checkbox" required/>
            <p className='continuee'>Tôi đồng ý với các điều khoản sử dụng và chính sách quyền riêng tư</p>
          </div>

          {currState === "Login"
              ? <p>Chưa có tài khoản? <span onClick={()=>setCurrState("Sign Up")}>Đăng ký ngay</span></p>
              : <p>Đã có tài khoản? <span onClick={()=>setCurrState("Login")}>Đăng nhập</span></p>
          }
        </form>
      </div>
  )
}

export default LoginPopup