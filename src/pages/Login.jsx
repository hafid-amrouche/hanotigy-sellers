import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { Message } from '../Components/Message'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useUserContext } from '../store/user-context'
import { apiUrl } from '../constants/urls'
import { translate } from '../utils/utils'
import { useBrowserContext } from '../store/browser-context'
import Input from '../components/tags/Input'
import  classes from './Login.module.css'
import Button from '../components/Button'
import Loader from '../components/Loader'
import logo from '../assets/logo.svg'
import KeyboardAvoidingDiv from '../components/KeyboardAvoidingDiv'
import GlobalMessage from '../components/notifications/GlobalMessage'
import stateJson from '../json/state.json'

const config = {
  headers : {
    "Content-Type": "application/json",
  }
}

const Login = () => {
  // get the redirect value
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect');
  
  // login states
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const passwordChangeHandler=(value)=>{
    if (value.endsWith(' ')) {
        return
    }
    setPassword(value)
    setError(false)
  }
  const usernameChangeHanlder=(value)=>{
    setUsername(value)
    setError(false)
  }
  //
  const navigate  = useNavigate()

  // Login submition handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {setGlobalMessageA, globalMessageA} = useBrowserContext()
  useEffect(() => {
      if (error) setGlobalMessageA({
        color: 'red',
        time: 4000,
        children: error.response.data.detail || error.message
      })
  }, [error])
  
  const login = async(event)=>{
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {    
      const response = await axios.post(
        `${apiUrl}/user/login`,
      {
        username : username.toLocaleLowerCase().trim(),
        password : password
      },
      config
      );
      
      const newUserData = {
        ...response.data, 
        shippingCosts: response.data.shippingCosts.map(state=>({
          ...stateJson.find(stt=>stt.id === state.id),
          ...state
        })),
        loginDate:new Date()}
      setUserData(newUserData)
      setLoading(false)
      setError(null)
      setGlobalMessageA({
        color: 'var(--successColor)',
        children: translate('Welcome back :)'),
        time: 3000
      })
      navigate( redirect || '/dashboard')

    } catch (error) {
      // Handle errors
      console.log(error.response?.data?.detail)
      setGlobalMessageA({
        color: 'red',
        children: error.response?.data?.detail || error.message,
        time: 3000
      })
      setError(error)
      setLoading(false)
    }
  }
  
  /////////////////////////
  // refresh component when userData is updated
  const {setUserData} =  useUserContext()
  useEffect(()=>{
    if (redirect != null){
      navigate(redirect)
    }
  }, [navigate, redirect])

  // check for redirects
  const {setMetaData} = useBrowserContext()
  useEffect(()=>{
    setMetaData({
      title: translate('Login') + ` | ${translate('Hanotify')}`,
      description: translate('Login to your account at Hanotify.')
    })
  },[])

  //
  const isDisabled = username.trim() === '' || password === ''|| password.length < 8 || error || loading
  return (
   <div className={ classes['login-container']}>
    <div className='p-sticky'>
      {globalMessageA && <GlobalMessage children={globalMessageA.children} />}
    </div>
    <div className={ classes['login-card']}>
      <div className='column align-center g-4'>
        <img src={logo} width={200}/>
        <h3>{ translate('Login to your account at Hanotify')}</h3>
      </div>
      <KeyboardAvoidingDiv className='column'>
        <div className={classes['input-container']}>
          <Input type='text' label={translate('Username')} className={error ? 'error' : undefined} value={username} onChange={usernameChangeHanlder} />
          <Input type='password' label={translate('Password')} className={error ? 'error' : undefined} onChange={passwordChangeHandler} value={password} /> 
        </div>
        <Button className='flex-1' disabled={isDisabled} onClick={login}><h3>Login</h3> { loading && <Loader diam={22} /> }</Button>
      </KeyboardAvoidingDiv>
      <div className='d-f g-2 align-center'><h4>{translate('You do not have an account?')}</h4>  <Link to='/register/'><h4 className='color-primary'>Register</h4></Link></div>
      
    </div>
   </div>
  )
}

export default Login