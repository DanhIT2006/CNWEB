import React, { useContext,useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import {toast} from "react-toastify"
import { StoreContext } from '../../context/StoreContext';
import { useTranslation } from 'react-i18next';


const List = () => {
  //const url = 'http://localhost:5000';

  const { t } = useTranslation();


  const { url, token } = useContext(StoreContext);

  const [list,setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(url + "/api/shop/list", { headers: { token } });    if (response.data.success){
      setList(response.data.data)
    }
    else
    {
      toast.error("Error")
    }
  }

  const removeFood = async(foodId) => {
    const response = await axios.post(url + "/api/shop/remove", { id: foodId }, { headers: {token } });    await fetchList();
    if (response.data.success){
      toast.success(response.data.message)
    }
    else{
      toast.error("Error")
    }
  }


  useEffect(()=>{
    fetchList();
  },[])

  return (
    <div className='list add flex-col'>
      <p>{t('ctr')}</p>
    <div className="list-table">
      <div className="list-table-format title">
        <b>{t('img')}</b>
        <b>{t('name')}</b>
        <b>{t('catetory')}</b>
        <b>{t('price')}</b>
        <b>{t('delete')}</b>
      </div>
      {list.map((item,index)=>{
        return (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/`+item.image} alt="" />
            <p>{item.name}</p>
            <p>{t(item.category)}</p>
            <p>{Number(item.price).toLocaleString('vi-VN')}₫</p>
            <p onClick={()=>removeFood(item._id)} style={{color: "red", cursor: "pointer"}}>X</p>
          </div>
        )
      })}
    </div>
    </div>
  )
}

export default List