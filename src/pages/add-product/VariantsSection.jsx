import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import DefineVariants from './DefineVariants'
import VariantsPricing from './VariantsPricing'
import { useContextSelector } from 'use-context-selector'
import { AddProductContext } from './store/add-product-context'


function cleanData(input) {
  const result = {};

  for (const key in input) {
    if (input[key].name.trim() && Object.keys(input[key].options).length > 0) {
      result[key] = input[key];
    }
  }
  return result;
}

const transformedData=(data)=> data.reduce((acc, curr, index) => {
  acc[index] = {};  // Initialize an empty object for each index
  
  // Iterate through each key (variant name) in the current object
  for (const variantName in curr) {
    if (curr.hasOwnProperty(variantName)) {
      acc[index][variantName] = curr[variantName].label;  // Store the label of each variant
    }
  }
  
  return acc;
}, {});



const VariantsSection = forwardRef((props, ref) => {
    const defaultVariants = useContextSelector(AddProductContext, state=>state.productInfo.variants)
    const [variants, setVariants] = useState(defaultVariants)

    const defaultPricesAndImagesList = useContextSelector(AddProductContext, state=>state.productInfo.pricesAndImagesList)

    const defaultVarinatsCombinations = useContextSelector(AddProductContext, state=>state.productInfo.variantsCombinations)
    const [variantsCombinations, setVariantsCombinations] = useState(defaultVarinatsCombinations)

    const [pricesAndImagesList, setPricesAndImageList] = useState(defaultPricesAndImagesList) 
    
    const setVariantsActivated = useContextSelector(AddProductContext, state=>state.setVariantsActivated)
    useEffect(()=>{
      setVariantsActivated(pricesAndImagesList.length > 0)
    }, [pricesAndImagesList])
    useImperativeHandle(ref, ()=>{
      const validData = variantsCombinations.length > 0
      return ({
        variantsData:!validData ? {} : {
          variants: cleanData(variants),
          variantsCombinations: transformedData(variantsCombinations),
          pricesAndImagesList,
        }
      })
    })
    const variantsRef = useRef()

  return (
    <div id='variants-section'>
      <DefineVariants {...{variants, setVariants}} ref={variantsRef}/>
      <VariantsPricing {...{variants, pricesAndImagesList, setPricesAndImageList, variantsCombinations, setVariantsCombinations}}/>
    </div>
  )
})

export default VariantsSection