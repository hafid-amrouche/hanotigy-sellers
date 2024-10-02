import axios from 'axios'
import { apiUrl } from 'constants/urls'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {useContextSelector} from 'use-context-selector'
import classes from '../../Orders.module.css'
import { capitalizeFirstLetter, translate } from 'utils/utils'
import Button from 'components/Button'
import { useBrowserContext } from 'store/browser-context'
import Select from 'components/tags/Select'
import { useDialogContext } from 'components/tags/Dialog'
import IconWithHover from 'components/IconWithHover'
import Loader from 'components/Loader'
import Img from 'components/Img'
import Accordiant from 'components/Accordiant'
import { OrdersContext } from '../store/order-context'

import STT from '../../../json/state.json'

const homeShippingOptions=[
    {
        id: 1,
        label: translate('Home'),
    },
    {
        id: 2,
        label: translate('Office'),
    }
]


const States = STT.map(stt=>({...stt,
    label: stt.name
}))
 
States.push( {
    id: null,
    code: null,
    name: "------",
    name_ar: "------",
    label : '------'
},)

const defaultOrder={
    "product": {
        "price": 0,
        "shipping_cost": 0,
        "combination": null
    },
    "full_name": "",
    "phone_number": "",
    "shipping_state_id": 1,
    "product_quantity": 1,
    "shipping_to_home": true,
    "shipping_address": "",
    "client_note": "",
    "seller_note": "",
    "detailsShown": false,
    "showStatusList": false
}

