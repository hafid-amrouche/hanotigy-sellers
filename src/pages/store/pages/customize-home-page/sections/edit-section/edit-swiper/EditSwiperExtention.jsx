import React, { useState } from 'react'
import { useCustomizeHomePageContext } from '../../../store/CustomizeHomePageContext'
import { hexToNumber, numberToHex, translate } from 'utils/utils'
import DialogComponent from 'components/tags/Dialog'
import ColorPicker from 'components/ColorPicker'
import LocalApplyToAll from '../components/LocalApplyToAll'
import Range from 'components/Range'
import { aspectRatioList, justifyContentOptions, lengthUnitoptions, productsDisplayOptions, objectFitOptions } from '../../../constants'
import Button from 'components/Button'
import IconWithHover from 'components/IconWithHover'
import { useApplySectionToAll } from '../hooks/hooks'
import { ApplyToAll } from '../components/ApplyToAll'


const EditSwiperBackground=()=>{
    const {sectionDesign, visionMode, updateSectionDesign, sections, selectedSectionId, generalDesign} = useCustomizeHomePageContext()
    const backgroundColorObject =  sectionDesign.backgroundColor
    const backgroundColor = backgroundColorObject[visionMode]
    const [showColorPicker, setShowColorPicker] = useState(false)
    const applyToAllAction=()=>{
        sections.filter(sec=>sec.type === 'swiper').forEach(section=>{
            updateSectionDesign(section.id, {
                backgroundColor: {
                    ...backgroundColorObject,
                    [visionMode]: backgroundColor
                }
            })
        })
    }

    const updatebackgroundColor=(backgroundColor)=>{
        updateSectionDesign(selectedSectionId, {
            backgroundColor: {
                ...backgroundColorObject,
                [visionMode]: backgroundColor
            }
        })
    }
    const  bgTransparent = backgroundColor === "#00000000"
    const homePageBgColor = generalDesign.backgroundColor[visionMode]
    return(
      <div>
        <div className='d-f align-items-center g-3 mb-3'>
            <input type='checkbox' checked={bgTransparent} onChange={()=>bgTransparent ? updatebackgroundColor(homePageBgColor) : updatebackgroundColor('#00000000')} style={{zoom: '0.8'}} />
            <h4>{ translate('Transparent background') }</h4>
        </div>
        { !bgTransparent && <div className='d-f align-items-center g-3'>
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
         
        </div> }
        <DialogComponent open={showColorPicker} backDropPressCloses={false} close={ ()=>setShowColorPicker(false) }>
          <ColorPicker color={backgroundColor.slice(0, 7)} onChange={updatebackgroundColor} />
        </DialogComponent>
        <LocalApplyToAll
          chain={[
            translate('Swiper background color')
          ]}
          type={translate('Swipers')}
          action={applyToAllAction}
        />
      </div>
    )
  }

