import React, { useContext, useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext';
import { useTranslation } from 'react-i18next';


const Add = () => {
    const { url, token } = useContext(StoreContext);

    const { t } = useTranslation();


    const [image,setImage] = useState(false);
    const [data,setData] = useState({
        name:"",
        description:"",
        price:"",
        category:"noodles"
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }

    const onSubmitHandler = async (event) =>{
        event.preventDefault();
        const formData = new FormData();
        formData.append("name",data.name)
        formData.append("description",data.description)
        formData.append("price",Number(data.price))
        formData.append("category",data.category)
        formData.append("image",image)
        const response = await axios.post(url + "/api/shop/add", formData, { headers: { token } });
        if (response.data.success) {
            setData({
                name:"",
                description:"",
                price:"",
                category:"noodles"
            })
            setImage(false)
            toast.success(response.data.message)
        }
        else{
            toast.error(response.data.message)
        }
    }


  return (
    <div className='add'>
        <form className='flex-col' onSubmit={onSubmitHandler}>
            <div className="add-img-upload flex-col">
                <p>{t('upload_img')}</p>
                <label htmlFor="image">
                    <img className='image' src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
                </label>
                <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden required/>

            </div>
            <div className="add-product-name flex-col">
                <p>{t('name_dish')}</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder={t('plc1')} />
            </div>
            <div className="add-product-description flex-col">
                <p>{t('description_dish')}</p>
                <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder={t('plc2')} required></textarea>
            </div>
            <div className="add-category-price">
                <div className="add-category flex-col">
                    <p>{t('catetory')}</p>
                    <select className='selectt' onChange={onChangeHandler} name="category">
                        <option value="noodles">{t('noodles')}</option>
                        <option value="rice">{t('rice')}</option>
                        <option value="bread">{t('bread')}</option>
                        <option value="grilled_dishes">{t('grilled_dishes')}</option>
                        <option value="hot_pot">{t('hot_pot')}</option>
                        <option value="drink">{t('drink')}</option>
                        <option value="snacks">{t('snacks')}</option>
                        <option value="healthy_food">{t('healthy_food')}</option>
                    </select>
                </div>
                <div className="add-price flex-col">
                    <p>{t('price_dish')}</p>
                    <input
                        type="number"
                        name='price'
                        placeholder='79.000'
                        value={data.price}
                        onChange={onChangeHandler}
                    />
                    <p style={{marginTop: '8px', fontWeight: 'bold', color: '#e74c3c'}}>
                        {t('price')} {data.price ? Number(data.price).toLocaleString('vi-VN') + '₫' : '0₫'}
                    </p>
                </div>
            </div>
            <button type='submit' className='add-btn'>{t('add')}</button>
        </form>
    </div>
  )
}

export default Add