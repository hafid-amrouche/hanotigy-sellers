import React, { useEffect, useState } from 'react'
import classes from '../general.module.css'
import Img from 'components/Img'
import facebookImage from '../../assets/icons/apps/facebook.png'
import { translate } from 'utils/utils'
import Input from 'components/tags/Input'
import Button from 'components/Button'
import { useBrowserContext } from 'store/browser-context'
import axios from 'axios'
import { apiUrl } from 'constants/urls'
import IconWithHover from 'components/IconWithHover'


const FacebookPixel = () => {
  const [pixel, setPixel] = useState('')
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const {setGlobalMessageA} = useBrowserContext()
  const setUpFBPixel = async()=>{
      setLoading(true)
      try{
          const {data} = await axios.post(
              apiUrl + '/store/set-up-fb-pixel',
              {
                  store_id: localStorage.getItem('storeId'),
                  pixel_id: pixel.trim(),
              },
              {
                  headers:{
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
              }
          )
          setGlobalMessageA({
              color: 'var(--successColor)',
              children: data.detail,
              time: 3000
          })
          setActive(true)
      }catch(err){
          setGlobalMessageA({
              color: 'red',
              children: translate('Error setting up your facebook pixel'),
              time: 3000
          })
          
      }
      setLoading(false)
          
  }
  const [fetchingData, setFetchingData] = useState(true)
  const [error, setError] = useState(false)
  const getFBPixel=async()=>{ 
      setFetchingData(true)
      setError(false)
      try{
          const {data} = await axios.get(
              apiUrl + '/store/get-fb-pixel?store_id='+ localStorage.getItem('storeId'),
              {
                  headers:{
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
              }
          )
          const fbPixel = data.fbPixel
          if(fbPixel){
              setPixel(fbPixel)
              setActive(true)
          }else{
              setActive(false)
          }
              
      }catch(err){
          setError(true)

      }
      setFetchingData(false)
          
  }

  const [deleting, setDeleting] = useState(false)
  const deleteFBPixel=async()=>{ 
      setDeleting(true)
      try{
          const {data} = await axios.post(
              apiUrl + '/store/delete-fb-pixel',
              {
                  store_id:  localStorage.getItem('storeId')
              },
              {
                  headers:{
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
              }

          )
          setActive(false)
          setPixel('')
      }catch(err){
          setGlobalMessageA({
              children: translate('Error while removing your facebook pixel, try again'),
              color: 'red',
              time: 4000
          })
      }
      setDeleting(false)
  }

  useEffect(()=>{
      getFBPixel()
  }, [])
  return (
    <div className={classes['container']}>
        <div className={classes['card'] + ' d-f '}>
            <Img src={facebookImage} width={ 100 } style={{ objectFit: 'cover' }}/>
            <div className='flex-1'>
                <h3 className='color-primary'>{translate('Facebook pixel') }</h3>
                <p className='lh-1'>{translate('Add facebook pixel to your store to improve our conversion rate.')}</p>
            </div>
        </div>
        <div className={classes['card'] + ' column g-4 '} disabled={deleting}>
          <div className='d-f align-items-center justify-content-between'>
            <h3 className='color-primary'>{ translate('Setup your facebook pixel') }</h3>
            { active && <IconWithHover onClick={deleteFBPixel} iconClass='fa-solid fa-trash color-red'/> }
          </div>
            
            <Input label='Facebook Pixel ID' disabled={active} value={pixel} onChange={setPixel} />
            { !active && <Button disabled={loading} onClick={setUpFBPixel} >{ translate('Submit') }</Button>}
        </div>
        {
            error && !fetchingData && <div className={classes['card'] + ' column g-4 align-items-center'}>
              <IconWithHover size={80} onClick={getFBPixel} iconClass='fa-solid fa-rotate-right color-red py-3' />
            </div>
        }
    </div>
  )
}

export default FacebookPixel