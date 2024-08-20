import React, { useEffect, useRef, useState } from 'react'
import classes from './general.module.css'
import classes2 from './Products.module.css'
import { translate } from 'utils/utils'
import axios from 'axios'
import { apiUrl } from 'constants/urls'
import Button from 'components/Button'
import IconWithHover from 'components/IconWithHover'
import { useUserContext } from 'store/user-context'
import { Link } from 'react-router-dom'
import { useBrowserContext } from 'store/browser-context'
import OptionsContainer from 'components/OptionsContainer'
import Loader from 'components/Loader'
import DialogComponent from 'components/tags/Dialog'

const ProductCard = ({product, setProducts})=>{
    const {userData} = useUserContext()
    const [active, setActive] = useState(product.active)
    const [activating, setActivating] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const {setGlobalMessageA} = useBrowserContext()

    const toggleProductState=()=>{
        setActivating(true)
        axios.post(
            apiUrl + '/product/toggle-product-state',
            {
                product_id : product.id
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        ).then(response=>{
            setActivating(false)
            setActive(response.data.active)
        }).catch(err=>{
            setActivating(false)
            console.log(err)
        })
    }
    const deleteProduct=()=>{
        setShow(true)
        dialogRef.current.close()
        setDeleting(true)
        axios.post(
            apiUrl + '/product/delete-product',
            {
                product_id : product.id
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        ).then(response=>{
            setDeleting(false)
            setGlobalMessageA({
                children : translate('Your product was deleted successfully'),
                color : 'var(--successColor)',
                time: 3000
            })
            setShow(false)
            setProducts(products=> products.filter(p=>p.id !== product.id))
        }).catch(err=>{
            setGlobalMessageA({
                children : translate('Your product was not deleted'),
                color : 'red',
                time: 3000
            })
            setDeleting(false)
        })
    }
    const [show, setShow] = useState(false)
    const dialogRef = useRef()
    return(
        <div className={ classes2['product-card'] + ' container p-2 d-f g-3'}>
            <div className={classes2['product-card__image']} style={{
                backgroundImage: `url(${product.image || userData.storeLogo})`,
            }} />
            <div className='column g-2 flex-1'>
            <h3 >{  product.title }</h3>
                { product.quantity !== null &&  <p className='no-break'>{product.quantity} {translate('Pieces')} </p>}
                { product.price !== null && <h4 className='color-primary'> {product.price} {translate('DA')} </h4> }
                <div className='d-f g-2 align-center color-primary'>
                    <h4>{ product.views }</h4>
                    <i className='fa-solid fa-eye' style={{fontSize: 12}}></i>
                </div>
            </div>
            <div className='column justify-space-between p-relative'>
                <div >
                    <OptionsContainer show={show} setShow={setShow} 
                        alwaysShown={ <IconWithHover iconClass='fa-solid fa-ellipsis px-2' size={28} onClick={()=>setShow(show=>!show)}/> }
                    >
                        <div className='d-f g-3 color-red px-4 p-3 scale-on-hover' onClick={()=>dialogRef.current.open()} >
                            <i className='fa-solid fa-trash' style={{fontSize: 22}} />
                            <h4 className='flex-1'>{ translate('Delete') }</h4>
                            { deleting && <Loader color='red'  diam={22} />}
                        </div>
                        <Link to={String(product.id)} className='color-primary d-f g-3 color-primary p-3 scale-on-hover'>
                            <i className='fa-solid fa-edit' style={{fontSize: 22}} /> 
                            <h4>{ translate('Edit') }</h4> 
                        </Link>
                            <Link target='_blank' onClick={()=>setShow(false)} to={`http://${userData.storeDomain}/products/${product.slug}/${product.id}`}  className='scale-on-hover color-primary d-f g-3 p-3'>{/* after developement */}
                            <i className='fa-solid fa-eye' style={{fontSize: 22}} />
                            <h4>{ translate('View') }</h4>
                        </Link>
                    </OptionsContainer>
                    <DialogComponent
                        ref={dialogRef}
                    >
                        <div className='container p-2 column g-4' style={{maxWidth: '80vw'}}>
                            <h4 style={{textAlign: 'start'}}>{translate('Are you sure you want to delete this option?')}</h4>
                            <div className='d-f justify-space-between'>
                            <Button outline onClick={deleteProduct}>Yes</Button>
                            <Button theme='dark' onClick={()=>dialogRef.current.close()}>No</Button>
                            </div>
                        </div>
                    </DialogComponent>
                </div>
                <div className='d-f align-center' style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0
                }}>
                    <h4>{ active ? translate('Deactivate') : translate('Activate') }</h4>
                    <input disabled={activating} onClick={toggleProductState} style={{scale: '0.8'}} checked={active} onChange={(e)=>setActive(e.target.checked)} type='checkbox' />
                </div>
            </div>
        </div>
    )
}

