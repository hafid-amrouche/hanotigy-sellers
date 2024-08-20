import React, { useEffect, useState } from 'react'
import Input from '../../components/tags/Input'
import { isAccaptableCharacter, translate } from '../../utils/utils'
import axios from 'axios'
import { apiUrl } from '../../constants/urls'

const UsernameSection = ({username, setUsername, usernameValid, setUsernamValid}) => {
    const [validUsernamesList, setValidUsernamesList] = useState({
        '' : false
    })
    
    const usernameChangeHandler=(value)=>{
        if (value === '') {
            setUsername('')
            return
        }
        const lastChar = value[value.length - 1]
        if (!isAccaptableCharacter(lastChar)) return;
        if (value.length > 20) return;
        value = value.toLocaleLowerCase()
        setUsername(value)
        // check if username valid in server
        const usernameChecked = validUsernamesList[value]
        if (usernameChecked !== undefined) setUsernamValid(usernameChecked)
        else{
            setValidUsernamesList(state=>({
                ...state,
                [value] : false 
            }))
            axios.get(apiUrl + '/check-username?username=' + value).then(({data})=>{
                setValidUsernamesList(state=>({
                    ...state,
                    [data.username] : data.isValid
                }))
            })
        }        
    }

    useEffect(()=>{
        setUsernamValid(validUsernamesList[username])
    }, [username, validUsernamesList, setUsernamValid])
    
  return (
    <>
        <Input type='text' className={ username === '' ? undefined : (usernameValid ? 'success' : 'error')} label={translate('Username')}  onChange={usernameChangeHandler} value={username} />
    </>
  )
}

export default UsernameSection