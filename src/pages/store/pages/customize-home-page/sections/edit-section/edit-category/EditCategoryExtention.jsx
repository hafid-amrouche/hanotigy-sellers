import React, { useState } from 'react'
import { translate } from 'utils/utils'
import Accordiant from 'components/Accordiant'
import { EditTitleColor, EditTitleDirection, EditTitleSize, EditTitlePadding } from './category-parameters/TitleParameters'
import { EditProductsBackground, EditProductsBorderColor, EditProductsBorderWidth, EditProductsGap, EditProductsJustifyContent, EditProductWidth, EditProductsProductImageObjetFit, EditProductsProductPriceSize, EditProductsProductTitleSize, ToggleProductsRoundedBorders, EditProductsSwiper } from './category-parameters/ProductsParameters'
import { EditGeneralMarginHorizontal, EditGeneralMarginTop } from './category-parameters/GeneralDesign'
import { useCustomizeHomePageContext } from '../../../store/CustomizeHomePageContext'
import { ApplyToAll } from '../components/ApplyToAll'
import { useApplySectionToAll } from '../hooks/hooks'


const EditTitle=()=>{
    const {selectedSectionId, updateSectionDesign, sectionDesign, visionMode, sections, selectedDevice} = useCustomizeHomePageContext()
    const titleDesign = sectionDesign.title
    const updateTitle=(id, value, toAll=false)=>{
      if (!toAll){
        const newtitleDesign = {
          ...titleDesign,
          [id]: value
        }
        updateSectionDesign(
          selectedSectionId, 
          {
            'title' : newtitleDesign
          },
        )
      }
      else{
        sections.filter(sec=>sec.type === 'products-container').forEach(section=>{
          const titleDesign = section.design[selectedDevice].title
          const newTitleDesign = {
            ...titleDesign,
            [id]: value
          }
          updateSectionDesign(
            section.id, 
            {
              'title' : newTitleDesign
            },
            
          )
        })
      }
    }

    const updateColor = (value, toAll)=>{
      const label = {
        ...titleDesign.label,
        color: {
          ...titleDesign.label.color,
          [visionMode]: value
        }
      }
      updateTitle('label', label, toAll)
    }
    
    const [showTitleDesign, setShowTitleDesign]=useState(false)
    return (
      <div className='p-1' style={{backgroundColor: showTitleDesign ? 'rgba(var(--primaryColor-rgb), 0.2)' : undefined}}>
        <div className='d-f g-2 align-items-center'>
          <Accordiant setChecked={setShowTitleDesign} checked={showTitleDesign} />
          <h4 className='flex-1'>{ translate('Title') }</h4>
          <input type='checkbox' checked={titleDesign.showTitle} style={{scale: '0.8'}} onChange={e=>updateTitle('showTitle', e.target.checked)} />
        </div>
        { showTitleDesign &&
          <div className='mt-2'>
            <div disabled={!titleDesign.showTitle} className='column g-3'>
              <div className='container p-1'>
                <EditTitleColor updateColor={updateColor} />
              </div>
              <div className='container p-1'>
                <EditTitleSize updateTitle={updateTitle} />   
              </div>
              <div className='container p-1'>
                <EditTitlePadding updateTitle={updateTitle } />
              </div>
              <div className='container p-1'>
                <EditTitleDirection updateTitle={updateTitle }/>
              </div>
            </div>
          </div>
        }
      </div>
    )
}

const EditProducts=()=>{
    const {selectedSectionId, updateSectionDesign, sectionDesign, sections, selectedDevice} = useCustomizeHomePageContext()
      
    const productsDesign = sectionDesign.products
    
    const updateProducts=(id, value, toAll=false)=>{
      if (!toAll){
        const newProductsDesign = {
          ...productsDesign,
          [id]: value
        }
        updateSectionDesign(
          selectedSectionId, 
          {
            'products' : newProductsDesign
          },
        )
      }
      else{
        sections.filter(sec=>sec.type === 'products-container').forEach(section=>{
          const productsDesign = section.design[selectedDevice].products
          const newProductsDesign = {
            ...productsDesign,
            [id]: value
          }
          updateSectionDesign(
            section.id, 
            {
              'products' : newProductsDesign
            },
          )
        })
      }
    }

    const updateProductsProduct =(id, value, toAll)=>{
      if (toAll){
        sections.filter(sec=>sec.type === 'products-container').forEach(section=>{
          const productsDesign = section.design[selectedDevice].products
          const newProductsDesign = {
            ...productsDesign,
            product: {
              ...productsDesign.product,
              [id]: value
            }
          }
          updateSectionDesign(
            section.id, 
            {
              'products' : newProductsDesign
            },
          )
        })
        return
      }
      const newProduct = {
          ...productsDesign.product,
          [id]: value
      }
      updateProducts('product', newProduct)
    }
    
    const [showProductsDesign, setShowProductsDesign]=useState(false)
    return (
      <div className='p-1' style={{backgroundColor: showProductsDesign ? 'rgba(var(--primaryColor-rgb), 0.2)' : undefined}}>
        <div className='d-f g-2 align-items-center'>
          <Accordiant setChecked={setShowProductsDesign} checked={showProductsDesign} />
          <h4 className='flex-1'>{ translate('Products') }</h4>
        </div>
        { showProductsDesign &&
          <div className='mt-2'>
            <div className='column g-3'>
              <div className='container p-1'>
                <EditProductsBackground  updateProducts={updateProducts} />
              </div>
              <div className='container p-1'>
                <EditProductsProductTitleSize updateProductsProduct={updateProductsProduct} />
              </div>
              <div className='container p-1'>
                <EditProductsProductPriceSize updateProductsProduct={updateProductsProduct} />
              </div>
              <div className='container p-1'>
                <EditProductsProductImageObjetFit updateProductsProduct={updateProductsProduct} />
              </div>
              <div className='container p-1'>
                <EditProductWidth updateProductsProduct={updateProductsProduct} />
              </div>
              <div className='container p-1'>
                <EditProductsJustifyContent updateProducts={updateProducts} />
              </div>
              <div className='container p-1'>
                <EditProductsGap updateProducts={updateProducts} />
              </div>
              <div className='container p-1'>
                <EditProductsSwiper updateProducts={updateProducts} />
              </div>
              <div className='container p-1'>
                <ToggleProductsRoundedBorders updateProducts={updateProducts} />
              </div>
              <div className='container p-1'>
                <EditProductsBorderWidth updateProducts={updateProducts} />
              </div>
              <div className='container p-1'>
                <EditProductsBorderColor updateProducts={updateProducts} />
              </div>
            </div>
          </div>
        }
      </div>
    )
}

const EditGeneralDesign=()=>{
  return (
    <div className='px-1'>
      <div className='px-1'>
        <EditGeneralMarginTop />
      </div>
      <div className='px-1'>
        <EditGeneralMarginHorizontal />
      </div>
    </div>
  )
}

const EditCategoryExtention=()=>{
    const applySectionToAll = useApplySectionToAll('products-container')
    return (
      <div className='column' style={{height: '100%'}}>
        <div className='column g-3 flex-1' style={{overflowY: 'auto'}}>
          <h3 className='px-2 mt-2'>{ translate('Edit category') }</h3>
          <hr/>
          <EditGeneralDesign />
          <EditTitle/>
          <EditProducts/>
        </div>
        <ApplyToAll action={applySectionToAll} />
      </div>
    )
  }

export default EditCategoryExtention