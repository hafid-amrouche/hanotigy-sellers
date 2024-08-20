import React, { useEffect } from 'react'
import { useLocation, useNavigate,  } from 'react-router-dom';

const Redirect = ({redirect}) => {
    const location = useLocation()
    redirect = redirect || location.search.replace('?redirect=', '')
    const navigate = useNavigate()
    useEffect(()=>{
        navigate(redirect, { replace: true })
    }, [navigate])
    
  return null
}

export default Redirect