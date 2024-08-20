import Input from 'components/tags/Input'
import React, { forwardRef, memo, useImperativeHandle, useState } from 'react'
import { useContextSelector } from 'use-context-selector'
import { translate } from 'utils/utils'
import { AddProductContext } from './store/add-product-context'
import Accordiant from 'components/Accordiant'
import useScrollToTop from 'hooks/useScrollToTop'

const DiscountField=memo(({discount, setDiscount})=>{

    const blurHandler=(value)=>{
        setDiscount(value)
    }
    return (
        <Input
            label={translate('Discount')}
            placeholderLabel= {translate('Discount: 25% off or -500DA ')}
            type='text'
            onChange={blurHandler}
            onBlur={(value)=>setDiscount(value)}
            maxLength={50}
            className='flex-1'
            value={discount}
        />
    )

})


const DiscountSection = forwardRef((props, ref) => {
    const defaultDiscount = useContextSelector(AddProductContext, state=>state.productInfo.discount)
    const [discount, setDiscount] = useState(defaultDiscount)
    useImperativeHandle(ref, ()=>({
        data:{
            discount : show ? (discount || undefined ) : undefined
        }
    }))
    const [show, setShow] = useState(defaultDiscount)
    useScrollToTop(show, '#discount-section', 70)
  return (
    <div className='p-2 m-3 container column g-3 ' id='discount-section'>
        <div className={'d-f align-center g-3'}>
            <Accordiant checked={show} setChecked={setShow} />
            <h3 className='color-primary'>{translate('Discount')}</h3>
        </div>
        { show && <div>
            <DiscountField {...{discount, setDiscount}} />
        </div>}
    </div> 
  )
})

export default DiscountSection