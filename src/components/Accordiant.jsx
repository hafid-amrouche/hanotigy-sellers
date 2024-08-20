import React from 'react'
import IconWithHover from './IconWithHover'
import classes from './Accordiant.module.css'

const Accordiant = ({checked, setChecked, size=18, ...props}) => {
  return (
        <IconWithHover style={{ padding: '8px' }} iconClass={'fa-solid fa-chevron-up ' + classes['icon'] + ' ' + ( checked ? classes['checked'] : '' ) } size={size} onClick={()=>setChecked(!checked)} {...props}/>
  )
}

export default Accordiant