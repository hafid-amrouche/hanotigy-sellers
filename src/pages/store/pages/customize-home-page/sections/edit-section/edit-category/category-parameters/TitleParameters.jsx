import React, { useState } from 'react'
import { translate } from 'utils/utils'
import ColorPicker from 'components/ColorPicker'
import DialogComponent from 'components/tags/Dialog'
import Button from 'components/Button'
import Range from 'components/Range'
import { useCustomizeHomePageContext } from 'pages/store/pages/customize-home-page/store/CustomizeHomePageContext'
import LocalApplyToAll from '../../components/LocalApplyToAll'


const EditTitleColor=({updateColor})=>{
    const {sectionDesign, visionMode} = useCustomizeHomePageContext()
    const color =  sectionDesign.title.label.color[visionMode]
    const [showColorPicker, setShowColorPicker] = useState(false)
    const applyToAllAction=()=>{
      updateColor(color, true)
    }
    return(
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
        <DialogComponent open={showColorPicker} backDropPressCloses={false} close={ ()=>setShowColorPicker(false) }>
          <ColorPicker color={color} onChange={updateColor} />
        </DialogComponent>
        <LocalApplyToAll
          chain={[
            translate('Title'),
            translate('Color')
          ]} 
          action={applyToAllAction}
        />
      </div>
    )
}
const EditTitleDirection =({updateTitle})=>{
    const {sectionDesign} = useCustomizeHomePageContext()

    const titleDesign = sectionDesign.title
    const {
        direction,
    } = titleDesign

    const applyToAllAction=()=>{
      updateTitle('direction', direction, true)
    }
    return(
        <div>
            <span>{ translate('Position') }</span>
            <div className='d-f align-items-center g-2 justify-content-end'>
                <Button
                    className='px-2 p-0 rounded-4' 
                    onClick={()=>{updateTitle('direction', 'start')}}
                    outline={direction === 'start' }
                >{ translate('Start') }</Button>
                <Button 
                    className='px-2 p-0 rounded-4'
                    onClick={()=>{updateTitle('direction', 'center')}}  
                    outline={direction === 'center' }
                >{ translate('Center') }</Button>
            </div>
            <LocalApplyToAll
              chain={[
                translate('Title'),
                translate('Position')
              ]} 
              action={applyToAllAction}
            />
        </div>
    )
}

const EditTitleSize=({updateTitle})=>{
  const {sectionDesign} = useCustomizeHomePageContext()    
  const titleSize = sectionDesign.title.size

  const applyToAllAction=()=>{
    updateTitle('size', titleSize, true)
  }
  return(
    <div>
      <div className='d-f align-items-center g-3'>
          <p>{ translate('Size') }:</p>
      </div>
      <Range
        min={12}
        max={54}
        step={2}
        value={titleSize}
        setValue={(value)=>updateTitle('size', Number(value))}
      />
      <LocalApplyToAll
        chain={[
          translate('Title'),
          translate('Size')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

const EditTitlePadding=({updateTitle})=>{
  const {sectionDesign} = useCustomizeHomePageContext()    
  const titlePadding = sectionDesign.title.padding

  const applyToAllAction=()=>{
    updateTitle('padding', titlePadding, true)
  }
  return(
    <div>
      <div className='d-f align-items-center g-3'>
          <p>{ translate('Padding') }:</p>
      </div>
      <Range
        min={0}
        max={16}
        step={2}
        value={titlePadding}
        setValue={(value)=>updateTitle('padding', Number(value))}
      />
      <LocalApplyToAll
        chain={[
          translate('Title'),
          translate('Padding')
        ]} 
        action={applyToAllAction}
      />
    </div>
  )
}

export {EditTitleColor, EditTitleDirection, EditTitleSize, EditTitlePadding}
