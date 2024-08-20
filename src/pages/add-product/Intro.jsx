import React, { forwardRef, memo, useImperativeHandle, useState } from 'react'
import Input from '../../components/tags/Input';
import classes from '../AddProduct.module.css'
import { translate } from '../../utils/utils';
import { useContextSelector } from 'use-context-selector';
import { AddProductContext } from './store/add-product-context';
import Shake from 'components/Shake';

const TitleField=memo(({title, setTitle})=>{
    const checkError=(newValue)=>{
        if (newValue.length < 3){
            return translate('Your title must be at least 3 latters long')
        }
        else return null
    }
    const setProducError = useContextSelector(AddProductContext, state=>state.setProducError)

    const shakeTitle = useContextSelector(AddProductContext, state=>state.shakeField.title)

    const defaultTitleError = useContextSelector(AddProductContext, state=>state.productError.title)
    const [titleError, setTitleError] = useState(defaultTitleError)

    const changeHandler=(newValue)=>{
        setTitle(newValue)
        setTitleError(checkError(newValue))
        setProducError(productError=>({
            ...productError,
            title: checkError(newValue)
        }))
    }
    const onBlur=(newValue)=>{
        setTitle(newValue)
    }
    return (
        <Shake shake={shakeTitle}>
            <Input
                label={translate('Title')}
                type='text'
                onChange={changeHandler}
                onBlur={onBlur}
                value={title}
                maxLength={100}
                className='flex-1'
                error={titleError}
                id='title'
            />
        </Shake>
            
    )

})

const SlugField=memo(({slug, setSlug})=>{
    let changeHandler=(newSlug)=>{
        setSlug(newSlug)
    }
    return (
        <div className='container p-2'>
            <div className={'d-f g-3 f-wrap align-center' }  id='slug'>
                <h4 className='color-text'>https://baara-menage.hanotify.store/</h4>
                <Input
                    type='text'
                    onChange={changeHandler}
                    style={{
                        width: '100%'
                    }}
                    onBlur={changeHandler}
                    value={slug}
                    maxLength={100}
                    placeholder={translate('Slug')}
                    isSlug
                    containerClassName='flex-1'
                    className={'color-primary'}
                />
            </div>        
        </div>            
    )
})

const MiniDescription=memo(({miniDescription, setMiniDescription})=>{
    let blurHandler=(e)=>{
        const newValue = e.target.value.trim()
        setMiniDescription(newValue)
    }
    return (
        <div className='flex-1 d-f' >
            <textarea 
                placeholder={translate('Mini description')}
                onBlur={blurHandler}
                defaultValue={miniDescription}
                maxLength={1000}
                rows={2} 
                style={{
                    resize: 'vertical',
                    flex: 1
                }}
                className='box-input flex-1' 
            />
        </div>
    )

})

const PricdField=memo(({price, setPrice})=>{
    const setProductInfo = useContextSelector(AddProductContext, state=>state.setProductInfo)
    const blurHandler=(value)=>{
        setPrice(value)
        setProductInfo(productInfo=>({
            ...productInfo,
            price: value
        }))
    }
    return (
        <Input
            label={translate('Price')}
            type='number'
            value={price}
            onChange={blurHandler}
            maxLength={10}
            className='flex-1'
            min={0}
        />
    )

})

const OriginlPrice=memo(({originalPrice, setOriginalPrice})=>{
    const setProductInfo = useContextSelector(AddProductContext, state=>state.setProductInfo)
    const blurHandler=(value)=>{
        setOriginalPrice(value)
        setProductInfo(productInfo=>({
            ...productInfo,
            originalPrice: value
        }))
    }
    return (
        <Input
            label={translate('Original price')}
            type='number'
            value={originalPrice}
            onChange={blurHandler}
            maxLength={10}
            className='flex-1'
            min={0}
            style={{textDecoration: 'line-through'}}
        />
    )

})

const Intro=forwardRef((props, ref)=>{
    const defaultSlug = useContextSelector(AddProductContext, state=>state.productInfo.slug)
    const [slug, setSlug] = useState(defaultSlug)
     
    const defaultTitle = useContextSelector(AddProductContext, state=>state.productInfo.title)
    const [title, setTitle] = useState(defaultTitle)

    const defaultMiniDescription = useContextSelector(AddProductContext, state=>state.productInfo.miniDescription)
    const [miniDescription, setMiniDescription] = useState(defaultMiniDescription)

    const defaulPrice = useContextSelector(AddProductContext, state=>state.productInfo.price)
    const [price, setPrice] = useState(defaulPrice)

    const defaultoriginalPrice = useContextSelector(AddProductContext, state=>state.productInfo.originalPrice)
    const [originalPrice, setOriginalPrice] = useState(defaultoriginalPrice)

    const variantsActivated = useContextSelector(AddProductContext, state=>state.variantsActivated)


    useImperativeHandle(ref, ()=>({
        introData:{
            slug,
            title,
            miniDescription : miniDescription || undefined,
            price: Number(price) || undefined,
            originalPrice : Number(originalPrice) || undefined,
        }
    }))

    return(
        <div className={ classes['card'] + ' container column'}>
            <TitleField {...{title, setTitle}} />
            <SlugField {...{slug, setSlug}}/>
            <div className='d-f f-wrap g-3 '>
                <div className={classes['price-container']}>
                    <PricdField {...{price, setPrice}} />
                </div>
                <div className={classes['price-container']}>
                    <OriginlPrice {...{originalPrice, setOriginalPrice}} />
                </div>
            </div>
            { (variantsActivated && (originalPrice || price)) ? <h4 style={{color: 'var(--greyColor)', lineHeight: 1.2, marginBottom: 12}}>{ translate('These prices will not appear in your product page because you are using variants now') }</h4> : <></>}
            <MiniDescription {...{miniDescription, setMiniDescription}} />
        </div>
    )
})

export default Intro