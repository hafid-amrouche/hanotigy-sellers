import React, { useEffect } from 'react'
import logo from '../assets/logo.svg'
import classes from './Home.module.css'
import UserButton from '../components/main-components/UserButton'
import Button from '../components/Button'
import { translate } from '../utils/utils'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../store/user-context'

const Home = () => {
  const navigate = useNavigate()
  const {userData} = useUserContext()
  useEffect(()=>{
    if (userData) navigate('/dashboard/')
  }, [userData])
  return (
    <div className={classes.container}>
        <div className={ classes['home-header'] + ' d-f align-center'}>
           <div>
                <img src={logo} width={100} />
                <h3>Pricing</h3>
           </div>
           <div className={classes['large-screen']} >      
            <Button onClick={()=>navigate('/login')} outline className='g-3'><i className='fa-solid fa-user' />{translate('Login')}</Button>
            <Button  onClick={()=>navigate('/register')} outline className='g-2'><i className='fa-solid fa-user-plus' />{translate('Register')}</Button>
           </div>
           <div className={classes['small-screen']}>
            <UserButton size={28}/>
           </div>
           
           
        </div>
        <div className={'column align-center flex-1 ' + classes['intro']}>
          <h1>
            {translate('Set-up your store in just few clicks')}
          </h1>
          <div>
            <h3>{translate('Get started now')}</h3>
          </div>
          <Button  onClick={()=>navigate('/register')} className='g-2'><i className='fa-solid fa-user-plus' />{translate('Register')}</Button>
        </div>
    </div>
  )
}

export default Home