import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { translate } from 'utils/utils'
import IconWithHover from 'components/IconWithHover'
import classes from './RelatedProducts.module.css'
import { Reorder } from "framer-motion";
import useScrollToTop from 'hooks/useScrollToTop';
import { ReorderItem } from 'components/ReorderItem';
import axios from 'axios';
import { apiUrl } from 'constants/urls';
import Loader from '../../components/Loader'
import { useContextSelector } from 'use-context-selector';
import { AddProductContext } from './store/add-product-context';
import { useUserContext } from 'store/user-context';
import Accordiant from 'components/Accordiant';


  


const RelatedProducts = forwardRef((props, ref) => {
    const defaultSelectedProducts = useContextSelector(AddProductContext, state=>state.productInfo.relatedProducts)
    const [selectedProducts, setSelecetdProducts] = useState(defaultSelectedProducts)
    const [searchedProducts, setSearchedPRoducts] = useState({
        '': []
    }) 
    const [searchText, setSearchedText] = useState('')
    const trimmed = searchText.trim()
    const searchedProductsBySearch = searchedProducts[trimmed]?.filter(product=> !selectedProducts.map(p=>p.id).includes(product.id))
    const selectProduct=(id)=>{
        setSelecetdProducts(state=>{
            const newProduct = searchedProductsBySearch.find(product=>product.id === id)
            newProduct.reverseOrder = state.length + 1
            return [newProduct, ...state]
        })
    }

    const unselectProduct=(id)=>{
        setSelecetdProducts(state=>{
            return [...state].filter(product=> product.id !== id)
        })
    }
    
    const defaultSelectedAll = useContextSelector(AddProductContext, state=>state.productInfo.allProductsRelated)
    const [selectAll, seSelectAll] = useState(defaultSelectedAll)

    const [show, setShow] = useState(selectedProducts.length > 0 || selectAll)
    useScrollToTop(show, '#related-products-section', 70)

    const [loading, setLoading] = useState(false)
    const searchProducts = async()=>{
        setLoading(true)
        try{
            const trimmed = searchText.trim().toLowerCase()
            const response = await axios.get(
                apiUrl + `/product/get-user-products?search-text=${trimmed}&store_id=${localStorage.getItem('storeId')}&exclude=${localStorage.productId}` ,
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
        }catch(err){
            console.log(err)
        }
        setLoading(false)
    }

    useEffect(()=>{
        const result = searchedProducts[searchText.trim()]
        if (!result && (selectedProducts.length < 20)){
            searchProducts()
        }
    }, [searchText])

    useImperativeHandle(ref, ()=>({
        relatedProductsData: show ?{
            allProductsRelated: selectAll,
            relatedProducts: selectAll ? undefined : selectedProducts.map(elem=>elem.id)
        }: {}
    }))
    
    const {userData} = useUserContext()
  return (
    <div  className='column g-3 container m-3 p-2'  id='related-products-section'>
        <div className='d-f g-3 align-center cursor-pointer' onClick={()=>setShow(!show)}>
            <Accordiant checked={show} setChecked={()=>{}} />
            <h3 className='color-primary'>{ translate('Related products') }</h3>
        </div>
        { show &&
            <>
            <hr></hr>
                <div className={'g-4 column no-select container p-2 flex-1'} style={{maxWidth: 600, margin: 'auto', width: '100%'}}>
                    <div className='d-f g-3 align-center justify-space-between f-wrap'>
                        <h4 className='color-primary px-2'>{ 
                            selectAll ? translate('All products are related') : (
                                selectedProducts.length > 0 ? ( selectedProducts.length + translate(' products are selected')) : (
                                    translate('No product is related')
                                )
                            )
                        }</h4>
                        <div className='d-f align-center g-1'>
                            <input style={{scale: '0.7'}} type='checkbox' checked={selectAll} onChange={(e)=>seSelectAll(e.target.checked)} />
                            <h4>{translate('Select all last 20 products')}</h4>
                        </div>
                    </div>
                    { !selectAll && <>
                            { selectedProducts.length > 0 && 
                                <div className='p-2 column container reorder-item'>
                                    <Reorder.Group axis="y" onReorder={setSelecetdProducts} values={selectedProducts}>
                                        {selectedProducts.map(product=>
                                            <ReorderItem item={product} key={product.id}  >
                                                <div className={ classes['searched-item'] + ' d-f align-center g-3 p-2 cursor-move ' + classes['selected']}>
                                                    <div 
                                                        className={classes['search-product__image'] + ' container'} 
                                                        style={{
                                                            backgroundImage: `url(${product.image || userData.storeLogo})`,
                                                        }}    
                                                    />
                                                    <h4 className='cut-text flex-1'>{ product.title }</h4>
                                                    <IconWithHover iconClass='fa-xmark fa-solid p-2' onClick={()=>unselectProduct(product.id)} />
                                                    <IconWithHover iconClass='fa-solid fa-grip-vertical p-2' />
                                                </div>
                                            </ReorderItem>
                                        )}
                                    </Reorder.Group>
                                </div>
                            }
                            <div className='column g-2'>
                                <div className='d-f align-center g-4 px-2'>
                                    <input value={searchText} onChange={e=>setSearchedText(e.target.value)} placeholder='Search for products' className='box-input flex-1' />
                                </div>
                           
                                {searchedProductsBySearch && selectedProducts.length < 20 && 
                                <>
                                    <div className='column g-3 mt-2'>
                                        { searchedProductsBySearch.length >0 && 
                                            <>
                                                <hr className='mt-2'/>
                                                <div className='d-f g-3 color-primary'>
                                                    <i className='fa-solid fa-hand' style={{fontSize: 22}}></i>
                                                    <h4>{ translate('Click to add products') }</h4> 
                                                </div>
                                            </>   
                                        }
                                        {
                                            searchedProductsBySearch.map(product=>(
                                                <div key={product.id} className={ classes['searched-product'] + ' d-f align-center g-3'} onClick={()=>selectProduct(product.id)}>
                                                    <div 
                                                        className={classes['search-product__image'] + ' container'} 
                                                        style={{
                                                            backgroundImage: `url(${product.image || userData.storeLogo})`,
                                                        }}    
                                                    />
                                                    <h4 className='cut-text'>{ product.title }</h4>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </>
                                    
                                }
                                { searchedProductsBySearch && (searchedProductsBySearch.length === 0) && trimmed && !loading && <div  className='p-3 d-f justify-center'>
                                        <h3>{translate('No product was found')}</h3>
                                    </div>} 
                                {
                                loading && (
                                    <div className='p-3 d-f justify-center'>
                                        <Loader diam={60} />
                                    </div>
                                )
                            } 
                            </div>
                        </>
                    }
                </div>   
            </>
            
        }
    </div>
        
  )
})

export default RelatedProducts