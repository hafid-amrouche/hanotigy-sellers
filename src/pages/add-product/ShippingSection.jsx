import React, { forwardRef, memo, useImperativeHandle, useState } from 'react'
import Input from '../../components/tags/Input';
import classes from '../AddProduct.module.css'
import { translate } from '../../utils/utils';
import statesFromJson from '../../json/state.json'
import { useContextSelector } from 'use-context-selector';
import { AddProductContext } from './store/add-product-context';
import ShippingByStateSection from 'components/ShippingByState';
import MotionItem from 'components/Motionitem';
import { motion } from 'framer-motion';
import { useUserContext } from 'store/user-context';

const ShippingCost=memo(({shippingCost, setShipping})=>{
    const blurHandler=(value)=>{
        setShipping(value)
    }
    return (
        <MotionItem Tag={motion.div}>
            <Input
                label={translate('Fixed shipping cost')}
                type='number'
                value={shippingCost}
                onChange={blurHandler}
                maxLength={10}
                className='flex-1'
                min={0}
            />
        </MotionItem>
    )

})


let StatesWithCost = []
for (const state of statesFromJson){
    StatesWithCost.push({
        ...state,
        cost: 0,
    })
}

const ShippingSection=forwardRef((props, ref)=>{
    const shippingCostByState = useContextSelector(AddProductContext, state=>state.productInfo.shippingCostByState)
    const defaultStates = statesFromJson.map(state=>{
        const newState = shippingCostByState.find(elem=>elem.id === state['id'])
        if (newState) return newState
        else return ({
            id: state['id'],
            code: state['code'],
            label: state['name'],
            cost: null,
            costToHome: null
        })
    })
    const [states, setStates]= useState(defaultStates)
    useImperativeHandle(ref, ()=>({
        shippingData: {
            shippingCostByState : states.filter(state=>(state.cost !== null || state.costToHome !== null)).map(elem=>({
                id:elem.id, 
                cost: elem.cost, 
                costToHome: elem.costToHome
            })),
            askForCity: askForCity || undefined,
            askForAddress: askForAddress || undefined
        }
    }))

    const defaultAskForCity = useContextSelector(AddProductContext, state=>state.productInfo.askForCity)
    const [askForCity, setAskForCity] = useState(defaultAskForCity)
    const defaultAskForAddress = useContextSelector(AddProductContext, state=>state.productInfo.askForAddress)
    const [askForAddress, setAskForAddress] = useState(defaultAskForAddress)
    return(
            <div className={ 'g-1 container column m-3'}>
                <div className='mt-2'>
                    <div className='g-2 d-f align-center'>
                        <input type='checkbox' checked={askForAddress} onChange={(e)=>setAskForAddress(e.target.checked)} style={{scale: '0.8'}} />
                        <h3 className='color-primary'>{ translate('Ask for address') }</h3>
                    </div>
                    <div className='column g-2 p-2'>
                        <h3 className='color-primary'>{ translate('Shipping cost') } ({ translate('DA') })</h3>
                    </div>
                </div>
                <div className='p-2'>
                    <ShippingByStateSection {...{states, setStates}} />
                </div>
            </div>            
    )
})

export default ShippingSection