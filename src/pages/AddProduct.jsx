import React, { useRef, useState } from 'react'
import classes from './general.module.css'
import { adjustScrollToTop, extractImageUrls, translate } from '../utils/utils';
import useNonStickyHeader from 'hooks/useNonStickyHeader';
import AddProductContextProvider, { AddProductContext, shakeField } from './add-product/store/add-product-context';
import RelatedProducts from './add-product/RelatedProducts';
import Button from 'components/Button';
import Intro from './add-product/Intro';
import RichTextSection from './add-product/RichtextSection';
import VariantsSection from './add-product/VariantsSection';
import CategoriesSection from './add-product/CategoriesSection';
import UploadImagesSection from './add-product/UploadImagesSection';
import { useContextSelector } from 'use-context-selector';
import axios from 'axios';
import { apiUrl } from 'constants/urls';
import Loader from '../components/Loader'
import { useBrowserContext } from 'store/browser-context';
import { useNavigate, useParams } from 'react-router-dom';
import ProductPreview from './add-product/ProductPreview';
import ShippingSection from './add-product/ShippingSection';
import DiscountSection from './add-product/DiscountSection';
import { createPortal } from 'react-dom';
import ProductDetails from './add-product/ProductDetails';


const AddProductInner = () => {
    const {id : productId} = useParams()

    const isEditing = productId.toLowerCase() !== 'add'
    useNonStickyHeader()    
    const setShakeField = useContextSelector(AddProductContext, state=>state.setShakeField)

    const checkErrors=()=>{
        let flag= true;
        for (const [key, value] of Object.entries(productError)){
            if (value) {
                adjustScrollToTop(document.querySelector('#' + key), -70)
                setNavigationState('info')
                shakeField(setShakeField, key)
                flag = false
                break
            }
        }
        return flag
    }
    const [loading, setloading] = useState(false)
    const setProducError = useContextSelector(AddProductContext, state=>state.setProducError)
    const {setGlobalMessageA} = useBrowserContext()

    const getImages=()=>{
        const pricesAndImagesList = variantsSectionRef.current.variantsData.pricesAndImagesList 
        const combinationImages = pricesAndImagesList ? Object.values(pricesAndImagesList).map(com=>com.image).filter(image => image !== null) : []  

        const variants  = variantsSectionRef.current.variantsData.variants

        let optionsImages = []
        if (variants){
            Object.values(variants).forEach(variant=>{
                Object.values(variant.options).forEach( option=>{
                    if(option.image){
                        optionsImages=[
                            ...optionsImages,
                            option.image
                        ]
                    }
                })
            }) 
        }
        const richText = richtextSectionRef.current.richTextData.richText
        const richTextImages = !richText ? []  : extractImageUrls(richText)


        const galleryImages = UploadImagesRef.current.galleryImages || [] 

        const allImages = [
            ...combinationImages,
            ...optionsImages,
            ...galleryImages,
            ...richTextImages
        ]
        return allImages.filter(image=>!image.startsWith('data:image'))
    }
    const navigate = useNavigate()
    const nextHandler =async()=>{        
        const flag = checkErrors()
        if(!flag) return;
        setloading(true)
        getImages()
        try{
            const response = await axios.post(
                apiUrl + (isEditing ? '/product/edit-product' : '/product/add-product'),
                {
                    productId: localStorage.getItem('productId'),
                    ...introRef.current.introData,
                    ...categoriesSectionRef.current.categoriesData,
                    ...shippingSectionRef.current.shippingData,
                    ...variantsSectionRef.current.variantsData,
                    ...RelatedProductsRef.current.relatedProductsData,
                    ...richtextSectionRef.current.richTextData,
                    ...discountRef.current.data,
                    ...productDetailsRef.current.data,
                    imagesUrls : getImages()
                    
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            setGlobalMessageA({
                color: 'var(--successColor)',
                time: 3000,
                children: response.data.detail
            })
            if(!isEditing) navigate('/redirect?redirect=/products/' + localStorage.getItem('productId'))
        }catch(error){
            const reason = error.response?.data.reason
            if (reason){
                setProducError(productError=>({
                    ...productError,
                    [reason] : error.response.data.detail
                }))
                adjustScrollToTop(document.querySelector('#' + reason), -70)
                shakeField(setShakeField, reason)
            }
            setGlobalMessageA({
                color: 'red',
                time: 3000,
                children: translate('Your product was not listed')
            })
        }
        setloading(false)
    }
    const productError = useContextSelector(AddProductContext, state=>state.productError)

    const introRef = useRef()
    const UploadImagesRef = useRef()
    const categoriesSectionRef = useRef()
    const richtextSectionRef = useRef()
    const shippingSectionRef = useRef()
    const variantsSectionRef = useRef()
    const RelatedProductsRef = useRef() 
    const discountRef = useRef()
    const productDetailsRef = useRef()
    const [navigationState, setNavigationState] = useState('info')
    return (
        <>
            <div className='p-2 d-f p-sticky' style={{backgroundColor: 'var(--containerColor)', borderBottom: '1px solid var(--borderColor)', zIndex: 100}}>
                <div className='flex-1 d-f g-2 mx-2 pb-2' style={{overflowX: 'auto'}}>
                    <Button outline={navigationState === 'info'} onClick={()=>setNavigationState('info')} style={{borderRadius: 20}}>{ translate('Infomation') }</Button>
                    <Button outline={navigationState === 'variants'} onClick={()=>setNavigationState('variants')} style={{borderRadius: 20}}>{ translate('Variants') }</Button>
                    <Button outline={navigationState === 'shipping'} onClick={()=>setNavigationState('shipping')} style={{borderRadius: 20}}>{ translate('Shipping') }</Button>
                </div>
                <Button style={{whiteSpace: 'nowrap'}} outline theme='success' disabled={loading} onClick={nextHandler} className='g-3 ms-2 mb-2' >
                    { !loading && <i className='fa-solid fa-square-plus' style={{fontSize: 24}}/>}
                    { loading && <Loader diam={24} /> }
                    { isEditing ? translate('Update') : translate('Save')}
                </Button>
            </div>
            <div className={classes['container']} style={{marginBottom: 64, display: navigationState === 'info' ? 'block' : 'none'}}>
                <Intro ref={introRef} /> 
                <UploadImagesSection ref={UploadImagesRef} show={navigationState === 'info'} />
                <RichTextSection ref={richtextSectionRef} />
                <ProductDetails ref={productDetailsRef} />
                <DiscountSection ref={discountRef} />
                <CategoriesSection ref={categoriesSectionRef} />       
                <RelatedProducts ref={RelatedProductsRef} />
            </div>
            <div className={classes['container']} style={{marginBottom: 64, display: navigationState === 'variants' ? 'block' : 'none'}}>
                <VariantsSection ref={variantsSectionRef }/>
            </div>
            <div className={classes['container']} style={{marginBottom: 64, display: navigationState === 'shipping' ? 'block' : 'none'}}>
                <ShippingSection ref={shippingSectionRef}/>
            </div>
            {
                createPortal(<ProductPreview/>, document.getElementById('app'))
            }
            
        </>
    )
}


const AddProduct=()=>{
    const {id} = useParams()
    return (
        <AddProductContextProvider key={id}>
            <AddProductInner />
        </AddProductContextProvider>
    )
}
export default AddProduct