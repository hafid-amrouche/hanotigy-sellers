import React, { forwardRef } from 'react'
import classes from './Button.module.css'

const Button = forwardRef(({children, theme, className, background, outline=false, ...props}, ref) => {
  return (
    <button ref={ref} className={classes.btn + ` ${background ? classes['background'] : ''} no-select ${classes[theme] || ''}  ${outline ? classes['outline'] : ''} ${className}`} {...props}>
        {children}
    </button>
  )
})

export default Button