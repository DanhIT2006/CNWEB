import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null)

const decodeJWT = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        // Thay thế ký tự không hợp lệ cho base64
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Lỗi giải mã token:", e);
        return null;
    }
};

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:5000"
    const [token,setToken] = useState("")
    const [food_list,setFoodList] = useState([])


    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token: token}})
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            if (newCart[itemId] <= 1) {
                delete newCart[itemId];
            } else {
                newCart[itemId] -= 1;
            }
            return newCart;
        });

        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: {token: token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) 
        {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item)
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token: token}});
        setCartItems(response.data.cartData || {});
    }


    useEffect(()=>{
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        decodeJWT
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {/* eslint-disable-next-line react/prop-types */}
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;