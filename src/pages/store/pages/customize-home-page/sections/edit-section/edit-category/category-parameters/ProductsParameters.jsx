import Button from "components/Button"
import { hexToNumber, numberToHex, translate } from "utils/utils"
import Range from "components/Range"
import IconWithHover from "components/IconWithHover"
import { aspectRatioList, bordersTypeList, justifyContentOptions, lengthUnitoptions, objectFitOptions, productsDisplayOptions } from "../../../../constants"
import { useState } from "react"
import ColorPicker from "components/ColorPicker"
import DialogComponent from "components/tags/Dialog"
import { useCustomizeHomePageContext } from "pages/store/pages/customize-home-page/store/CustomizeHomePageContext"
import LocalApplyToAll from "../../components/LocalApplyToAll"

const EditProductsJustifyContent=({updateProducts})=>{
    const {sectionDesign} = useCustomizeHomePageContext()
      
    const justifyContent = sectionDesign.products.justifyContent
    const applyToAllAction=()=>{
      updateProducts('justifyContent', justifyContent, true)
    }
    return(
        <div>
            <p>{ translate('Order products') }</p>
            <div className='d-f flex-wrap g-2'>
                {
                justifyContentOptions.map(op=>(
                    <Button
                    outline={justifyContent === op.value} 
                    onClick={()=>updateProducts('justifyContent', op.value)} 
                    className='px-2 rounded-4 p-0' key={op.value} >{ op.label }</Button>
                ))
                }
            </div>   
            <LocalApplyToAll
              chain={[
                translate('Products'),
                translate('Order products')
              ]} 
              action={applyToAllAction}
            />
        </div>
             
    )
}

const ToggleProductsRoundedBorders=({updateProducts})=>{
    const { sectionDesign} = useCustomizeHomePageContext()

    const productsDesign = sectionDesign.products
    const bordersRounded = productsDesign.bordersRounded

    const applyToAllAction=()=>{
      updateProducts('bordersRounded', bordersRounded, true) 
    }
    return (
      <div>
        <span>{ translate('Borders type') }</span>
        <div className='d-f flex-wrap g-2'>
              {
              bordersTypeList.map(op=>(
                  <Button
                    outline={bordersRounded === op.value} 
                    onClick={()=>updateProducts('bordersRounded', op.value)} 
                    className='px-2 rounded-4 p-0' key={op.value} >{ op.label }</Button>
                ))
              }
          </div> 
        <LocalApplyToAll
          chain={[
            translate('Products'),
            translate('Activate rounded border')
          ]} 
          action={applyToAllAction}
        />
      </div>
    )
}