const Products = () => {
    const [products, setProducts] = useState(null)
    const [loading, setloading] = useState(true)
    const [error, setError] = useState(false)
    const [page, setPage] = useState(1)
    const [numPages, setNumPages]= useState([])
    const [hasPrev, setHasPrev]=useState(false)
    const [hasNext, setHasNext]=useState(false)
    const {userData} = useUserContext()
    
    const getProducts=()=>{
        setError(null)
        setloading(true)
        axios.post(
            apiUrl + '/product/get-products-for-seller',
            {
                page,
                store_id: userData.storeId
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        ).then(response=>{
            setProducts(response.data.products)
            setNumPages(response.data.numPages)
            setHasNext(response.data.hasNext)
            setHasPrev(response.data.hasPrev)
            setloading(false)
        }).catch(error=>{
            console.log(error)
            setError(error)
            setloading(false)
        })
    }
    useEffect(()=>{
        getProducts()
    }, [page])
  return (
    <div className={classes['container']}>
        <div className={classes['card'] + ' d-f gap-3 column'}>
            <h3 className='color-primary'>{ translate('Products') }</h3>
            {!loading && products && <>
                <Link to={'add'} className='flex-1 d-f px-1'>
                    <Button className='flex-1'>
                        <i className='fa-solid fa-plus-square' style={{fontSize: 22}} />
                        <h4>{ translate('Add product') }</h4>
                    </Button>
                </Link>
                {<div className={'column g-2 ' + classes2['font-family'] }>
                    { products.map(product=><ProductCard key={product.id} product={product} setProducts={setProducts} />) }
                </div>}
                { (hasNext || hasPrev) && <div className='p-2 d-f g-3 justify-center' style={{alignItems: 'start'}}>
                    <Button disabled={!hasPrev} onClick={()=>{setPage(page-1)}}><IconWithHover size={22} iconClass='fa-solid fa-chevron-left py-1'/></Button>
                    <div className='d-f g-2 f-wrap justify-center'>
                        {Array.from({ length: numPages }, (_, i) => i).map(i=>(
                            <Button key={i} outline={page === i+1} onClick={()=>{setPage(i + 1)}}>
                                {i+1}
                            </Button>
                        ))}
                    </div>
                    <Button disabled={!hasNext}  onClick={()=>{setPage(page+1)}}><IconWithHover size={22} iconClass='fa-solid fa-chevron-right py-1'/></Button>
                </div>}
            </>
            }
            {
                loading && <div className='p-3 d-f align-center justify-center'>
                    <Loader diam={100} />
                </div>
            }
            { !loading && error &&
                <div className='p-3 column align-center justify-center'>
                    <h2 className='color-red'>{ translate('Reload') }</h2>
                    <IconWithHover size={60} iconClass='fa-solid fa-rotate-right color-red' onClick={getProducts} />
                </div>
            }
        </div>
    </div>
  )
}

export default Products