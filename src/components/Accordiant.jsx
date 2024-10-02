import React from 'react'
import IconWithHover from './IconWithHover'
import classes from './Accordiant.module.css'

const Accordiant = ({checked, setChecked, size=18, style, ...props}) => {
  return (
      <div style={{display: 'flex', ...style}} className='p-1'>
        <IconWithHover style={{ height: size, width: size, textAlign: 'center' }} iconClass={'fa-solid fa-chevron-right ' + classes['icon'] + ' ' + ( checked ? classes['checked'] : '' ) } size={size} onClick={()=>setChecked(!checked)} {...props}/>
      </div>
  )
}

export default Accordiant