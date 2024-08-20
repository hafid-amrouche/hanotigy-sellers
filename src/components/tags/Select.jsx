import React, { useEffect, useRef, useState } from 'react'
import classes from './Select.module.css'
import ClickOutsideComponent from '../ClickOutsideComponent'
import { adjustScrollPosition } from '../../utils/utils'

const Select = ({options, selectedOption, disabled, onChange=()=>{}, containerStyle}) => {
  const [dropDownshown, setDropdownShown] = useState(false)
  const [innerSelectedOption, setInnerSelectedOption] = useState(selectedOption)

  const finalSelectedOption = selectedOption || innerSelectedOption
  const clickHandler=(option)=>{
    setDropdownShown(false)
    if (option.label == finalSelectedOption.label ) return
    setInnerSelectedOption(option)
    onChange(option)
  }

  const dropDownRef = useRef()
  useEffect(()=>{
    if(dropDownshown) adjustScrollPosition(dropDownRef.current)
  }, [dropDownshown])
  return (
    <ClickOutsideComponent onClickOutside={()=>setDropdownShown(false)} listeningCondintion={dropDownshown} style={containerStyle} >
      <div className='p-relative cursor-pointer' disabled={disabled}>
        <div className={classes['select-container']} onClick={()=>setDropdownShown(state=>!state)}>
          <h4 className='color-primary' style={{width: '100%', minHeight: 30}}>{finalSelectedOption.label}</h4>
          <i className={`fa-solid fa-chevron-${dropDownshown ? 'up' : 'down'} color-primary`} ></i>
        </div>
        {dropDownshown && (
          <div className={classes['options-box']} ref={dropDownRef}>
            <div className={classes['option-box__container']}>
              {options.map(option=>(
                  <div disabled={option.disabled} key={option.id} style={{minHeight: 42}} className={classes.option} onClick={clickHandler.bind(this, option)}>{option.label}</div>
                ))}
            </div>
          </div>
        )}
      </div>
    </ClickOutsideComponent>
      
  )
}

export default Select