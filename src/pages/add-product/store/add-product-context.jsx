import axios from 'axios'
import { apiUrl, filesUrl } from 'constants/urls'
import { useEffect, useState} from 'react'
import { useUserContext } from 'store/user-context'
import Loader from '../../../components/Loader'
import { getCombinations, translate } from 'utils/utils'
import IconWithHover from 'components/IconWithHover'
import { createContext } from 'use-context-selector';
import JsonStates from '../../../json/state.json'
import {useParams } from 'react-router-dom'

const AddProductContext = createContext({
    productInfo: {}, 
    setProductInfo: ()=>{},
    productError: {}, 
    setProducError: ()=>{},
    shakeField: {
        title: false,
    }, 
    setShakeField: ()=>{},
})

const AddProductContextProvider =({children})=>{
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const {userData} = useUserContext()
    const {id : productId} = useParams()

    const isEditing = productId.toLowerCase() !== 'add'
    const inititeProduct =()=>{
        setLoading(true)
        setError(null)
        axios.post(
            apiUrl + '/product/initiate-product',
            {
                store_id: localStorage.getItem('storeId')
            },
            {
                headers:{
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${userData.token}`
                }
            }
        ).then(response=>{
            setProductInfo(productInfo=>({
                ...productInfo,
                productId: response.data.product_id,
                shippingCostByState: userData.shippingCosts
            }))
            setLoading(false)
        }).catch(error=>{
            setError(error)
            setLoading(false)
        })
    }

    useEffect(()=>{
        if (!isEditing) inititeProduct()
        else {
            setLoading(true)
            setError(null)
            axios.get(
                filesUrl + `/get-product-for-edit?product_id=${productId}` ,
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                },
            ).then(response=>{
                setLoading(false)

                const galleryImages = response.data.galleryImages

                let variantsCombinations = []
                if (response.data.pricesAndImagesList?.length > 0 ){
                    const variantsList = Object.values(response.data.variants).filter(variant=>Object.keys(variant.options).length > 0)
                    const newCombinition = getCombinations(variantsList)
                    variantsCombinations = newCombinition
                }
                   
                const shippingCostByState = JsonStates.map(elem=>{
                    let newState = response.data.shippingCostByState.find(stt=>stt.id === elem.id)
                    if (!newState) newState={
                        id: elem.id,
                        cost: null,
                        costToHome: null
                    }
                    return({
                        ...newState,
                        name: elem.name,
                        code: elem.code,
                    })
                })
                setProductInfo(productInfo=>({
                    ...productInfo,
                    productId,
                    ...response.data,
                    galleryImages: !galleryImages ? [] : galleryImages.map((image, index)=>({ 
                        imageUrl :image,
                        base64Url: filesUrl + '/resize?width=300&url=' + image,
                        order: index + 1
                    })),
                    variantsCombinations, 
                    shippingCostByState,
                }
                ))
            }).catch(error=>{
                console.log(error)
                setLoading(false)
            })
                    
        }
    }, [])

    const [productInfo, setProductInfo]=useState({
        productId: null,
        title: '',
        slug: '',
        miniDescription: '',
        galleryImages: [],
        selectedCategories: [],
        price: 0,
        originalPrice: 0,
        discount: '',
        sku: '',
        quantity: '',
        shippingCostByState: [] ,
        askForCity: true,
        askForAddress: false,
        variants: {},
        variantsCombinations: [],
        pricesAndImagesList: [],
        richText: '',
        relatedProducts: [], // related products
        allProductsRelated: false, // related products

    })

    const [productError, setProducError]=useState({
        title: !!!isEditing,
    })
    const [shakeField, setShakeField] = useState({
        title: false,
    })
    const [variantsActivated, setVariantsActivated] = useState(false)
    const defaultValue={
        productInfo, 
        setProductInfo,
        productError, 
        setProducError,
        shakeField, 
        setShakeField,
        variantsActivated, 
        setVariantsActivated
    }

    useEffect(()=>{ 
        if(productInfo.productId) localStorage.setItem('productId', productInfo.productId )
        return ()=>localStorage.removeItem('productId')
    }, [productInfo.productId])

    // had to do this, something is wrong with useContextSelector
    const [content, setContent] = useState(<></>)
    useEffect(()=>{
        if (!loading && productInfo.productId){
            setContent(children)
        }
    }, [productInfo, loading])
    
    return (
        <AddProductContext.Provider value={defaultValue}>
            {loading && (
                <div style={{width: '100%', height: '100%'}} className='d-f align-center justify-center'><Loader diam={200} color={'var(--primaryColor)'} /></div> 
            )}
            {error && (
                <div className='column align-center justify-center'  style={{width: '100%', height: '100%'}} >
                    <h3 className='m-3 text-center color-red'>
                        {translate('There was a problem')}
                    </h3>
                    <IconWithHover iconClass='fa-solid fa-rotate-right color-red' size={50} onClick={inititeProduct} />
                </div>
                    
            )}
            {content}
        </AddProductContext.Provider>
    )
}

export default AddProductContextProvider
export {AddProductContext}

export const shakeField = (setShakeField, key)=>{
    setShakeField(shakeField=>({
        ...shakeField,
        [key] : true
    }))
    setTimeout(()=>{
        setShakeField(shakeField=>({
            ...shakeField,
            [key] : false
        }))
    }, 1000)
}