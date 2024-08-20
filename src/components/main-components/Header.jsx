import React from 'react'
import classes from './Header.module.css'
import IconWithHover from '../IconWithHover'
import { useBrowserContext } from '../../store/browser-context'
import GlobalMessage from '../notifications/GlobalMessage'
import logo from '.././../assets/logo.svg'
import {useUserContext} from '../../store/user-context'
import UserButton from './UserButton'

const Header = ({setOpen}) => {
  const {globalMessageA}=useBrowserContext()
  const {userData}= useUserContext()
  return (
    <>
      <header id='header' style={{position: 'sticky', top: 0, zIndex:1002}}>
        <div className={classes.header}>
          { userData && <IconWithHover iconClass="fa-solid fa-bars" onClick={()=>setOpen(true)} />}
          <button><img src={logo} width={100} /></button>
          <div>
            <UserButton />
          </div>
        </div>
        <div  style={{position: 'sticky', top: 0}}>
          {globalMessageA && <GlobalMessage children={globalMessageA.children} />}
        </div>
      </header>
      <div style={{position: 'sticky', top: 0, zIndex:1001}}>
        {globalMessageA && <GlobalMessage children={globalMessageA.children} />}
      </div>
    </>
    
  )
}

export default Header