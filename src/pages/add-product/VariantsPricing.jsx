import React, { useCallback, useEffect, useRef} from 'react'
import classes from '../AddProduct.module.css'
import { getCombinations ,translate } from 'utils/utils'
import UploadImageButton from './UploadImageButton'
import { useContextSelector } from 'use-context-selector'
import { AddProductContext } from './store/add-product-context'
import IconWithHover from 'components/IconWithHover'
import DialogComponent from 'components/tags/Dialog'
import Button from 'components/Button'
import './VariantsPricing.css'

const VariantRow = ({variantObj, index, pricesAndImage, changePricesAndImage})=>{
  const priceChangeHandler=(e)=>{
    changePricesAndImage(index, 'price', Number(e.target.value))
  }
  const originaPriceChangeHandler=(e)=>{
    changePricesAndImage(index, 'originalPrice', Number(e.target.value))
  }
  const imageChangeHandler=(image)=>{
    changePricesAndImage(index, 'image', image)
  }
  const copyToAllOriginalPrices=(value=null, approved=false)=>{
    if (!approved) capyToAllOriginalPricesDialogRef.current?.open()
    if(approved) {
      changePricesAndImage((pricesAndImagesList)=>{
        pricesAndImagesList.forEach((row, index)=>{
          changePricesAndImage(index, 'originalPrice', value)
        })
      })
      capyToAllOriginalPricesDialogRef.current?.close()
    }
  }
  const copyToAllPrices=(value=null, approved=false)=>{
    if (!approved) capyToAllPricesDialogRef.current?.open()
    if(approved) {
      changePricesAndImage((pricesAndImagesList)=>{
        pricesAndImagesList.forEach((row, index)=>{
          changePricesAndImage(index, 'price', value)
        })
      })
      capyToAllPricesDialogRef.current?.close()
    }
  }
  const capyToAllPricesDialogRef = useRef()
  const capyToAllOriginalPricesDialogRef = useRef()
  return(
    <div className='table-row'>
      <div className='table-cell'>
        <div className='d-f f-wrap g-2 container p-2 px-1'>
          <UploadImageButton image={pricesAndImage.image} imageChangeHandler={imageChangeHandler} />  
          {
            Object.values(variantObj).map((option, index2)=>{ 
              if (option) return (
                <React.Fragment key={index2}>
                  <span  className='container px-1 d-f g-3 color-text' style={{borderRadius: 4, background: 'rgba(var(--primaryColor-rgb), 0.2)'}}>
                      { option.label && <span>{option.label}</span> }
                  </span>
                </React.Fragment>
                )
            })  
          } 
        </div>
      </div>
      <div className='table-cell flex-1 d-f p-relative'>
        <input min={0} value={pricesAndImage.price} onChange={priceChangeHandler} className='box-input' type='number'  style={{ fontSize: 18, height: 50, padding: '8px 4px'}} />
        <IconWithHover 
          style={{
            position: 'absolute',
            left: 4,
            top: -4
          }}
          iconClass='fa-solid fa-plus-square color-primary'
          onClick={()=>copyToAllPrices()}
        />
        <DialogComponent ref={capyToAllPricesDialogRef} >
            <div className='container p-2 column g-4' style={{maxWidth: '80vw'}}>
                <h4 style={{textAlign: 'start'}}>{translate('Are you sure you want to copy this value "{price}" to all prices fields ?', {price: pricesAndImage.price})}</h4>
                <div className='d-f justify-space-between'>
                  <Button outline onClick={()=>copyToAllPrices(pricesAndImage.price, true)}>Yes</Button>
                  <Button theme='dark' onClick={()=>capyToAllPricesDialogRef.current?.close()}>No</Button>
                </div>
            </div>
        </DialogComponent>
      </div>
      <div className='table-cell flex-1 d-f p-relative'>
        <input min={0}  value={pricesAndImage.originalPrice} onChange={originaPriceChangeHandler} className='box-input' type='number' style={{textDecoration: pricesAndImage.originalPrice!= 0 ? 'line-through' : undefined, fontFamily: '', fontSize: 18, height:50, padding: '8px 4px'}} />
        <IconWithHover 
          style={{
            position: 'absolute',
            left: 4,
            top: -4
          }}
          onClick={()=>copyToAllOriginalPrices(Number(pricesAndImage.originalPrice))}
          iconClass='fa-solid fa-plus-square color-primary'
        />
        <DialogComponent ref={capyToAllOriginalPricesDialogRef} >
            <div className='container p-2 column g-4' style={{maxWidth: '80vw'}}>
                <h4 style={{textAlign: 'start'}}>{translate('Are you sure you want to copy this value "{price}" to all original prices fields ?', {price: pricesAndImage.originalPrice})}</h4>
                <div className='d-f justify-space-between'>
                  <Button outline onClick={()=>copyToAllOriginalPrices(pricesAndImage.originalPrice, true)}>Yes</Button>
                  <Button theme='dark' onClick={()=>capyToAllOriginalPricesDialogRef.current?.close()}>No</Button>
                </div>
            </div>
        </DialogComponent>
      </div>
    </div>
  )
}

const VariantsPricing = ({variants, pricesAndImagesList, setPricesAndImageList, variantsCombinations, setVariantsCombinations}) => {
  const defaultPrice = useContextSelector(AddProductContext, state=>state.productInfo.price)
  const originalPrice = useContextSelector(AddProductContext, state=>state.productInfo.originalPrice)

  const firstCicleDone = useRef(false)
  useEffect(()=>{
    if (firstCicleDone.current){
      const variantsList = Object.values(variants).filter(variant=>Object.keys(variant.options).length > 0)
      const newCombinition = getCombinations(variantsList)
      setVariantsCombinations(newCombinition)
      setPricesAndImageList(newCombinition.map(com=>(
        {
          price: defaultPrice,
          originalPrice: originalPrice,
          image: null
        }
      )))
    }
    else firstCicleDone.current = true
  }, [variants])
  
  const changePricesAndImage=useCallback((indexOrFunction, identifier, value)=>{
    if (typeof indexOrFunction === 'function'){
      indexOrFunction(pricesAndImagesList)
      return;
    }
    setPricesAndImageList(state=>{
      const newState = [...state]
      newState[indexOrFunction][identifier] = value
      return newState
    })
  }, [])

  return (
    variantsCombinations.length > 0 && (
      <div className={classes['card'] + ' container column add-product'}>
        <h3 className='color-primary'>{ translate('Varinats Pricing') }</h3>

        <div className="table-flex">
          <div className='table-row header' style={{borderBottom: 'var(--borderColor) 1px solid'}}>
              <div className='table-cell'>{translate('Variant')}</div>
              <div className='table-cell'>{translate('Price')}</div>
              <div className='table-cell'>{translate('Original price')}</div>
          </div>
          {variantsCombinations.map((variantObj, index)=>(
            <VariantRow key={index} index={index} variantObj={variantObj} pricesAndImage={pricesAndImagesList[index]} changePricesAndImage={changePricesAndImage} />
          ))}
          
        </div>
      </div>
    )
    
      
  )
}

export default VariantsPricing