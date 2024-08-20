import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import classes from './Input.module.css'
import { slugify, trimStart } from 'utils/utils'

const Input = forwardRef(({
  className= '', 
  containerClassName = '',
  label, 
  type, 
  defaultValue='',
  onFocus=()=>{}, 
  onBlur=()=>{}, 
  onChange=()=>{},
  value=null, 
  placeholder, 
  isSlug, 
  placeholderLabel,
  style,
  error,
  ...props
  }, 
  ref
) => {
  const [innerType, setInnerType] = useState(type)
  const [labelOnTop ,setLabelOnTop] = useState(false)
  const [innerValue, setInnerValue] = useState(defaultValue)
  const changeHandler=(value)=>{
    const newValue = isSlug ? slugify(value) : trimStart(value)
    setInnerValue(newValue)
    onChange(newValue)
  }
  const clickHandler=()=>{
    setInnerType(state=>state === 'password' ? 'text' : 'password')
  }
  const focusHandler=(e)=>{
    setLabelOnTop(true)
    onFocus(e)
  }
  const blueHandler=(e)=>{
    setLabelOnTop(false)
    const newValue = isSlug ? e.target.value.replace(/-$/, '') : e.target.value.trim()
    onBlur(newValue)
    setInnerValue(newValue)
  }
  const inputRef = useRef()  

  // setValue from outside
  useImperativeHandle(ref, () => ({
    setValue: (newValue)=>changeHandler(newValue),
    classList: inputRef.current.classList
  }));


  const inputValue= value === null ? innerValue : value 
  const raiseLabel = (labelOnTop) ||( inputValue !== '')

  return (
    <div className={containerClassName} style={{width: '100%'}}>
      <div className='p-relative align-center ' >
        <div className='p-relative align-center' >
          <input value={inputValue} style={{padding: '20px 8px 4px 8px', ...style}} onChange={(e)=>changeHandler(e.target.value)} placeholder={placeholder} onFocus={focusHandler} onBlur={blueHandler} type={innerType} className={ `  ${type==='password' ? classes['password'] : ''} box-input ${error ? 'error' : ''} ${placeholder ? classes['placeholder-exist'] : ''} ${className || ''}`} ref={inputRef} {...props} />
          { !placeholder && <label style={{width: `calc(100% - 16px)`, top: !raiseLabel ? 12 : undefined}} onClick={()=>inputRef.current.focus() } className={`${classes['label']} ${error ? 'error ' : ''} ${ raiseLabel ? classes['label-on-top'] : ''} cut-text  ${type==='password' ? classes['password'] : ''}`}>{(raiseLabel ||  !placeholderLabel) ? label : placeholderLabel}</label>}
        </div>
        {type == 'password' && <i onClick={clickHandler} className={'fa-solid fa-eye' + (innerType === 'password' ? ' ' : '-slash ' ) + classes['eye']} />}
      </div>
      { error && <h4 className='error mt-2'>{error}</h4>}
    </div>
      

  )
})

export default Input