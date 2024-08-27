import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import './ColorPicker.css'
import Button from './Button'
import { isValidHexColor } from 'utils/utils'
import { useDialogContext } from './tags/Dialog'

const ColorPicker = ({color, onChange}) => {
  const [innerColor, setInnerColor] = useState(color)
  const clickHandler=()=>{
    onChange(innerColor)
    closeDialog()
  }
  const colorChangeHandler=(e)=>{
    const newValue = e.target.value
    setInnerColor(newValue)
  }
  const validColor = isValidHexColor(innerColor)
  const {closeDialog} = useDialogContext()
  return (
      <div className='color-picker'>
        <div className='d-f g-3 justify-space-between'>
          <div style={{border: 'var(--greyColor) 1px solid', borderRadius: 4, padding: 2}}>
              <div className='color-box' style={{backgroundColor: color}}/>
          </div>
          <div style={{border: 'var(--greyColor) 1px solid', borderRadius: 4, padding: 2}}>
            <div className='color-box' style={{backgroundColor: innerColor}}/>
          </div>
        </div>
        <HexColorPicker color={color} onChange={(color)=>setInnerColor(color)}/> 
        <div className='d-f g-3 justify-space-between'>
          <Button type='button' onClick={clickHandler} outline disabled={!validColor}>
            <i className='fa-solid fa-check'></i>
          </Button>
          <input value={innerColor} className={'box-input hex-input' + ( validColor ? '' : ' error')} onChange={colorChangeHandler} />
          <Button type='button' theme='red' onClick={closeDialog} >
            <i className='fa-solid fa-xmark'></i>
          </Button>
        </div>
      </div>
  )
}

export default ColorPicker