const EditProductsBorderWidth=({updateProducts})=>{
  const { sectionDesign} = useCustomizeHomePageContext()

  const borderWidth = sectionDesign.products.borderWidth

  const applyToAllAction=()=>{
    updateProducts('borderWidth', Number(borderWidth), true)
  }
  return (
    <div>
      <div className='d-f align-items-center g-3'>
            <p>{ translate('Borders wdith') }:</p>
        </div>
        <Range
          min={0}
          max={4}
          step={1}
          value={borderWidth}
          setValue={(value)=>updateProducts('borderWidth', Number(value))}
        />
      <LocalApplyToAll
        chain={[
          translate('Products'),
          translate('Borders width')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

const EditProductsBorderColor=({updateProducts})=>{
  const {sectionDesign, visionMode} = useCustomizeHomePageContext()
  const borderColorObject =  sectionDesign.products.borderColor

  const borderColor = borderColorObject[visionMode].slice(0,7)
  const borderColorOpacity =  borderColorObject[visionMode].slice(7,9)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const applyToAllAction=()=>{
    updateProducts('borderColor', {
      ...borderColorObject,
      [visionMode] : `${borderColor}${borderColorOpacity}`
    }, true)
  }

  const updateBodersColor=(borderColor)=>{
    updateProducts('borderColor', {
      ...borderColorObject,
      [visionMode] : `${borderColor}${borderColorOpacity}`
    })
  }
  const updateBodersColorOpacity=(borderColorOpacity)=>{
    updateProducts('borderColor', {
      ...borderColorObject,
      [visionMode] : `${borderColor}${borderColorOpacity}`
    })
  }
  return(
    <div>
      <div className='d-f align-items-center g-3'>
        <p>{ translate('Borders color') }:</p>
        <h4 className='flex-1'>{ borderColor }</h4>
        <div 
          style={{
            border: '1px solid black', 
            padding: 1, 
            width: 54,
            borderRadius: 6
          }} 
          className='cursor-pointer'
          onClick={()=>setShowColorPicker(true)}
        >
          <div style={{
            backgroundColor: `${borderColor}${borderColorOpacity}`,
            width: 50,
            height: 20,
            borderRadius: 4,
          }} />
        </div>
      </div>
      <div className="d-f align-items-center">
        <span>{ translate('Opacity') }:</span>
        <Range
          min={0}
          max={99}
          step={1}
          value={hexToNumber(borderColorOpacity)}
          setValue={(value)=>updateBodersColorOpacity(numberToHex(value))}
        />
      </div>
      <DialogComponent open={showColorPicker} backDropPressCloses={false} close={ ()=>setShowColorPicker(false) }>
        <ColorPicker color={borderColor} onChange={updateBodersColor} opacity={borderColorOpacity} />
      </DialogComponent>
      <LocalApplyToAll
        chain={[
          translate('Products'),
          translate('Border color')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

const EditProductsBackground=({updateProducts})=>{
  const {sectionDesign, visionMode} = useCustomizeHomePageContext()
  const backgroundColorObject =  sectionDesign.products.backgroundColor

  const backgroundColor = backgroundColorObject[visionMode]
  const [showColorPicker, setShowColorPicker] = useState(false)
  const applyToAllAction=()=>{
    updateProducts('backgroundColor', {
      ...backgroundColor,
      [visionMode] : backgroundColor
    }, true)
  }

  const updatebackgroundColor=(backgroundColor)=>{
    updateProducts('backgroundColor', {
      ...backgroundColorObject,
      [visionMode] : backgroundColor
    })
  }
  return(
    <div>
      <div className='d-f align-items-center g-3'>
        <p>{ translate('Background color') }:</p>
        <h4 className='flex-1'>{ backgroundColor }</h4>
        <div 
          style={{
            border: '1px solid black', 
            padding: 1, 
            width: 54,
            borderRadius: 6
          }} 
          className='cursor-pointer'
          onClick={()=>setShowColorPicker(true)}
        >
          <div style={{
            backgroundColor: backgroundColor,
            width: 50,
            height: 20,
            borderRadius: 4,
          }} />
        </div>
      </div>
      <DialogComponent open={showColorPicker} backDropPressCloses={false} close={ ()=>setShowColorPicker(false) }>
        <ColorPicker color={backgroundColor} onChange={updatebackgroundColor} />
      </DialogComponent>
      <LocalApplyToAll
        chain={[
          translate('Products'),
          translate('Border color')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

const EditProductsGap=({updateProducts})=>{
    const {sectionDesign} = useCustomizeHomePageContext()    
      
    const gap = sectionDesign.products.gap

    const applyToAllAction=()=>{
      updateProducts('gap', gap, true)
    }
    return(
      <div>
        <div className='d-f align-items-center g-3'>
            <p>{ translate('Gap between products') }:</p>
        </div>
        <Range
          min={0}
          max={16}
          step={2}
          value={gap}
          setValue={(value)=>updateProducts('gap', Number(value))}
        />
        <LocalApplyToAll
          chain={[
            translate('Products'),
            translate('Gap')
          ]} 
          action={applyToAllAction}
        />
      </div>
    )
}

const EditProductWidth=({updateProductsProduct})=>{
  const {sectionDesign, isMobile} = useCustomizeHomePageContext()    
  let width = sectionDesign.products.product.width
  let unit = width[width.length - 1]
  if (unit === '%'){
    width = Number(width.slice(0, width.length - 1))
  }
  else {
    unit = 'px'
    width = Number(width.slice(0, width.length - 2))
  }
  const applyToAllAction=()=>{
    updateProductsProduct('width', `${width}${unit}`, true)
  }
  
  const selectedUnit=(unit)=>{
    const newWidth = unit === 'px' ? (isMobile ? '160px': '260px') : ( isMobile ? '50%' : '20%')
    updateProductsProduct('width', newWidth)
  }
  const min = unit === 'px' ? 120 : (isMobile ? 20 : 5)
  const max = unit === 'px' ? (isMobile ? 380 : 980) : 100
  const step = unit === 'px' ? (isMobile ? 10 : 20) : 5
  return(
    <div>
      <div className='d-f align-items-center g-3 justify-content-between'>
          <p>{ translate('Product card width') }:</p>
          <div className="d-f g-3">
            {lengthUnitoptions.map(op=>(
              <Button key={op.id} outline={op.value === unit} onClick={()=>{selectedUnit(op.value)}} style={{padding: '0 8px', borderRadius: 20, width: 40}}>{op.label}</Button>
            ))}
          </div>
      </div>
      
      <Range
        min={min}
        max={max}
        step={step}
        value={width}
        setValue={(value)=>updateProductsProduct('width', `${value}${unit}`)}
        unit={unit}
      />
      <LocalApplyToAll
        chain={[
          translate('Products'),
          translate('Product card width')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

const EditProductsProductTitleSize=({updateProductsProduct})=>{
    const {sectionDesign, visionMode} = useCustomizeHomePageContext()    
    const productsDesign = sectionDesign.products
    const size = productsDesign.product.title.size
    const colorObject = productsDesign.product.title.color
    const color = colorObject[visionMode]

    const applyToAllAction=()=>{
      const newProductsProductTitle = {
        size: size,
        color: colorObject
      }
      updateProductsProduct('title', newProductsProductTitle, true)
    }

    const [showColorPicker, setShowColorPicker] = useState(false)
    return(
      <div >
        <div className='d-f align-items-center g-3'>
            <p>{ translate('Title size') }:</p>
        </div>
        <Range
          min={12}
          max={54}
          step={2}
          value={size}
          setValue={(value)=>updateProductsProduct('title', {
            size: Number(value),
            color: colorObject,
          })}
        />
        <div className="mt-2">
          <div className='d-f align-items-center g-3'>
            <p>{ translate('Title color') }:</p>
            <h4 className='flex-1'>{ color }</h4>
            <div 
              style={{
                border: '1px solid black', 
                padding: 1, 
                width: 54,
                borderRadius: 6
              }} 
              className='cursor-pointer'
              onClick={()=>setShowColorPicker(true)}
            >
              <div style={{
                backgroundColor: color,
                width: 50,
                height: 20,
                borderRadius: 4,
              }} />
            </div>
          </div>
          <DialogComponent open={showColorPicker} backDropPressCloses={false} close={ ()=>setShowColorPicker(false) }>
            <ColorPicker color={color} onChange={(newColor)=>{
              updateProductsProduct('title', {
                size,
                color: {
                  ...colorObject,
                  [visionMode]: newColor
                }
              })
            }} />
          </DialogComponent>
        </div>
        <LocalApplyToAll
          chain={[
            translate('Products'),
            translate('Title size')
          ]} 
          action={applyToAllAction}
        />
      </div>
    )
}

const EditProductsProductPriceSize=({updateProductsProduct})=>{
  const {sectionDesign, visionMode} = useCustomizeHomePageContext()    
  const productsDesign = sectionDesign.products
  const size = productsDesign.product.price.size
  const colorObject = productsDesign.product.price.color
  const color = colorObject[visionMode]

  const applyToAllAction=()=>{
    const newProductsProductPrice = {
      size: size,
      color: colorObject
    }
    updateProductsProduct('price', newProductsProductPrice, true)
  }

  const [showColorPicker, setShowColorPicker] = useState(false)
  return(
    <div >
      <div className='d-f align-items-center g-3'>
          <p>{ translate('Price size') }:</p>
      </div>
      <Range
        min={12}
        max={54}
        step={2}
        value={size}
        setValue={(value)=>updateProductsProduct('price', {
          size: Number(value),
          color: colorObject,
        })}
      />
      <div className="mt-2">
        <div className='d-f align-items-center g-3'>
          <p>{ translate('Price color') }:</p>
          <h4 className='flex-1'>{ color }</h4>
          <div 
            style={{
              border: '1px solid black', 
              padding: 1, 
              width: 54,
              borderRadius: 6
            }} 
            className='cursor-pointer'
            onClick={()=>setShowColorPicker(true)}
          >
            <div style={{
              backgroundColor: color,
              width: 50,
              height: 20,
              borderRadius: 4,
            }} />
          </div>
        </div>
        <DialogComponent open={showColorPicker} backDropPressCloses={false} close={ ()=>setShowColorPicker(false) }>
          <ColorPicker color={color} onChange={(newColor)=>{
            updateProductsProduct('price', {
              size,
              color: {
                ...colorObject,
                [visionMode]: newColor
              }
            })
          }} />
        </DialogComponent>
      </div>
      <LocalApplyToAll
        chain={[
          translate('Products'),
          translate('Price size')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

const EditProductsProductImageObjetFit=({updateProductsProduct})=>{
  const {sectionDesign} = useCustomizeHomePageContext()
  const productsProductImageObject = sectionDesign.products.product.image
  const objectFit = productsProductImageObject.objectFit
  const aspectRatio = productsProductImageObject.aspectRatio


  const applyToAllAction=()=>{
    const newProductsProductImageObject={
      aspectRatio,
      objectFit,
    }
    updateProductsProduct('image', newProductsProductImageObject, true)
  }
  return(
      <div>
        <div className='d-f align-items-center g-3'>
          <p>{ translate('Image aspect ratio') }:</p>
              <h4>{ aspectRatio }</h4>
          </div>
          <div className="d-f g-3 f-wrap align-items-center px-1">
            { aspectRatioList.map(ar=>(
                <IconWithHover key={ar.id}>
                  <div 
                    style={{ 
                      width: 32, 
                      aspectRatio: ar.value, 
                      border: '2px solid var(--primaryColor)', 
                      color: 'inherit', 
                      borderRadius: 4,
                      backgroundColor: aspectRatio === ar.value ? 'var(--primaryColor)' : undefined, 
                    }} 
                    onClick={()=>{updateProductsProduct('image', {
                      objectFit,
                      aspectRatio: ar.value,
                    })}}
                  />
                </IconWithHover>
            )) }
          </div>
          <div className="mt-2">
            <p>{ translate('Image display type') }</p>
            <div className='d-f flex-wrap g-2'>
                {
                objectFitOptions.map(op=>(
                    <Button
                    outline={objectFit === op.value} 
                    onClick={()=>updateProductsProduct('image', {
                      aspectRatio,
                      objectFit: op.value,
                    })} 
                    className='px-2 rounded-4 p-0' key={op.value} >{ op.label }</Button>
                ))
                }
            </div>  
          </div> 
          <LocalApplyToAll
            chain={[
              translate('Products'),
              translate('Image display type')
            ]} 
            action={applyToAllAction}
          />
      </div>
  )
}

const EditProductsSwiper=({updateProducts})=>{
  const { sectionDesign} = useCustomizeHomePageContext()

  const productsDesign = sectionDesign.products
  const productsDisplay = productsDesign.productsDisplay

  const applyToAllAction=()=>{
    updateProducts('productsDisplay', productsDisplay, true) 
  }
  return (
    <div>
      <span>{ translate('Products display') }</span>
      <div className='d-f flex-wrap g-2'>
        {
        productsDisplayOptions.map(op=>(
            <Button
              outline={productsDisplay === op.value} 
              onClick={()=>updateProducts('productsDisplay', op.value)} 
              className='px-2 rounded-4 p-0' key={op.value} >{ op.label }</Button>
          ))
        }
      </div> 
      <LocalApplyToAll
        chain={[
          translate('Products'),
          translate('Toggle scroller')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

export {
  EditProductsJustifyContent, 
  EditProductsGap, 
  ToggleProductsRoundedBorders, 
  EditProductsProductTitleSize, 
  EditProductsProductPriceSize, 
  EditProductWidth,
  EditProductsProductImageObjetFit,
  EditProductsBorderWidth,
  EditProductsBorderColor,
  EditProductsBackground,
  EditProductsSwiper
}