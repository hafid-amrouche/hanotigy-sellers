import axios from 'axios'
import Loader from 'components/Loader'
import { filesUrl } from 'constants/urls'
import React, { useEffect, useRef, useState } from 'react'
import { useBrowserContext } from 'store/browser-context'
import { cleanHtml, translate } from 'utils/utils'
import classes from '../../Store.module.css'
import CutomizedMessage from '../components/CutomizedMessage'
import Button from 'components/Button'


const PrivacyPolicy = () => {
  const [message, setMessage] = useState()
  const messageRef = useRef()
  const [fecthing, setFetching] = useState(false)
  const getPrivacyPolicyData=async()=>{
    setFetching(true)
    const {data} = await axios.get(
      filesUrl + '/get-privacy-policy-for-edit?store_id=' + localStorage.getItem('storeId'),
      {
        'headers': {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
    setMessage(data)
    messageRef.current = data
    setFetching(false)
  }
  useEffect(()=>{
    getPrivacyPolicyData()
  }, [])
  const [loading, setLoading] = useState(false)
  const {setGlobalMessageA} = useBrowserContext()

  const updatePrivacyPolicy=async()=>{
    setLoading(true)
    try{
      await axios.post(
        filesUrl + '/save-privacy-policy',
        {
          store_id: localStorage.getItem('storeId'),
          privacy_policy: cleanHtml(message)
        },
        {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      )
      
    messageRef.current = message
      setGlobalMessageA({
        'color': 'var(--successColor)',
        children: translate('Privacy policy was updated successfully'),
        time: 3000
      })
    }catch{
      setGlobalMessageA({
        'color': 'red',
        children: translate('Error while updating the Privacy policy'),
        time: 3000
      })
    }
    setLoading(false)
  }

  const disabled = (message === messageRef.current)
  if (fecthing) return(
    <div className='d-f align-items-center justify-content-center flex-1'>
        <Loader diam={100} />
    </div>
  )

  return (
    <div>
        <h3>{translate('Customize your Privacy policy')}</h3>
        <div  className='column g-4 mt-2'>
              <div className={classes['footer']}>
                <CutomizedMessage {...{message, setMessage}} />
              </div>
        </div>
        <div style={{position: 'fixed', width: '100%', left: 0, right: 0, padding: '5px 10px', bottom: 0, backgroundColor:'var(--containerColor)', zIndex: 120}}>
            <Button className='g-3 w-100' disabled={disabled} onClick={updatePrivacyPolicy}>
                <i className='fa-solid fa-bookmark'/>
                { translate('Save') }
                {loading && <Loader diam={22} />}
            </Button>
        </div>
    </div>
  )
}

export default PrivacyPolicy