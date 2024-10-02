import Accordiant from 'components/Accordiant'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useContextSelector } from 'use-context-selector'
import { AddProductContext } from './store/add-product-context'
import { translate } from 'utils/utils'
import useScrollToTop from 'hooks/useScrollToTop'
import Input from 'components/tags/Input'

const ProductDetails = forwardRef((props, ref) => {
    const defaultSku = useContextSelector(AddProductContext, state=>state.productInfo.sku)
    const defaultQuantity = useContextSelector(AddProductContext, state=>state.productInfo.quantity)
    const [sku, setSku] = useState(defaultSku)
    const [quantity, setQuantity] = useState(defaultQuantity)
    const [show, setShow] = useState(!!(defaultSku || defaultQuantity))
    useScrollToTop(show, '#details-section', 70)
    useImperativeHandle(ref, ()=>({
        data:{
            sku: sku.trim(),
            quantity: show ? (Number(quantity) > 0 ? Number(quantity) : undefined) : undefined
        }
    }))
  return (
    <div className='p-2 m-3 container column g-3 cursor-pointer' id='details-section' onClick={()=>{setShow(!show)}}>
        <div className={'d-f align-center g-3'}>
            <Accordiant checked={show} setChecked={()=>{}} />
            <h3 className='color-primary'>{translate('Product Details')}</h3>
        </div>
        { show && <div className='column g-3'>
            <Input label={"SKU"} value={sku} onChange={value=>setSku(value)} onBlur={value=>setSku(value)} />
            <Input label={"Quantity"} type='number' value={quantity} onChange={value=>setQuantity(value)} min={0} />
        </div>}
    </div> 
  )
})

export default ProductDetails