import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { Message } from '../Components/Message'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useUserContext } from '../store/user-context'
import { apiUrl } from '../constants/urls'
import { isArabicOrLatinLetter, isAccaptableCharacter, translate } from '../utils/utils'
import { useBrowserContext } from '../store/browser-context'
import Input from '../components/tags/Input'
import  classes from './Login.module.css'
import Button from '../components/Button'
import Loader from '../components/Loader'
import UsernameSection from './register/UsernameSection'
import logo from '../assets/logo.svg'
import KeyboardAvoidingDiv from '../components/KeyboardAvoidingDiv'
import GlobalMessage from '../components/notifications/GlobalMessage'
import stateJson from '../json/state.json'

const config = {
  headers : {
    "Content-Type": "application/json",
  }
}

const Register = () => {
  // get the redirect value
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect');
  
  // registarion states
  const [registrationInputs, setRegistrationInputs] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  })
  const [errorInputs, setErrorInputs] = useState({
    firstName: null,
    lastName: null,
    password: null,
    confirmPassword: null,
  })
  const inputChangeHandler=(identifier, value)=>{
    if (value === ''){
      setRegistrationInputs(state=>({
        ...state,
        [identifier] : ''
      }))
      return
    }
    
    const lastChar = value[value.length - 1]
    if(value.length ===1 && lastChar===' ') return;
    if (value.length >= 2){
      const beforeLastChar = value[value.length - 2]
      if (lastChar === ' ' && beforeLastChar === ' ') return;
    }

    if (identifier === 'firstName' || identifier === 'lastName' ){
      if (!isArabicOrLatinLetter(lastChar)) return;
      if (value.length > 20) return;
      setErrorInputs(state=>({
        ...state,
        [identifier]: null,
      }))
    }
    else if (identifier === 'password'){
      if (!isAccaptableCharacter(lastChar)) return;
      if (value.length > 20) return;
      setErrorInputs(state=>({
        ...state,
        password: null,
        confirmPassword: null
      }))
    }
    else if (identifier === 'confirmPassword'){
      if (!isAccaptableCharacter(lastChar)) return;
      if (value.length > 20) return;
      setErrorInputs(state=>{
        return({
        ...state,
        password: (registrationInputs.password.length >= 8) ? null : state.password,
        confirmPassword: null
      })})
    }
    setRegistrationInputs(state=>({
      ...state,
      [identifier] : value
    }))
  }
  //
  const navigate  = useNavigate()

  // registration submition handling
  const [loading, setLoading] = useState(false);
  const {setGlobalMessageA, globalMessageA} = useBrowserContext()
  const register = async()=>{
    setLoading(true)
    try {    
      const response = await axios.post(
        `${apiUrl}/user/register`,
      {
        username : username.toLocaleLowerCase(),
        first_name: registrationInputs['firstName'],
        last_name: registrationInputs['lastName'],
        password : registrationInputs['password'],
        confirm_password: registrationInputs['confirmPassword']
      },
      config
      );
      const newUserData = {
        ...response.data, 
        shippingCosts: response.data.shippingCosts.map(state=>({
          ...stateJson.find(stt=>stt.id === state.id),
          ...state
        })),
        loginDate:new Date()
      }
      setUserData(newUserData)
      setLoading(false)
      setGlobalMessageA({
        color: 'var(--successColor)',
        children: translate('Your account was created successfully :)'),
        time: 3000
      })
      navigate( redirect || '/dashboard/')

    } catch (error) {
      // Handle errors
      setLoading(false)
      setGlobalMessageA({
        time: 4000,
        color: 'red',
        children : error.response.data.detail || error.message
      })
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
      title: translate('Register') + ` | ${translate('Hanotify')}`,
      description: translate('Register an account at Hanotify')
    })
  },[])

  
  const [step, setStep]=useState(1)

  const goNextHandler=()=>{
    if(step===1) {
      if (registrationInputs['firstName'].length < 3) setErrorInputs({
        firstName: translate('Your first name must be at least 3 latters long'),
        lastName: false,
        password: false,
        confirmPassword: false,
      })
      else if (registrationInputs['lastName'].length < 3) setErrorInputs({
        firstName: false,
        lastName: translate('Your last name must be at least 3 latters long'),
        password: false,
        confirmPassword: false,
      })
      else if (registrationInputs['password'].length <= 7) setErrorInputs({
        firstName: false,
        lastName: false,
        password: translate('Your password must be at least 8 latters long'),
        confirmPassword: false,
      })
      else if (registrationInputs['password'] !== registrationInputs['confirmPassword']) setErrorInputs({
        firstName: false,
        lastName: false,
        password: true,
        confirmPassword: translate('Your passwords do not macth'),
      })
      else{
        setStep(2)
      }
        
      return
    }
    register()
  }
  // username section
  const [username, setUsername] = useState('')
  const [usernameValid, setUsernamValid] = useState(false)
  console.log(registrationInputs)
  return (
  <div className={ classes['login-container'] }>
    <div className='p-sticky'>
      {globalMessageA && <GlobalMessage children={globalMessageA.children} />}
    </div>
    <div className={classes['login-card']}>
    <div className='column align-center g-4'>
        <img src={logo} width={200}/>
        <h3>{ translate('Register an account at Hanotify')}</h3>
      </div>
      <KeyboardAvoidingDiv>
        <div className={classes['input-container']}>
          {step === 1 && (<>
            <div>
              <Input type='text' className={errorInputs['firstName'] ? 'error' : undefined} label={translate('First name')} onBlur={inputChangeHandler.bind(this, 'firstName')}  onChange={inputChangeHandler.bind(this, 'firstName')} value={registrationInputs['firstName']} />
              { errorInputs['firstName'] && <h4 className='error'>{ errorInputs['firstName'] }</h4> }
            </div>
            <div>
              <Input type='text' className={errorInputs['lastName'] ? 'error' : undefined} label={translate('Last name')} onBlur={inputChangeHandler.bind(this, 'lastName')}   onChange={inputChangeHandler.bind(this, 'lastName')} value={registrationInputs['lastName']} />
              { errorInputs['lastName'] && <h4 className='error'>{ errorInputs['lastName'] }</h4> }
            </div>
            <div>
              <Input type='password' className={errorInputs['password'] ? 'error' : undefined} label={translate('Password')} onBlur={inputChangeHandler.bind(this, 'password')}  onChange={inputChangeHandler.bind(this, 'password')} value={registrationInputs['password']} /> 
              { errorInputs['password'] && <h4 className='error'>{ errorInputs['password'] }</h4> }
            </div>
            <div>
              <Input type='password' className={errorInputs['confirmPassword'] ? 'error' : undefined} label={translate('Confirm password')}  onBlur={inputChangeHandler.bind(this, 'confirmPassword')} onChange={inputChangeHandler.bind(this, 'confirmPassword')} value={registrationInputs['confirmPassword']} />
              { errorInputs['confirmPassword'] && <h4 className='error'>{ errorInputs['confirmPassword'] }</h4> }
            </div>
          </>)}
          {step === 2 && (
            <div>
              <UsernameSection username={username} setUsername={setUsername} usernameValid={usernameValid} setUsernamValid={setUsernamValid} />
              { username!=='' && !usernameValid && <h4 className='error'>{translate('this username is taken')}</h4>}
              { username!=='' && usernameValid && <h4 className='success'>{translate('this username is all yours')}</h4>}
            </div>
              
          )}
        </div>
        <div className='row-reverse justify-space-between'>
          <Button type='button' className='px-3' disabled={ (step === 2 && !usernameValid )|| loading} onClick={goNextHandler}><h3>{ step ===1 ? translate('Next') : translate('Register')}</h3> { loading && <Loader diam={22} /> }</Button>
          {step===2 && <Button type='button' className='px-3' onClick={()=> setStep(1)}>{ translate('Go back') }</Button>    }
        </div>
      </KeyboardAvoidingDiv>
        
      { step === 1 && <div className='d-f g-2 align-center'><h4>{translate('You already have an account?')}</h4>  <Link to='/login/'><h4 className='color-primary'>Login</h4></Link></div>}
    
    </div>
  </div>
  )
}

export default Register