const EditSwiperMarginTop=()=>{
  const {sectionDesign, updateSectionDesign, sections, selectedSectionId} = useCustomizeHomePageContext()

  const marginTop = sectionDesign.marginTop

  const applyToAllAction=()=>{
    sections.filter(sec=>sec.type === 'swiper').forEach(section=>{
      updateSectionDesign(section.id, {
          marginTop
      })
    })
  }
  const updateMarginTop=(marginTop)=>{
    updateSectionDesign(selectedSectionId, {
        marginTop,
    })
}
  return (
    <div>
      <div className='d-f align-items-center g-3'>
            <p>{ translate('Margin top') }:</p>
        </div>
        <Range
           min={0}
           max={56}
           step={2}
          value={marginTop}
          setValue={(value)=>updateMarginTop(Number(value))}
        />
      <LocalApplyToAll
        chain={[
          translate('Margin top')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

const EditSwiperMarginHorizontal=()=>{
  const {sectionDesign, updateSectionDesign, sections, selectedSectionId} = useCustomizeHomePageContext()

  const marginHorizontal = sectionDesign.marginHorizontal

  const applyToAllAction=()=>{
    sections.filter(sec=>sec.type === 'swiper').forEach(section=>{
      updateSectionDesign(section.id, {
          marginHorizontal
      })
    })
  }
  const updateMarginHorizontal=(marginHorizontal)=>{
    updateSectionDesign(selectedSectionId, {
        marginHorizontal,
    })
}
  return (
    <div>
      <div className='d-f align-items-center g-3'>
          <p>{ translate('Margin horizontal') }:</p>
      </div>
      <Range
          min={0}
          max={56}
          step={2}
        value={marginHorizontal}
        setValue={(value)=>updateMarginHorizontal(Number(value))}
      />
      <LocalApplyToAll
        chain={[
          translate('Margin top')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

const EditSwiperGap=()=>{
  const {sectionDesign, updateSectionDesign, sections, selectedSectionId} = useCustomizeHomePageContext()

  const gap = sectionDesign.gap

  const applyToAllAction=()=>{
    sections.filter(sec=>sec.type === 'swiper').forEach(section=>{
      updateSectionDesign(section.id, {
          gap
      })
    })
  }
  const updateGap=(gap)=>{
    updateSectionDesign(selectedSectionId, {
        gap,
    })
}
  return (
    <div>
      <div className='d-f align-items-center g-3'>
          <p>{ translate('Gap') }:</p>
      </div>
      <Range
          min={0}
          max={56}
          step={2}
        value={gap}
        setValue={(value)=>updateGap(Number(value))}
      />
      <LocalApplyToAll
        chain={[
          translate('Gap')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

const EditSwiperType=()=>{
  const {sectionDesign, updateSectionDesign, sections, selectedSectionId} = useCustomizeHomePageContext()

  const swiperType = sectionDesign.swiperType

  const applyToAllAction=()=>{
    sections.filter(sec=>sec.type === 'swiper').forEach(section=>{
      updateSectionDesign(section.id, {
          swiperType
      })
    })
  }
  const updateSwiperType=(swiperType)=>{
    updateSectionDesign(selectedSectionId, {
        swiperType,
    })
  }
  return (
    <div>
      <span>{ translate('Swiper type') }:</span>
      <div className='d-f flex-wrap g-2 mt-1'>
        {
        productsDisplayOptions.map(op=>(
            <Button
              outline={swiperType === op.value} 
              onClick={()=>updateSwiperType(op.value)} 
              className='px-2 rounded-4 p-0' key={op.value} >{ op.label }</Button>
          ))
        }
      </div> 
      <LocalApplyToAll
        chain={[
          translate('Swiper type')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

const EditJustifyContent=()=>{
  const {sectionDesign, updateSectionDesign, sections, selectedSectionId} = useCustomizeHomePageContext()

  const justifyContent = sectionDesign.justifyContent

  const applyToAllAction=()=>{
    sections.filter(sec=>sec.type === 'swiper').forEach(section=>{
      updateSectionDesign(section.id, {
          justifyContent
      })
    })
  }
  const updateJustifyContent=(justifyContent)=>{
    updateSectionDesign(selectedSectionId, {
        justifyContent,
    })
  }
  return (
    <div>
      <span>{ translate('Images display') }:</span>
      <div className='d-f flex-wrap g-2 mt-1'>
        {
        justifyContentOptions.map(op=>(
            <Button
              outline={justifyContent === op.value} 
              onClick={()=>updateJustifyContent(op.value)} 
              className='px-2 rounded-4 p-0' key={op.value} >{ op.label }</Button>
          ))
        }
      </div> 
      <LocalApplyToAll
        chain={[
          translate('Images display')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

const EditImageBorderRadius=({updateImageBorderProperty})=>{
  const {sectionDesign, isMobile} = useCustomizeHomePageContext()
  const { radius: radiusString } = sectionDesign.image.border
  let unit = radiusString[radiusString.length - 1]
  let radius;

  if (unit === '%'){
    radius = Number(radiusString.slice(0, radiusString.length - 1))
  }

  else {
    unit = 'px'
    radius = Number(radiusString.slice(0, radiusString.length - 2))
  }

  const selectedUnit=(unit)=>{
    const newBorderRadius = unit === 'px' ? (isMobile ? '4px': '8px') : '10%'
    updateImageBorderProperty('radius', newBorderRadius)
  }

  const min = 0
  const max = unit === 'px' ? 56 : 50
  const step = 2
  return (
    <div>
      <div className='d-f align-items-center g-3 justify-content-between'>
          <p >{ translate('Radius') }:</p>
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
          value={radius}
          setValue={(value)=>updateImageBorderProperty('radius', `${ value }${unit}`)}
          unit={unit}
        />
    </div>
  )
}

const EditImageBorderColor=({updateImageBorderProperty})=>{
  const {sectionDesign, visionMode} = useCustomizeHomePageContext()
  const {color: colorObject } = sectionDesign.image.border

  const color = colorObject[visionMode].slice(0,7)
  const colorOpacity =  colorObject[visionMode].slice(7,9)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const updateColorOpacity=(colorOpacity)=>{
    updateImageBorderProperty('color', {
      ...colorObject,
      [visionMode] : `${color}${colorOpacity}`
    })
  }
  return(
    <div >
      <div>
        <div className='d-f align-items-center g-3'>
          <p>{ translate('Color') }:</p>
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
        <div className="d-f align-items-center">
          <span>{ translate('Opacity') }:</span>
          <Range
            min={0}
            max={99}
            step={1}
            value={hexToNumber(colorOpacity)}
            setValue={(value)=>updateColorOpacity(numberToHex(value))}
          />
        </div>
        <DialogComponent open={showColorPicker} backDropPressCloses={false} close={ ()=>setShowColorPicker(false) }>
          <ColorPicker color={color} onChange={(newColor)=>{
            updateImageBorderProperty('color', {
                ...colorObject,
                [visionMode]: `${newColor}${colorOpacity}`
            })
          }} />
        </DialogComponent>
      </div>
    </div>
  )
}

const EditImageBorderWith=({updateImageBorderProperty})=>{
  const {sectionDesign} = useCustomizeHomePageContext()
  const { width } = sectionDesign.image.border

  return (
    <div>
      <div className='d-f align-items-center g-3'>
          <p>{ translate('Width') }:</p>
      </div>
      <Range
          min={1}
          max={4}
          step={1}
        value={width}
        setValue={(value)=>updateImageBorderProperty('width', Number(value))}
      />
    </div>
  )
}

const EditImageBorder = ({updateImageProperty, applyImageBorderToAllAction})=>{
  const {sectionDesign} = useCustomizeHomePageContext()
  const image = sectionDesign.image
  const border= image.border
  const updateImageBorderProperty=(id, value)=>{
    const newBorder = {
      ...image.border,
      [id]: value
    }
    updateImageProperty('border', newBorder)
  }

  return (
    <div>
        <p>{ translate('Images borders') }</p>
        <div className='container p-1 mt-1'>
          <EditImageBorderRadius updateImageBorderProperty={updateImageBorderProperty } />
        </div>
        <div className='container p-1 mt-1'>
          <EditImageBorderColor updateImageBorderProperty={updateImageBorderProperty } />
        </div>
        <div className='container p-1 mt-1'>
          <EditImageBorderWith updateImageBorderProperty={updateImageBorderProperty } />
        </div>
        
        <div className='my-2' />
        <LocalApplyToAll 
          chain={[
            translate('Images borders')
          ]}
          action={()=>applyImageBorderToAllAction(border)}
          type={translate('Swipers')}
        />
    </div>
  )
}


const EditImageAspectRatio=({updateImageProperty, applyImagePropertyToAll})=>{
  const {sectionDesign } = useCustomizeHomePageContext()

  const aspectRatio = sectionDesign.image.aspectRatio
  const objectFit = sectionDesign.image.objectFit

  const applyToAllAction=()=>{
    applyImagePropertyToAll({aspectRatio, objectFit})
  }
  return (
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
                    onClick={()=>{updateImageProperty('aspectRatio', ar.value)}}
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
                    onClick={()=>updateImageProperty('objectFit', op.value)} 
                    className='px-2 rounded-4 p-0' key={op.value} >{ op.label }</Button>
                ))
                }
            </div>  
          </div> 
          <LocalApplyToAll
            chain={[
              translate('Image aspect ratio and display'),
            ]} 
            action={applyToAllAction}
          />
      </div>
  )
}

const EditImageWidth=({updateImageProperty, applyImagePropertyToAll})=>{
  const {sectionDesign, isMobile } = useCustomizeHomePageContext()
  const widthString = sectionDesign.image.width

  let width
  let unit = widthString[widthString.length - 1]
  if (unit === '%'){
    width = Number(widthString.slice(0, widthString.length - 1))
  }
  else {
    unit = 'px'
    width = Number(widthString.slice(0, widthString.length - 2))
  }
 
  
  const selectedUnit=(unit)=>{
    const newWidth = unit === 'px' ? (isMobile ? '160px': '260px') : ( isMobile ? '50%' : '20%')
    updateImageProperty('width', newWidth)
  }
  const min = unit === 'px' ? 120 : (isMobile ? 20 : 5)
  const max = unit === 'px' ? (isMobile ? 380 : 980) : 100
  const step = unit === 'px' ? (isMobile ? 10 : 20) : 5
  return(
    <div>
      <div className='d-f align-items-center g-3 justify-content-between'>
          <p>{ translate('Image width') }:</p>
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
        setValue={(value)=>updateImageProperty('width', `${value}${unit}`)}
        unit={unit}
      />
      <LocalApplyToAll
        chain={[
          translate('Image width'),
        ]} 
        action={()=>applyImagePropertyToAll({width: widthString})}
      />
    </div>
  )
}

const EditImage=()=>{
  const {sectionDesign, updateSectionDesign, sections, selectedSectionId, selectedDevice} = useCustomizeHomePageContext()

  const image = sectionDesign.image

  const updateImage=(image)=>{
    updateSectionDesign(selectedSectionId, {
        image,
    })
  }

  const updateImageProperty=(id, value)=>{
      const newImage = {
        ...image,
        [id]: value
      }
      updateImage(newImage)
  }
  
  const applyImageBorderToAllAction=(border)=>{
    sections.filter(sec=>sec.type === 'swiper').forEach(section=>{
      updateSectionDesign(section.id, {
        image: {
          ...section.design[selectedDevice].image,
          border
        }
      })
    })
  }

  const applyImagePropertyToAll=(newImage)=>{
    sections.filter(sec=>sec.type === 'swiper').forEach(section=>{
      updateSectionDesign(section.id, {
        image: {
          ...section.design[selectedDevice].image,
          ...newImage
        }
      })
    })
  }
  
  return(
    <div>
      <div className='p-1 m-2 container'>
        <EditImageBorder updateImageProperty={updateImageProperty} applyImageBorderToAllAction={applyImageBorderToAllAction} />
      </div>
      <div className='p-1 m-2 container'>
        <EditImageAspectRatio {...{updateImageProperty, applyImagePropertyToAll}} />
      </div>
      <div className='p-1 m-2 container'>
       <EditImageWidth {...{updateImageProperty, applyImagePropertyToAll}} />
      </div>
    </div>
  )
}

const EditSwiperExtention = () => {
  const applySectionToAll = useApplySectionToAll('swiper')

    return (
      <div style={{height: '100%'}} className='column'>
        <div style={{overflowY: 'auto'}}>
            <h3 className='p-2'>{ translate('Edit swiper') }</h3>
            <hr/>
            <div className='p-1  m-2 container'>
                <EditSwiperBackground />
            </div>
            <div className='p-1 m-2 container'>
                <EditSwiperMarginTop />
            </div>
            <div className='p-1  m-2 container'>
              <EditSwiperMarginHorizontal />
            </div>
            <div className='p-1  m-2 container'>
              <EditSwiperGap />
            </div>
            <div className='p-1 m-2 container'>
              <EditSwiperType/>
            </div>
            <div className='p-1 m-2 container'>
              <EditJustifyContent />
            </div>
            <EditImage />
        </div>        
        <ApplyToAll action={applySectionToAll} />
      </div>

    )
}


export default EditSwiperExtention
