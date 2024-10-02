import axios from 'axios'
import { apiUrl, filesUrl } from 'constants/urls'
import { useEffect, useMemo, useRef, useState } from 'react'
import {createContext, useContextSelector} from 'use-context-selector'
import classes from '../../Orders.module.css'
import Input from 'components/tags/Input'
import {downloadCsv, formatDate, objectToCsv, slugify, translate } from 'utils/utils'
import { TableHead } from 'pages/Orders'
import Button from 'components/Button'
import { useBrowserContext } from 'store/browser-context'
import CustomCheckbox from 'components/CustomCheckBox'
import Select from 'components/tags/Select'
import DialogComponent from 'components/tags/Dialog'
import OptionsContainer from 'components/OptionsContainer'
import IconWithHover from 'components/IconWithHover'
import Loader from 'components/Loader'
import AddOrder from '../components/AddOrder'

const SearchBox=()=>{
    const searchText = useContextSelector(OrdersContext, state=>state.searchText)
    const defaultSearchText = useRef(searchText)
    const setSearchText = useContextSelector(OrdersContext, state=>state.setSearchText)
    const getOrders = useContextSelector(OrdersContext, state=>state.getOrders)
    const disabled = searchText.trim() == defaultSearchText.current.trim()
    const clickHandler=async(e)=>{
        e.preventDefault()
        const saveValue = defaultSearchText.current
        defaultSearchText.current = searchText
        const reponse = await getOrders()
        if (!reponse){
            defaultSearchText.current = saveValue
        }
    }
    return(
        <form onSubmit={clickHandler} className='d-f align-items-center justify-content-between g-3 w-100'>
            <button>
                <IconWithHover disabled={disabled} iconClass='fa-solid fa-search px-1 color-primary' />
            </button>
            <Input value={searchText} onChange={(value)=>setSearchText(value)} className={classes['search__input']} placeholder={translate('Client full name, phone number, product name or order ID ')} />
        </form>
    )
}

const dateList =[
    {
        id:'0',
        label: '',
    },
    {
        id:'1',
        label:  translate('1 day'),
    },
    {
        id:'2',
        label: translate('7 days'),
    },
    {
        id:'3',
        label: translate('1 month'),
    },
    {
        id:'4',
        label: translate('1 year'),
    },

]
const ordersPerPageList =[
    {
        id:'1',
        label: 10,
    },
    {
        id:'2',
        label: 20,
    },
    {
        id:'3',
        label: 50,
    },
    {
        id:'4',
        label: 100,
    },
]

const Filtration=()=>{
    const ordersParameters = useContextSelector(OrdersContext, state=>state.ordersParameters)
    const setOrdersParameters = useContextSelector(OrdersContext, state=>state.setOrdersParameters)
    const getOrders = useContextSelector(OrdersContext, state=>state.getOrders)

    const ordersPerPage = useRef(ordersParameters.ordersPerPage)
    const selectedDate = useRef(ordersParameters.selectedDate)

    const updateOrdersParameters=(value, id)=>{
        setOrdersParameters(ordersParameters=>({
            ...ordersParameters,
            [id]: value
        }))
    }
    const updateParamters=async()=>{ 
        ordersPerPage.current = ordersParameters.ordersPerPage
        selectedDate.current = ordersParameters.selectedDate 
        await getOrders()
    }

    let disabled = (ordersPerPage.current.id == ordersParameters.ordersPerPage.id) && 
    (selectedDate.current.id === ordersParameters.selectedDate.id)
    return(
        <div className='container p-2 mb-3 column g-3'>
            <table className={classes['filtration-table']}>
                <tbody>
                    <tr>
                        <td>
                            <h4>{ translate('Orders per page:') }</h4>
                        </td>
                        <td>
                            <div style={{width:120}}>
                                <Select options={ordersPerPageList} selectedOption={ordersParameters.ordersPerPage} onChange={(option)=>updateOrdersParameters(option, 'ordersPerPage')} />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <h4>{ translate('Date:') }</h4>
                        </td>  
                        <td>
                            <div style={{width:120}}>
                                <Select options={dateList} selectedOption={ordersParameters.selectedDate} onChange={(newDate)=>updateOrdersParameters(newDate, 'selectedDate')} />
                            </div>
                        </td>     
                    </tr>
                </tbody>
            </table>
            <Button disabled={disabled} onClick={updateParamters} className='mt-2'>{ translate('Update paramters') }</Button>
        </div>
    )
}

