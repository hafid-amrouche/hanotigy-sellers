import React, { useState } from 'react'
import { useCustomizeHomePageContext } from '../../../store/CustomizeHomePageContext'
import { translate } from 'utils/utils'
import DialogComponent from 'components/tags/Dialog'
import ColorPicker from 'components/ColorPicker'

const EditGeneralDesign = () => {
    const {generalDesign, updateGeneralDesign, visionMode }= useCustomizeHomePageContext()
    const backgroundColorObject = generalDesign.backgroundColor
    const backgroundColor = backgroundColorObject[visionMode]

    const [showColorPicker, setShowColorPicker] = useState(false)

    const updateBackgoundColor=(newBackgroundColor)=>{
      updateGeneralDesign({
        backgroundColor: {
            ...backgroundColorObject,
            [visionMode]: newBackgroundColor
        }
    })
    }
    return(
      <div className='p-2'>
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
          <ColorPicker color={backgroundColor} onChange={updateBackgoundColor} />
        </DialogComponent>
      </div>
    )
}

export default EditGeneralDesign