import React from 'react'
import classes from './IconWithHover.module.css'


const IconWithHover = ({iconClass, color, size, onClick, className, style, ...props}) => {
  return (
      <i className={`${iconClass} ${className} ` + classes.icon } style={{color, fontSize: size, ...style}} onClick={onClick} {...props}></i>
  )
}

export default IconWithHover