const OrdersContext = createContext({
    renderedOrders: [], 
    setRenderedOrders: ()=>{},
    statusList: [],
    blockedVisitors: [], 
    setBlockedVisitors: ()=>{},
    getOrders: async()=>{},
    deleteOrders : async()=>{},
    selectedOrders: [],
    toggleOrder: (orderId)=>{},
    deletingSelectedOrders: false
})

const defaultOrdersParameters = {
    ordersPerPage: ordersPerPageList[0],
    selectedDate:  dateList[0]
}

const fixedOrdersOptions=[
    {
        id: 1,
        label: translate('Select'),
        disabled: true
    },
    {
        id: 2,
        label: translate('Delete selected')
    },
    {
        id: 3,
        label: translate('Update status')
    },
    {
        id: 4,
        label: translate('Download as CSV')
    },
]
const OrdersContextProvider = ({children, abandoned})=>{
    const ordersOptions = useMemo(()=>{
        const list = abandoned ? fixedOrdersOptions : [...fixedOrdersOptions, {
            id: 5,
            label: translate('Send to shipping company')
        }]
        return list
    }, [])
    useEffect(()=>{
        document.documentElement.style.overflowY = 'scroll'
        return ()=>{
            document.documentElement.style.removeProperty('overflow-y')
        }
    }, [])
    const [loading, setloading] = useState(true)
    const [orders, setOrders] = useState([])
    const [renderedOrders, setRenderedOrders] = useState([])
    const [statusList, setStatusList] = useState(null)
    useEffect(()=>{
        setRenderedOrders(orders.map(order => ({
            ...order,
            detailsShown: false,
            showStatusList: false
        })))
    }, [orders])
    
    
    const [error, setError] = useState(false)    
    const [page, setPage] = useState(1)
    const [ordersParameters, setOrdersParameters] = useState(defaultOrdersParameters)
    const [searchText, setSearchText] = useState('')
    const getOrders=async()=>{
        setShowFiltration(false)
        setloading(true)
        setError(false)
        let linkExtention = ''
        linkExtention += '&orders_per_page=' + ordersParameters.ordersPerPage.label
        const searchTextTrimmed = searchText.trim()
        if(searchTextTrimmed) linkExtention+= '&search_text=' + searchTextTrimmed
        if (ordersParameters.selectedDate.label) linkExtention += '&date=' + slugify(ordersParameters.selectedDate.label)
        try{
            const {data} = await axios.get(apiUrl + `/orders/${ abandoned ? 'get-abandoned-orders' : 'get-orders' }?page=${ page }&store_id=${localStorage.getItem('storeId')}&status_list_fetched=${!!statusList}${linkExtention}`,  
            {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            setOrders(data['orders'])
            setNumPages(data.numPages)
            setHasNext(data.hasNext)
            setHasPrev(data.hasPrev)
            if (data.statusList){
                setStatusList(data.statusList)
            }
            setloading(false)
            setSelectedOrders([])
            return true
        }catch{
            setError(true)
            setloading(false)
            return false
        }   
    }

    useEffect(()=>{
        getOrders()
    },[page])

    const [numPages, setNumPages]= useState([])
    const [hasPrev, setHasPrev]=useState(false)
    const [hasNext, setHasNext]=useState(false)

    const [blockedVisitors, setBlockedVisitors] = useState([])

    const {setGlobalMessageA} = useBrowserContext()

    const deleteOrders = async(list, setLoading)=>{
        setLoading(true)
        try{
            const {data} = await axios.post(
                apiUrl + '/orders/delete-orders',
                {
                    store_id : localStorage.getItem('storeId'),
                    orders_ids: list
                },
                {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            const deletedOrdersId = data.ordersId
            setRenderedOrders(orders=>orders.filter(order=>!deletedOrdersId.includes(order.id)))
            setLoading(false)
            return true
        }catch(err){
            console.log(err)
            setLoading(false)
            return false
        }   
    }

    const changeOrderStatusBluk=async(status, ordersList, setloadingStatus)=>{
        setloadingStatus(true)
        try{
            await axios.post(
                apiUrl + '/orders/change-orders-status',
                {
                    orders_id: ordersList,
                    status_id: status.id,
                    store_id: localStorage.getItem('storeId')
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            setloadingStatus(false)
            return true
        }catch{
            setloadingStatus(false)
            return false
        }
    }

    const [selectedOrders, setSelectedOrders] = useState([])
    const toggleOrder=(orderId)=>{
        if(selectedOrders.includes(orderId)){
            setSelectedOrders(selectedOrders=>selectedOrders.filter(elem=> elem !== orderId))
        }else{
           setSelectedOrders(selectedOrders=>[...selectedOrders, orderId]) 
        }     
    }

    const allOrders = useMemo(()=>renderedOrders.map(order=>order.id), [renderedOrders])
    const toggleSelectAll=()=>{
        if (selectedOrders.length === allOrders.length){
            setSelectedOrders([])
            setSelectedOption(ordersOptions[0])
        }
        else{
            setSelectedOrders(allOrders)
        }
            
    }
    const [selectedOption, setSelectedOption] = useState(ordersOptions[0])
    const orderSelectChangeHandler=(op)=>{
        setSelectedOption(op)
        if (op.id === 2){
            deleteDalogRef.current.open()

        }
        else if (op.id === 3){
            updateBulkStatusDalogRef.current.open()

        }
        else if (op.id === 4){
            const serializedData = renderedOrders.filter(order=>selectedOrders.includes(order.id)).map(order=>{
                let variants = ''
                if(order.product.combination){
                    Object.entries(order.product.combination).forEach(([key, value], index)=>{
                        variants+=`${key}: ${value}; `
                    })
                }
                variants = variants || '/'
                const shippingCost = order.product.shipping_cost || 0
                return{
                    [translate('ID')]: order.id,
                    [translate('Client name')]: order.full_name,
                    [translate('Product title')]: order.product.title,
                    [translate('Ordering date')]: formatDate(order.created_at),
                    [translate('Phone number')]: order.phone_number,
                    [translate('Shipping to')]: order.shipping_to_home ? translate('Home') : translate('Office'),
                    [translate('Shipping state')]: order.shippingState,
                    [translate('Shipping city')]: order.shipping_to_home ? order.shippingCity : '/',
                    [translate('Status')]: order.status.text,
                    [translate('Quantity')]: order.product_quantity,
                    [translate('Total price')]: order.product.price * order.product_quantity + Number(shippingCost),
                    [translate('Variants')]: variants
                }})
            const csvData = objectToCsv(serializedData)
            downloadCsv(csvData, 'orders.csv')
        }
        setSelectedOption(ordersOptions[0])
    }
    const deleteDalogRef = useRef()
    const [deletingSelectedOrders, setDeletingSelectedOrders] = useState(false)
    const deleteSelectedOrders=async()=>{
        deleteDalogRef.current.close()
        const response = await deleteOrders(selectedOrders, setDeletingSelectedOrders)
        if (!response){
            setGlobalMessageA({
                children: translate('The orders you selected were not deleted'),
                color: 'red',
                time: 3000
            })
            return
        }
        setSelectedOrders([])
    }
    const updateBulkStatusDalogRef = useRef()
    const [upadtingBlukStatus, setUpdatingBlukStatus] = useState(false)
    const updateStatusSelectedOrders=async(status)=>{
        updateBulkStatusDalogRef.current.close()
        const response = await changeOrderStatusBluk(status, selectedOrders, setUpdatingBlukStatus)
        if (!response){
            setGlobalMessageA({
                children: translate('Error while updating statuses'),
                color: 'red',
                time: 3000
            })
            return
        }
        setRenderedOrders(renderedOrders=>renderedOrders.map(order=>{
            if(selectedOrders.includes(order.id)){
                return({
                    ...order,
                    status
                })
            }
            else {
                return order
            }
        }))
        setSelectedOrders([])
    }
    const [show, setShow] = useState(false)
    const [showFilteration, setShowFiltration] = useState(false)
    const defaultValue={
        renderedOrders, setRenderedOrders,
        statusList,
        blockedVisitors, setBlockedVisitors,
        getOrders,
        deleteOrders,
        selectedOrders,
        toggleOrder,
        deletingSelectedOrders: deletingSelectedOrders,
        changeOrderStatusBluk,
        ordersParameters, setOrdersParameters,
        searchText, setSearchText
    }
    return(
        <OrdersContext.Provider value={defaultValue}>
            <div className='p-2 flex-1 orders-table'>
                <div className={classes['orders__container']}>
                    <div className={classes['search__container']}>
                        <div className='d-f align-items-center justify-content-between g-3'>
                            <SearchBox/>
                            <IconWithHover iconClass='fa-solid fa-filter px-1 color-primary' onClick={()=>setShowFiltration(!showFilteration)} />
                        </div>
                    </div>
                    <DialogComponent open={showFilteration} close={()=>setShowFiltration(false)} >
                        <Filtration />
                    </DialogComponent>
                    <div className='py-2'>
                        <div className='w-100 d-f g-3'>
                            <Select  disabled={selectedOrders.length === 0} options={ordersOptions} selectedOption={selectedOption} onChange={orderSelectChangeHandler} containerStyle={{maxWidth: 380}} />
                            { !abandoned && <Button style={{whiteSpace: 'nowrap'}} className='d-f g-3 px-2' onClick={()=>setShow(true)}>
                                <i className='fa-solid fa-plus-square align-items-center' style={{fontSize: 24}} />
                                { translate('Add order') }
                            </Button>}
                            { show && 
                            <DialogComponent open={show} close={()=>setShow(false)} backDropPressCloses={false}>
                                <AddOrder/>
                            </DialogComponent>
                            }
                        </div>
                        
                        <DialogComponent
                            ref={deleteDalogRef}
                        >
                            <div className='container p-2 column g-4' style={{maxWidth: '80vw'}}>
                                <h4 style={{textAlign: 'start'}}>{translate('Are you sure you want to delete this option?')}</h4>
                                <div className='d-f justify-space-between'>
                                <Button outline onClick={deleteSelectedOrders}>Yes</Button>
                                <Button theme='dark' onClick={()=>deleteDalogRef.current.close()}>No</Button>
                                </div>
                            </div>
                        </DialogComponent>
                        <DialogComponent
                            ref={updateBulkStatusDalogRef}
                        >
                            <div style={{maxWidth: '80vw'}}>
                                <OptionsContainer scroll={false} position='relative' className='mt-2' show setShow={()=>{}} > 
                                    {
                                        statusList && statusList.map(status=>(
                                            <div disabled={upadtingBlukStatus} className={classes['status-list-container'] + ' d-f p-2 g-3'} key={status.id} onClick={()=>updateStatusSelectedOrders(status)}>
                                                <img width={30} src={filesUrl + status.icon} />
                                                <span>
                                                    { status.text }
                                                </span>
                                            </div>
                                        ))
                                    }
                                </OptionsContainer>
                            </div>
                        </DialogComponent>
                    </div>
                    <div className={"table-flex container p-relative"}>
                        <div>
                            <div className='table-row header'>
                                <div className='d-f table-cell'>
                                    { allOrders.length > 0 && <CustomCheckbox scale='0.8' onChange={toggleSelectAll} checked={selectedOrders.length === allOrders.length} />}
                                </div>
                                {<TableHead />}
                            </div>        
                        </div>
                        <div className={loading ? 'blur': undefined } style={{minHeight: 400}}>
                            {children}        
                        </div>  
                        {loading && 
                            <div style={{height: '100%', width: '100%', position: 'absolute', top:0, left:0}} className='d-f align-items-center justify-content-center'>
                                    <Loader diam={200}  />
                            </div>
                        }
                    </div>
                    { (hasNext || hasPrev) && 
                        <div disabled={loading} className='p-2 d-f g-3 justify-center' style={{alignItems: 'start'}}>
                            <Button disabled={!hasPrev} onClick={()=>{setPage(page-1)}}><i style={{fontSize: 22}} className='fa-solid fa-chevron-left py-1'/></Button>
                            <div className='d-f g-2 f-wrap justify-center'>
                                {Array.from({ length: numPages }, (_, i) => i).map(i=>(
                                    <Button key={i} outline={page === i+1} onClick={()=>{setPage(i + 1)}}>
                                        {i+1}
                                    </Button>
                                ))}
                            </div>
                            <Button disabled={!hasNext}  onClick={()=>{setPage(page+1)}}><i style={{fontSize: 22}} className='fa-solid fa-chevron-right py-1'/></Button>
                        </div>
                    }
                </div>
            </div>
        </OrdersContext.Provider>
    )
}

export default OrdersContextProvider
export {OrdersContext}