const AddOrder=({order})=>{
    const {closeDialog} = useDialogContext()
    order = order || defaultOrder
    const setRenderedOrders= useContextSelector(OrdersContext, state=>state.setRenderedOrders)
    const [loading, setLoading] = useState(false)
    const [searchedProducts, setSearchedPRoducts] = useState({
        '': [] 
    }) 
    const [searchText, setSearchText] = useState('')
    const [disabled, setDisabled] = useState(true)
    const trimmed = useMemo(()=>searchText.trim(), [searchText])
    useMemo(()=>setDisabled(false), [trimmed])
    const searchedProductsBySearch = searchedProducts[trimmed]

    const searchProducts = async(e)=>{
        e?.preventDefault()
        setLoading(true)
        try{
            const trimmed = searchText.trim().toLowerCase()
            const response = await axios.get(
                apiUrl + `/product/get-user-products?search-text=${trimmed}&store_id=${localStorage.getItem('storeId')}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            setSearchedPRoducts(searchedProducts=>{
                const newSearchedProcts = {...searchedProducts}
                newSearchedProcts[searchText] = response.data 
                return newSearchedProcts
            })
            setDisabled(true)
        }catch(err){
            console.log(err)
            setDisabled(false)
        }
        setLoading(false)
    }
    const [selectedProduct, setSelectedProduct] = useState(order.id ? order.product : null)
    useEffect(()=>{
        if(!order.id) searchProducts()
    }, [])
    const [showSearch, setShowSearch] = useState(true)
    const [variants, setVariants] = useState(order.product.combination)
    const [loadingProductInfo, setLoadingProductInfo] = useState(false)
    const getProductVariants=async()=>{
        setLoadingProductInfo(true)
        try{
            const response = await axios.get(
                apiUrl + '/product/get-product-variants?product_id=' + selectedProduct.id,
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            setVariants(response.data.variants)
            setOrderData(orderData=>({
                ...orderData,
                price: response.data.price || 0,
            }))
        }catch(err){
            console.log(err)
        }
        setLoadingProductInfo(false)
    }
    useEffect(()=>{
        if(!order.id){
            if(selectedProduct){
                getProductVariants()
            }
            else{
                setVariants(null)
            }
        }
    }, [selectedProduct])
    
    ///////
    const [selectedState, setSelectedState] = useState(States.find(state=>state.id === order.shipping_state_id))
    const [cities, setCities] = useState([])
    const [city, setCity] = useState(null)
    const [orderData, setOrderData] = useState({
        price: order.product.price,
        quantity: order.product_quantity,
        fullName: order.full_name,
        phoneNumber: order.phone_number,
        shipping_address:  order.shipping_address,
        client_note:  order.client_note,
        seller_note:  order.seller_note,
        shippingCost: order.product.shipping_cost,
        shippingToHome: order.shipping_to_home
    })
    console.log(orderData)
    const upadteOrderData=(value, id)=>{
        setOrderData(orderData=>({
            ...orderData,
            [id]: value
        }))
    }
    const firstTimeDone = useRef(false)
    useEffect(()=>{
        const upadateCities = async()=>{
            let cities = await import(`../../../json/cities/${selectedState.id}.json`);
            cities = cities.default
            cities = cities.map(city=>({
                ...city,
                label : city.name.split('-')[1]
            }))
            setCities(cities)
            if( order.shipping_city_id && !firstTimeDone.current){
                const city = cities.find(city=>city.id === order.shipping_city_id)
                setCity(city)
                firstTimeDone.current = true
            }
            else{
                setCity(cities[0])
            }

                
        }
        if (selectedState.id) upadateCities()
        else{
            setCities([])
            setCity(null)
        }
    }, [selectedState])
    const {setGlobalMessageA} = useBrowserContext()
    const createOrder=async()=>{
        setloading(true)
        const data ={
            order_id : order.id || undefined,
            shipping_address: orderData.shipping_address,
            client_note: orderData.client_note,
            seller_note: orderData.seller_note,
            full_name: orderData.fullName,
            phone_number: orderData.phoneNumber,
            price: orderData.price,
            quantity: orderData.quantity,
            shipping_cost: orderData.shippingCost,
            shipping_to_home: orderData.shippingToHome,
            state_id: selectedState.id,
            city_id: city && city.id,
            variants,
            product_id: selectedProduct.id,
            title: selectedProduct.title,
            image: selectedProduct.image,
            store_id: localStorage.getItem('storeId')
        }
        try{
            const response =await axios.post(
                apiUrl + ( order.id ? '/orders/update-user-order' : '/orders/create-user-order'),
                {
                    ...data
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (order.id){
                setRenderedOrders((renderedOrders)=>{
                    const  newState = [...renderedOrders]
                    let selectedOrder = newState.find(order=>order.id === response.data.order.id)
                    Object.keys(selectedOrder).forEach(key => delete selectedOrder[key]);

                    Object.assign(selectedOrder, response.data.order);
                    return newState
                })
            }
            else{
                setRenderedOrders((renderedOrders)=>([
                    response.data.order
                    ,...renderedOrders
                ]))
            }
            setGlobalMessageA({
                children: order.id ? translate('Order updated successfully'):translate('Order created successfully'),
                time: 3000,
                color: 'var(--successColor)'
            })
            closeDialog()
        }catch (err){
            setGlobalMessageA({
                children: err.response.data.detail,
                time: 3000,
                color: 'red'
            })
        } 
        setloading(false)
    }
    const [laoding, setloading] = useState(false)
    console.log(selectedState)
    return( 
        <>
            <div className='p-2 container' style={{maxWidth: '90vw', width:1080, height: 'calc(100vh - 140px)', overflowY: 'auto'}}>
                <div className='column g-3'>
                    <div className='d-f align-items-center justify-content-between'>
                        <h4 className='color-primary'>{ translate('Product Info') }</h4>
                        <IconWithHover onClick={closeDialog} iconClass='fa-solid fa-xmark' />
                    </div>
                    
                    <div className='p-relative'>
                        { !selectedProduct && 
                            <>
                                <form onSubmit={searchProducts} className='d-f g-2 align-items-center mb-2'>
                                    <button><IconWithHover disabled={disabled} className='fa-solid fa-search px-1 color-primary' /></button>
                                    <input className='box-input' value={searchText} onChange={e=>setSearchText(e.target.value)} />
                                    <Accordiant checked={showSearch} setChecked={setShowSearch} />
                                </form>
                                { showSearch && 
                                    <div style={{position:'absolute', width: '100%', zIndex: 2}}>
                                        { searchedProductsBySearch.length > 0 && 
                                            <div className='container' style={{maxHeight: '40vh', overflowY: 'auto'}}>
                                                <div className='column'>
                                                    {
                                                        !loading && searchedProductsBySearch.map(product=>(
                                                            <div key={product.id} className={ classes['searched-product'] + ' d-f align-center g-3 p-1'} onClick={()=>setSelectedProduct(product)}>
                                                                <Img src={product.image} style={{objectFit: 'cover', height:40, width: 40, flexShrink: 0, borderRadius: 4}} />
                                                                <h4 className='cut-text'>{ product.title }</h4>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                {!loading && (searchedProductsBySearch.length === 0) && trimmed && !loading && <div  className='p-3 d-f justify-center'>
                                                        <h3>{translate('No product was found')}</h3>
                                                    </div>} 
                                            </div>}
                                        {loading && (
                                            <div className='p-3 d-f justify-content-center align-items-center container'  style={{height: '40vh'}}>
                                                <Loader diam={100} />
                                            </div>
                                        )} 
                                    </div>
                                }
                            </>
                        }
                        {
                            selectedProduct && <div className={' d-f align-center g-3 p-1'} >
                                <Img src={selectedProduct.image} style={{objectFit: 'cover', height:40, width: 40, flexShrink: 0, borderRadius: 4}} />
                                <h4 className='cut-text flex-1'>{ selectedProduct.title }</h4> 
                                { !order.id && <IconWithHover onClick={()=>setSelectedProduct(null)} iconClass='fa-solid fa-trash color-red' />}
                            </div>
                        }
                    </div>
                </div>
                {!loadingProductInfo && selectedProduct &&
                    <div>
                        <hr className='my-2'/>
                        <div className='d-f f-wrap g-3'>
                            {variants && Object.entries(variants).map(([key, value], index)=>{
                                
                                return (
                                    <Fragment key={index}>
                                        <div>
                                            <h4>
                                                { capitalizeFirstLetter(key) }
                                            </h4>
                                            <input className='box-input' value={variants[key]} onChange={(e)=>setVariants(variants=>({
                                                ...variants,
                                                [key]: e.target.value
                                            }))}/>
                                        </div>
                                    </Fragment>
                                )
                            })}
                            <div>
                                <h4>
                                    { capitalizeFirstLetter('Price') }
                                </h4>
                                <input type='number' className='box-input' onChange={e=>upadteOrderData(Number(e.target.value), 'price')} value={orderData.price}/>
                            </div>
                            <div>
                                <h4>
                                    { capitalizeFirstLetter('Quantity') }
                                </h4>
                                <input type='number' min={1} className='box-input' value={orderData.quantity} onChange={(e)=>upadteOrderData(Number(e.target.value), 'quantity')}/>
                            </div>

                        </div>
                    </div>
                }
                <div style={{display: (!loadingProductInfo && selectedProduct) ? undefined : 'none'}}>
                    <hr className='my-2'></hr>
                    <div className='g-3 column'>
                        <div className=' d-f f-wrap g-3'>
                            <div style={{maxWidth: 400, width:'100%'}}>
                                <h4>{ translate('Client full name') }</h4>
                                <input className='box-input' value={orderData.fullName} onChange={e=>upadteOrderData(e.target.value, 'fullName')} label={'Full name'} />
                            </div>
                            <div  style={{maxWidth: 400, width:'100%'}}>
                                <h4>{ translate('Client phone') }</h4>
                                <input disabled={orderData.phoneNumber='locked'} className='box-input' style={{maxWidth: 400}} value={orderData.phoneNumber} onChange={e=>upadteOrderData(e.target.value, 'phoneNumber')} label={'Phone number'} type='tel'/>
                            </div>
                        </div>
                        <div className=' d-f f-wrap g-3'>
                            <div style={{maxWidth: 400, width:'100%'}}>
                                <h4>{ translate('State') }</h4>
                                <Select label={ translate('States') } options={States} selectedOption={selectedState} onChange={state=>setSelectedState(state)} />
                            </div>
                            { city && <div  style={{maxWidth: 400, width:'100%'}}>
                                <h4>{ translate('City') }</h4>
                                
                                    <Select label={ translate('City') } options={cities} selectedOption={city} onChange={city=>setCity(city)} />
                               
                            </div> 
                            }
                        </div>

                        <div  style={{maxWidth: 400}}>
                            <h4>{ translate('Address') }</h4>
                            <textarea value={orderData.shipping_address} onChange={e=>upadteOrderData(e.target.value.trim(), 'shipping_address')} className='box-input'/>
                        </div>
                        <div  style={{maxWidth: 400}}>
                            <h4>{ translate('Client Note') }</h4>
                            <textarea value={orderData.client_note} onChange={e=>upadteOrderData(e.target.value.trim(), 'client_note')} className='box-input'/>
                        </div>
                        <div  style={{maxWidth: 400}}>
                            <h4>{ translate('Seller Note') }</h4>
                            <textarea value={orderData.seller_note} onChange={e=>upadteOrderData(e.target.value.trim(), 'seller_note')} className='box-input'/>
                        </div>
                        <div className='d-f g-3 f-wrap' style={{alignItems: 'flex-end'}}>
                            <div style={{maxWidth: 400, width:'100%'}}>
                                <h4>{ translate('Shipping to') }</h4>
                                <Select 
                                    options={homeShippingOptions}
                                    selectedOption={ homeShippingOptions[orderData.shippingToHome ? 0 : 1]}
                                    onChange={option=>upadteOrderData(option.id == 1, 'shippingToHome')}
                                />
                            </div>
                            <div style={{maxWidth: 400, width:'100%'}}>
                                <h4>{ translate('Shipping Cost') }</h4>
                                <input className='box-input' label={'Shipping cost'} type='number' value={orderData.shippingCost || 0} min={0} onChange={e=>upadteOrderData(Number(e.target.value), 'shippingCost')} />
                            </div>
                        </div>
                        <hr/>
                        <div className='d-f g-3 align-items-center justify-content-center'>
                            <h3 style={{whiteSpace: 'nowrap'}}>{ translate('Total price:') }</h3>
                            <h3 className='primary-color'>{(orderData.price || 0) * orderData.quantity + (orderData.shippingCost || 0)}</h3>
                        </div>
                        <div style={{height: 60}}/>
                        <Button className='d-f g-3' onClick={createOrder}>
                            { order.id ? translate('Update order') : translate('Create order') }
                            {laoding && <Loader diam={28} />}
                        </Button>
                    </div>
                </div>
                { loadingProductInfo &&
                    <div className='d-f align-items-center justify-content-center' style={{height: 300}}>
                        <Loader diam={100} />
                    </div>
                }
            </div>
        </>
        
    )
}

export default AddOrder