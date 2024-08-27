import React, { Fragment, useEffect, useRef, useState } from 'react'
import './Orders.css'
import classes from './Orders.module.css'
import IconWithHover from '../components/IconWithHover'
import { capitalizeFirstLetter, TimeElapsed, translate } from '../utils/utils'
import axios from 'axios'
import {apiUrl, filesUrl} from '../constants/urls'
import Accordiant from 'components/Accordiant'
import OptionsContainer from 'components/OptionsContainer'
import Button from 'components/Button'
import Loader from 'components/Loader'
import { useBrowserContext } from 'store/browser-context'
import OrdersContextProvider, { OrdersContext } from './orders/store/order-context'
import { useContextSelector } from 'use-context-selector'
import { AnimatePresence } from 'framer-motion'
import MotionItem from 'components/Motionitem'
import CustomCheckbox from 'components/CustomCheckBox'
import Img from 'components/Img'
import DialogComponent from 'components/tags/Dialog'
import { Link } from 'react-router-dom'
import AddOrder from './orders/components/AddOrder'

export const TableHead = ()=>(
    <>
        <div className={'table-cell ' + classes['never-vanish']}>Product</div>
        <div className={'table-cell ' + classes['never-vanish']}>Number</div>
        <div className={'table-cell ' + classes['never-vanish']}>Status</div>
        <div className={classes['td-third'] + ' table-cell'}>{translate('Total')} ({ translate('DA') })</div>
        <div className={classes['td-forth'] + ' table-cell'}>Full name</div>
        <div className={classes['td-second'] + ' table-cell'}>State</div>
        <div className={classes['td-s-type']+ ' table-cell'}>Commune</div>
        <div className={classes['td-first'] +' text-center table-cell'}>{translate('Qnty')}</div>
        <div className={classes['td-zero']+ ' table-cell'}>Date</div>
        <div className={classes['td-variants']+ ' table-cell'}>{translate('Variants')}</div>
        <div className='table-cell'></div>
    </>
)


