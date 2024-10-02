import React, { useEffect, useState } from 'react'
import classes from '../general.module.css'
import Img from 'components/Img'
import tiktokImage from '../../assets/icons/apps/tiktok.png'
import { translate } from 'utils/utils'
import Input from 'components/tags/Input'
import Button from 'components/Button'
import { useBrowserContext } from 'store/browser-context'
import axios from 'axios'
import { apiUrl } from 'constants/urls'
import IconWithHover from 'components/IconWithHover'


const TiktokPixels = () => {
  const [pixel, setPixel] = useState('')
  const [pixelsList, setPixelsList] = useState([])
  const [loading, setLoading] = useState(false)
  const {setGlobalMessageA} = useBrowserContext()
  const setUpTiktokPixel = async()=>{
      setLoading(true)
      try{
          const {data} = await axios.post(
              apiUrl + '/store/set-up-tiktok-pixel',
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
          setPixelsList(pixelsList=>[...pixelsList, pixel])
          setPixel('')
      }catch(err){
          setGlobalMessageA({
              color: 'red',
              children: translate('Error setting up your tiktok pixel'),
              time: 3000
          })
          
      }
      setLoading(false)
          
  }
 
  const [fetchingData, setFetchingData] = useState(true)
  const [error, setError] = useState(false)
  const getTiktokPixel=async()=>{ 
      setFetchingData(true)
      setError(false)
      try{
          const {data} = await axios.get(
              apiUrl + '/store/get-tiktok-pixel?store_id='+ localStorage.getItem('storeId'),
              {
                  headers:{
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
              }
          )
          const tiktokPixels = data.tiktokPixels
          setPixelsList(tiktokPixels)
              
      }catch(err){
          setError(true)

      }
      setFetchingData(false)
          
  }

  const [deleting, setDeleting] = useState(false)
  const deleteTiktokPixel=async(pixel_id)=>{ 
      setDeleting(true)
      try{
          const {data} = await axios.post(
              apiUrl + '/store/delete-tiktok-pixel',
              {
                  store_id:  localStorage.getItem('storeId'),
                  pixel_id: pixel_id
              },
              {
                  headers:{
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
              }

          )
          setPixelsList(pixelsList=>pixelsList.filter(pix =>  pix !== pixel_id))
          setPixel('')
      }catch(err){
          setGlobalMessageA({
              children: translate('Error while removing your tiktok pixel, try again'),
              color: 'red',
              time: 4000
          })
      }
      setDeleting(false)
  }


  useEffect(()=>{
      getTiktokPixel()
  }, [])
  return (
    <div className={classes['container']}>
        <div className={classes['card'] + ' d-f '}>
            <Img src={tiktokImage} width={ 100 } style={{ objectFit: 'cover' }}/>
            <div className='flex-1'>
                <h3 className='color-primary'>{translate('Tiktok pixels') }</h3>
                <p className='lh-1'>{translate('Add tiktok pixel to your store to improve our conversion rate from your tiktok ad account')}</p>
            </div>
        </div>
        <div className={classes['card'] + ' column g-4 '} disabled={deleting}>
            <h3 className='color-primary'>{ translate('Setup your tiktok pixel') }</h3>
            {pixelsList.map(pix=>(
                <div key={pix} className='d-f g-3 align-items-center'>
                    <Input label='Tiktok Pixel ID' disabled  value={pix} onChange={setPixel} />
                    <IconWithHover onClick={deleteTiktokPixel.bind(this, pix)} iconClass='fa-solid fa-trash color-red'/>
                </div>
                    
            ))}
            <div className='d-flex g-3'>
                <Input label='Tiktok Pixel ID' value={pixel} onChange={setPixel} />
                <Button disabled={loading || !pixel.trim()} onClick={setUpTiktokPixel} outline style={{width: 56, aspectRatio: 1}} ><i className='fa-solid fa-check' /></Button>
            </div>
        </div>

        {
            error && !fetchingData && <div className={classes['card'] + ' column g-4 align-items-center'}>
              <IconWithHover size={80} onClick={getTiktokPixel} iconClass='fa-solid fa-rotate-right color-red py-3' />
            </div>
        }
    </div>
  )
}

export default TiktokPixels