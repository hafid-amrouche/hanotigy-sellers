import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import classes from './MultipleSelect.module.css'
import { adjustScrollPosition } from '../../utils/utils'
import ClickOutsideComponent from '../ClickOutsideComponent'


const MultipleSelect = forwardRef(({options, defaultSelectedOptions=[], selectedOptions=null, onShowOptions=()=>{}, onChange=()=>{}, label, topStyle, emptyOptionElemnt, containerStyle}, ref) => {

  useImperativeHandle(ref, ()=>({
    closeDropDown: ()=>setDropdownShown(false)
  }))

  const [dropDownshown, setDropdownShown] = useState(false)
  const [innerSelectedOptions, setInnerSelectedOptions] = useState(selectedOptions || defaultSelectedOptions)
  const clickHandler=(selectedOption)=>{
    setInnerSelectedOptions(options=>{
      const exists = options.some(obj => obj.id === selectedOption.id)
      if (exists) return options.filter(obj => obj.id !== selectedOption.id);
      else return [...options, selectedOption];
    })
  }

  const dropDownRef = useRef()
  useEffect(()=>{
    if(dropDownshown) {
      adjustScrollPosition(dropDownRef.current)
      onShowOptions()
    }
  }, [dropDownshown])

  useEffect(()=>{
    onChange(innerSelectedOptions)
  }, [innerSelectedOptions])

  useEffect(()=>{
    setInnerSelectedOptions(selectedOptions)
  }, [selectedOptions])

  const finalSelectedOptions = (selectedOptions !== null) ? selectedOptions: innerSelectedOptions
  const selectedOptionString = `${ finalSelectedOptions.map(obj=>obj.label).join(' | ')}`  
  return (
    <ClickOutsideComponent onClickOutside={()=>setDropdownShown(false)} listeningCondintion={dropDownshown}  style={containerStyle}>
      <div className='p-relative'>
        <div className={'cursor-pointer ' + classes['select-container']} onClick={()=>setDropdownShown(state=>!state)} style={topStyle}>
          <h4 className='flex-1 cut-text'>
            {finalSelectedOptions.length === 0 && label }
            {selectedOptionString}
            
          </h4>
          <i className={`fa-solid fa-chevron-${dropDownshown ? 'up' : 'down'}`} ></i>
        </div>
        {dropDownshown && (
          <div className={classes['options-box']} ref={dropDownRef}>
            <div className={classes['option-box__container']}>
              {options.map(option=>(
                  <div key={option.id} className={ 'cursor-pointer ' + classes.option} onClick={clickHandler.bind(this, option)}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        backgroundImage:`url(${option.image})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        borderRadius: 4,
                        border: '1px solid var(--borderColor)'
                      }}
                    />
                    <input type='checkbox' checked={ finalSelectedOptions.map(obj=>obj.id).includes(option.id)} onChange={()=>{}} />
                    <h4>{option.label}</h4>
                  </div>
              ))}
              {options.length === 0 && emptyOptionElemnt}
            </div>
          </div>
        )}
      </div>
    </ClickOutsideComponent>
      
  )
}
)
export default MultipleSelect