const OrderTr=({order, abandoned})=>{
    const blockedVisitors = useContextSelector(OrdersContext, state=>state.blockedVisitors)
    const statusList = useContextSelector(OrdersContext, state=>state.statusList)
    const setBlockedVisitors = useContextSelector(OrdersContext, state=>state.setBlockedVisitors)
    const changeOrderStatusBluk = useContextSelector(OrdersContext, state=>state.changeOrderStatusBluk) 

    const [visitor, setVisitor] = useState(null)

    const [showContainer, setShowContainer] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [status, setStatus] = useState(order.status)

    const [loadingStatus, setloadingStatus] = useState(false)
    const changeOrderStatus=async(status)=>{
        const response = await changeOrderStatusBluk(status, [order.id], setloadingStatus)
        if (response){
            setStatus(status)
            setShowContainer(false)
        }
    }

    const [loadingDetails, setLoadingDetails] = useState(true)
    const fetchOrderDetails=async()=>{
        setLoadingDetails(true)
        try{
            const {data} = await axios.get(apiUrl + `/orders/${ abandoned ? 'get-abandoned-order' :  'get-order'}?id=${order.id}&store_id=${localStorage.getItem('storeId')}`,  
            {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            setVisitor(data.order.visitor)
            setVisitorBlocked(data.order.visitor.blocked)
            setLoadingDetails(false)
        }catch(err){
            console.log(err)
            setShowDetails(false)
            setLoadingDetails(true)
            setGlobalMessageA({
                children: translate(`A problem accured while fetching the order details`),
                color: 'red',
                time: 3000
            })
        }
            
    }

    useEffect(()=>{
        if (showDetails && loadingDetails) fetchOrderDetails()
    }, [showDetails])

    const {setGlobalMessageA} = useBrowserContext()

    const [blockingVisitor, setBlockingVisitor] = useState(visitor?.blocked)
    const [visitorBlocked, setVisitorBlocked] = useState(false)
    useEffect(()=>{
        if (visitorBlocked){
            if (!blockedVisitors.includes(visitor?.id)) {
                setBlockedVisitors(trackers=>{
                    const newTrackers = [...trackers]
                    newTrackers.push(visitor.id)
                    return newTrackers
                })
            }
        }    
        else {
            if (blockedVisitors.includes(visitor?.id)) {
                setBlockedVisitors(trackers=>trackers.filter(elem =>elem !== visitor.id))
            }
                
        }   
    }, [visitorBlocked]) 

    useEffect(()=>{
        if (blockedVisitors.includes(visitor?.id)) {
            if (!visitorBlocked) setVisitorBlocked(true)
        }
        else {
            if (visitorBlocked) setVisitorBlocked(false)
        }
    }, [blockedVisitors])

    const toggleVisitor=()=>{
        setBlockingVisitor(true)
        axios.post(
            apiUrl + (visitorBlocked ? '/store/unblock-visitor' :  '/store/block-visitor'),
            {
                store_id: localStorage.getItem('storeId'),
                id: visitor.id
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        )
        .then(response=>{
            const blocked = response.data.blocked
            setVisitorBlocked(blocked)
            setBlockingVisitor(false)
            setGlobalMessageA({
                children: blocked ? translate('Visitor with token "{tracker}" is blocked', {tracker: visitor.tracker.slice(0, 10) + '...'}) : translate('Visitor with token "{tracker}" is not blocked anymore', {tracker: visitor.tracker.slice(0, 10) + '...'}),
                color: 'var(--successColor)',
                time: 2000
            })
        })
        .catch(error=>{
            console.log(error)
            setBlockingVisitor(false)
        })
    }

    const shippingCost = order.product.shipping_cost || 0
    const totalPrice = order.product.price * order.product_quantity + shippingCost

    const  toggleOrder  = useContextSelector(OrdersContext, state=>state.toggleOrder)
    const selectedOrders = useContextSelector(OrdersContext, state=>state.selectedOrders)
    const dialogRef = useRef()

    const [deleting, setDeleting] = useState(false)
    const deleteOrders = useContextSelector(OrdersContext, state=>state.deleteOrders)
    const deleteOrder =async ()=>{
        setShow(true)
        dialogRef.current.close()
        const reponse  = await deleteOrders([order.id], setDeleting)
        if (reponse){
            setGlobalMessageA({
                children: translate(`Order deleted succefully`),
                color: 'var(--successColor)',
                time: 2000
            })
        }
        else{
            setGlobalMessageA({
                children: translate(`A problem accured while deleting the order`),
                color: 'red',
                time: 2000
            })
        }
    }
    const [show, setShow] = useState(false)
    const deletingSelectedOrders  = useContextSelector(OrdersContext, state=>state.deletingSelectedOrders)

    const [showAdd, setShowAdd] = useState(false)

    const setRenderedOrders  = useContextSelector(OrdersContext, state=>state.setRenderedOrders)
    const [loadingPhoneNumber, setloadingPhoneNumber] = useState(false)
    const revelPhoneNumber=()=>{
        setloadingPhoneNumber(true)
        axios.post(
            apiUrl + '/orders/reveal-phone-number',
            {
                order_id: order.id,
                store_id: localStorage.getItem('storeId')
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        ).then(response=>{
            // decrease points
            setRenderedOrders((renderedOrders)=>{
                const  newState = [...renderedOrders]
                let selectedOrder = newState.find(elem=>elem.id === order.id)
                selectedOrder.phone_number = response.data.phone_number
                return newState
            })
            setloadingPhoneNumber(false)
        }).catch(err=>{
            setloadingPhoneNumber(false)
            setGlobalMessageA({
                color: 'red',
                time: 3000,
                children: translate('Erro while getting the phone number')
            })
        })
    }

    const phoneNumberContent= <>{
        order.phone_number ==='locked' ?
            <button disabled={loadingPhoneNumber} className='color-primary p-relative' onClick={revelPhoneNumber}>
                <h4 className='blur-3'>0000000000</h4>
                <IconWithHover style={{position: 'absolute'}} iconClass='fa-solid fa-lock' />
            </button>:
            <Link to={'tel:' + order.phone_number} className='color-primary'>
                <h4>{ order.phone_number }</h4>
            </Link>
    }</>
    
    // if (order.id == 137) console.log(order)
    return(
        <div className={((deletingSelectedOrders && selectedOrders.includes(order.id)) ? ' blur' : '')}>
            <div className='table-row'>
                <div className='d-f table-cell'>
                    <CustomCheckbox scale={'0.8'} onChange={()=>{toggleOrder(order.id)}} checked={selectedOrders.includes(order.id)} />
                </div>
                <div className={'d-f justify-center table-cell ' + classes['never-vanish']}>
                    <Img src={order.product.image} style={{objectFit: 'cover', borderRadius: 4}} height={36} width={36} />
                </div>
                <div className={'table-cell ' + classes['never-vanish']}>
                    {phoneNumberContent}
                </div>
                <div className={classes['td-fifth']+' table-cell ' + classes['never-vanish']}>
                    <div className='d-f align-center justify-center'>
                    <div>
                        <OptionsContainer style={{right: -40}} className='mt-2' show={showContainer} setShow={setShowContainer} 
                            alwaysShown={ 
                                <div onClick={()=>setShowContainer(!showContainer)}>
                                    {status ? 
                                        <button className='scale-on-hover scale-2'><Img width={30} src={filesUrl + status.icon} /></button>
                                    : <IconWithHover iconClass='fa-solid fa-plus-square' color='var(--greyColor)' />
                                    }
                                </div>
                            }
                        > 
                            {
                            statusList.map(status=>(
                                <div disabled={loadingStatus} className={classes['status-list-container'] + ' d-f p-2 g-3'} key={status.id} onClick={()=>changeOrderStatus(status)}>
                                    <Img width={30} src={filesUrl + status.icon} />
                                    <span>
                                        { status.text }
                                    </span>
                                </div>
                            ))
                            }
                        </OptionsContainer>
                    </div>
                    </div>
                </div>
                <div className={classes['td-third'] + ' table-cell'}>{ totalPrice }</div>
                <div className={'table-cell ' + classes['td-forth']}><h4>{ order.full_name }</h4></div>
                <div className={classes['td-second'] + ' table-cell ' + classes['smaller']}>{ order.shippingState }</div>
                <div className={classes['td-s-type'] + ' table-cell '}>
                    {
                        order.shipping_to_home ? <h4 className={classes['smaller']}>{order.shippingCity}</h4> : <div className='d-f align-items-center justify-content-center g-2 color-primary'>
                            <i className={'fa-solid fa-building ' + classes['smaller']}></i>
                            <h4>{ translate('Office')}</h4>
                        </div>
                    }
                </div>
                <div className={classes['td-first'] + ' text-center table-cell'}>{ order.product_quantity }</div>
                <div className={classes['td-zero'] + ' table-cell ' + classes['smaller']}>{ TimeElapsed(order.created_at) }</div>
                <div className={classes['td-variants'] + ' table-cell d-f f-wrap g-3 flex-1'} style={{marginInlineEnd: 12}}>{
                    order.product.combination && Object.entries(order.product.combination).map(([key, value], index)=>(
                        <Fragment key={index}>
                                { index !== 0  && <strong>|</strong>}
                                <div className='d-f g-2'>
                                    <h4>{ capitalizeFirstLetter(key) }:</h4>
                                    <h4 className='color-primary'>{ value }</h4>
                                </div>
                        </Fragment>
                            
                    ))
                    
                }</div>
                <div className='table-cell d-f justify-content-between' style={{paddingInlineEnd: 6}}>
                    <div>
                        <OptionsContainer show={show} setShow={setShow} alwaysShown={
                                <IconWithHover iconClass='fa-solid fa-edit' onClick={()=>setShow(!show)} />
                            }>
                                <div className='d-f g-2 align-items-center px-3 p-2' onClick={()=>{setShowAdd(true); setShow(false)}}>
                                    <i className='fa-solid fa-edit' />
                                    <h4>{ translate('Edit') }</h4>
                                </div>
                                <div className='d-f g-2 align-items-center justify-content-between px-3 p-2' onClick={()=>dialogRef.current.open()}>
                                    <div className='d-f g-2 align-items-center'>
                                        <i className='fa-solid fa-trash' />
                                        <h4>{ translate('Delete') }</h4>
                                    </div>
                                { deleting &&  <Loader diam={22} />}
                                </div>
                        </OptionsContainer>
                        <div  style={{textAlign: 'start'}} >
                            <DialogComponent  open={showAdd} close={()=>{setShowAdd(false)}} backDropPressCloses={false} >
                                <AddOrder order={order} />
                            </DialogComponent>
                        </div>
                            
                    </div>
                    <Accordiant size={10} style={{ backgroundColor: 'var(--primaryColor)', padding: 4, borderRadius: 16, color: 'var(--backgroundColor)' }} checked={showDetails} setChecked={setShowDetails} />
                    <DialogComponent
                        ref={dialogRef}
                    >
                        <div className='container p-2 column g-4' style={{maxWidth: '80vw'}}>
                            <h4 style={{textAlign: 'start'}}>{translate('Are you sure you want to delete this option?')}</h4>
                            <div className='d-f justify-space-between'>
                            <Button outline onClick={deleteOrder}>Yes</Button>
                            <Button theme='dark' onClick={()=>dialogRef.current.close()}>No</Button>
                            </div>
                        </div>
                    </DialogComponent>
                </div>
            </div>
            { showDetails && <div className='col-12' >
                <>
                    <hr className='container' />
                    <div className=' p-2 column'>
                        <div className='d-f align-items-center justify-content-between'>
                            <h3 className='p-1'>{ translate('Order details') }:</h3>    
                            <IconWithHover size={24} onClick={()=>setShowDetails(false)}  iconClass='fa-solid fa-xmark' />
                        </div>
                        <div className='d-flex flex-wrap'>
                            <div className='col-12 col-md-6 g-3 column p-1'>
                                <div>
                                    <div className='container p-2 py-0'>
                                        <h4 className='mb-2'>{ translate('Order id') }: <span className='color-primary'>#{ order.id }</span></h4>
                                        <div className='d-f g-3  align-center mb-2'>
                                            <Img src={order.product.image} alt='' className='flex-shrink-0' style={{objectFit: 'cover', borderRadius: 4}} height={36} width={36} />
                                            <div style={{height: 42, width: '100%', position: 'relative'}}>
                                                <h4 style={{position: 'absolute'}} className='color-primary lh-1 break-line w-100' >{ order.product.title }</h4>
                                            </div>
                                        </div>
                                        {
                                            order.product.combination && Object.entries(order.product.combination).map(([key, value], index)=>(
                                                <Fragment key={index}>
                                                    <div className='px-1 d-f g-3 justify-space-between'  >
                                                        <h4>{ capitalizeFirstLetter(key) }:</h4>
                                                        <h4 className='color-primary'>{ value }</h4>
                                                    </div>
                                                </Fragment>
                                            ))
                                        }                              
                                    </div>
                                </div>
                                <div>
                                    <div className='container p-1 h-100'>
                                        <div className='px-1 d-f g-3 justify-space-between' >
                                            <h4>{ translate('Shipping') }:</h4>
                                            <h4 className='color-primary'>{ order.shipping_to_home ? 
                                                
                                                <><i className='fa-solid fa-home'/>  {translate('Home')}</>
                                                : 
                                                <><i className='fa-solid fa-building'/>  {translate('Office')}</> 
                                                }</h4>
                                        </div>
                                        <div className='px-1 d-f g-3 justify-space-between' >
                                            <h4>{ translate('Product cost') }:</h4>
                                            <h4 className='color-primary'>{ order.product.price  } {translate('DA')}</h4>
                                        </div>
                                        <div className='px-1 d-f g-3 justify-space-between' >
                                            <h4>{ translate('Quantity') }:</h4>
                                            <h4 className='color-primary'>{ order.product_quantity }</h4>
                                        </div> 
                                        <div className='px-1 d-f g-3 justify-space-between' >
                                            <h4>{ translate('Shipping cost') }:</h4>
                                            <h4 className='color-primary'>{ shippingCost } {translate('DA')}</h4>
                                        </div>
                                        <div className='px-1 d-f g-3 my-2 justify-space-between' >
                                            <h4>{ translate('Total price') }:</h4>
                                            <h3 className='color-primary'>{ totalPrice } {translate('DA')}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 col-md-6 p-1'>
                                <div className='container p-1 h-100'>
                                    <div className='px-1 d-f g-3 justify-space-between' >
                                            <h4>{ translate('Full  name') }:</h4>
                                            <h4 className='color-primary'>{ order.full_name}</h4>
                                    </div>
                                    <div className='px-1 d-f g-3 justify-space-between align-items-center' >
                                        <h4>{ translate('Phone number') }:</h4>
                                        {phoneNumberContent}

                                    </div>
                                    <div className='px-1' >
                                        <h4>{ translate('Address') }:</h4>
                                        <h4 className='p-1 color-primary break-line container'>{ order.shippingState }, {order.shippingCity}{ order.shipping_address ? `, ${order.shipping_address}`: '' }</h4>
                                        
                                    </div>  
                                    { order.client_note && <div className='px-1' >
                                        <h4>{ translate('Client note') }:</h4>

                                        <h4 className='p-1 color-primary break-line container'>{ order.client_note }</h4>
                                        
                                    </div> }
                                    { order.seller_note && <div className='px-1' >
                                        <h4>{ translate('Seller note') }:</h4>
                                        <h4 className='p-1 color-primary break-line container'>{ order.seller_note }</h4>
                                        
                                    </div> }
                                    {visitor && visitor.tracker && <div className='column g-3 p-1'>
                                        <h4>{ translate('Client Token') }:</h4>
                                        <div className='p-relative' style={{height: 68}}>
                                            <h4 style={{position: 'absolute'}} className='color-primary p-1 break-line w-100 container' > { visitor.tracker } </h4>
                                        </div>

                                        
                                        <h4>{ translate('IP Addresses') }:</h4>
                                        <div className='d-flex flex-wrap gap-3'>
                                            { visitor.ip_adresses.map((address, index)=>(
                                                <h4 className='container px-2' key={index}>{ address.ip_address }</h4>
                                            ))}
                                        </div>
                                        <Button onClick={toggleVisitor} theme={ visitorBlocked ? 'dark' : 'red'} className='col-12 d-f g-3'>
                                            <h4 >{ visitorBlocked ? translate('Unblock visitor') : translate('Block Visitor')}</h4>
                                            { blockingVisitor && <Loader diam={22} color={'red'} /> }
                                        </Button>
                                    </div>}
                                </div>
                            </div>
                        </div>  
                    </div>
                </>
            </div>} 
        </div>
    )
}

const InnerOrders = ({abandoned}) => {
    const renderedOrders = useContextSelector(OrdersContext, state=>state.renderedOrders)
    console.log(renderedOrders[0])
    return (
        <AnimatePresence >
            {
                renderedOrders && renderedOrders.map(order=>(
                    <MotionItem className={classes['order'] + (order.made_by_seller ? ` ${classes['primary-to-success']}` : '')} key={order.id}>
                        <OrderTr abandoned={abandoned} order={order} />
                    </MotionItem>
                        
                ))
            }
        </AnimatePresence>      
    )
}

const Orders  = ({abandoned})=>{

    return(
        <OrdersContextProvider abandoned={abandoned}>
            <InnerOrders abandoned={abandoned}/>
        </OrdersContextProvider>
    )
}

export default Orders