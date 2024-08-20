import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiUrl } from '../../constants/urls'
import axios from 'axios'
import { useBrowserContext } from '../../store/browser-context'
import ClickOutsideComponent from '../ClickOutsideComponent'
import IconWithHover from '../IconWithHover'
import { useUserContext } from '../../store/user-context'
import classes from './UserButton.module.css'
import Loader from '../Loader'
import { translate } from '../../utils/utils'

const UserButton=({size=22})=>{
    const {userData, setUserData} = useUserContext()
    const [showParameters, setShowParameters]= useState(false)
    const {globalMessageA, setGlobalMessageA} = useBrowserContext()
  
    const navigate = useNavigate()
    useEffect(()=>{
      if (globalMessageA) setShowParameters(false)
    }, [globalMessageA]) 
  
    const [loading, setloading]=useState(false)
    const logout=async()=>{
      setloading(true)
      try{
        await axios.post(
          apiUrl + "/user/logout", 
          {
            token: userData.token
          },
          {
              headers : {
                "Content-Type": "application/json",
                Authorization : 'Bearer ' + userData.token
              }
          }
        )
        setGlobalMessageA({
          color: 'var(--successColor)',
          time: 3000,
          children: translate('You are logged out')
        })
        setShowParameters(false)
        setUserData(null)
        navigate('/login/')
      }catch(error){
        console.error(error)
        setGlobalMessageA({
          color: 'red',
          time: 3000,
          children: translate('Logout Failed')
        })
      }
      setloading(false)
    }

    //
    return(
      <ClickOutsideComponent listeningCondintion={showParameters}  onClickOutside={setShowParameters.bind(this, false)}>
        <IconWithHover iconClass="fa-solid fa-user" size={size} color={'var(--primaryColor)'} onClick={setShowParameters.bind(this, !showParameters)} />
        {showParameters &&(
            <div className={classes['user-paramters'] + ' container'} >
              {!userData &&
                (<>
                  <Link to='/login' onClick={setShowParameters.bind(this, false)} className='d-f g-2 align-center p-2'><i className="fa-solid fa-user" style={{fontSize: 20, width: 26}} /> <h4>Login</h4></Link>
                  <Link to='/register' onClick={setShowParameters.bind(this, false)} className='d-f g-2 align-center p-2'><i className="fa-solid fa-user-plus" style={{fontSize: 20}} /> <h4>Register</h4></Link>
                </>)
              }
              {userData &&
                (<>
                <div className='d-f g-3 align-center p-2 cursor-pointer no-event'>
                  <i className='fa-solid fa-user' style={{fontSize: 22}} />
                  <h4>{ userData.full_name }</h4>
                </div>
                <hr/>
                <div disabled={loading} onClick={logout} className='d-f g-2 align-center p-2 cursor-pointer'>
                  <i className="fa-solid fa-right-to-bracket" style={{fontSize: 20, width: 26}} /> 
                  <h4 style={{flexGrow:1}}>Logout</h4>
                  { loading && <Loader diam={22}/>}
                </div>
                </>)
              }
            </div>
          
            
        )}
      </ClickOutsideComponent>
        
    )
  }
  
export default UserButton