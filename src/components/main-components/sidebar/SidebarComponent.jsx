import React, {useState} from 'react'
import classes from './SidebarComponent.module.css'
import { NavLink } from 'react-router-dom'

const ChildComponet=({iconClass, label, link, onClick})=>(
  <NavLink to={'/' + link} rel='path' end className={({isActive})=>`${classes.component} ${isActive ? classes.active : ''}`} onClick={onClick}>
        <i className={`${iconClass} ${classes.icon}`} ></i>
        <label className={classes.label}>{label}</label>
  </NavLink>
)

const SidebarComponent = ({iconClass, label, link, onClick, childrenData}) => {
  const clickHandler=(e)=>{
      if (childrenData) {
        e.preventDefault()
        setShowChildren(state=>!state)
      } 
      else onClick()
  }
  const [showChildren, setShowChildren] = useState(false) 
  return (
    <div>
      <NavLink to={'/' + link}  className={({isActive})=>`${classes.component} ${isActive ? classes.active : ''}`} onClick={clickHandler}>
          <i className={`${iconClass} ${classes.icon}`} ></i>
          <label className={classes.label}>{label}</label>
      </NavLink>
      {childrenData && showChildren && (
          <div className={classes['children-container']}>
            {childrenData.map((component)=><ChildComponet key={component.link} {...component} onClick={onClick} />)}
          </div>
        )}
    </div>
    
  )
}

export default SidebarComponent