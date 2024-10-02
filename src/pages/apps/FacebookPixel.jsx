import React, { useEffect, useRef, useState } from 'react'
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

const FacebookSinglePixel = ({pixelData, deletePixel, updatePixels}) => {
  const [pixel, setPixel] = useState(pixelData.fbPixel)
  const [active, setActive] = useState(!!pixelData.fbPixel)
  const [token, setToken] = useState(pixelData.apiToken || '')
  const [tokenActive, setTokenActive] = useState(!!pixelData.apiToken)
  const [apiChecked, setApiCheked] = useState(!!pixelData.apiToken)
  const [loading, setLoading] = useState(false)
  const [testCode, setTestCode] = useState(pixelData.eventTestCode || '')
  const defaultTestCode = useRef(pixelData.eventTestCode || '')
  const [testEventChecked, setTestEventchecked] = useState(!!pixelData.eventTestCode)
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
          updatePixels(pixelData.fbPixel, {
            ...pixelData,
            fbPixel: pixel
          })
      }catch(err){
          setGlobalMessageA({
              color: 'red',
              children: err.response.data.detail,
              time: 3000
          })
          
      }
      setLoading(false)
          
  }
  const setUpConversionApi = async()=>{
    setLoading(true)
    try{
        const {data} = await axios.post(
            apiUrl + '/store/set-up-conversions-api', 
            {
                store_id: localStorage.getItem('storeId'),
                conversion_api_access_token: token.trim(),
                pixel_id: pixel
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
        setTokenActive(true)
    }catch(err){
        setGlobalMessageA({
            color: 'red',
            children: translate('Error setting up your conversions api token'),
            time: 3000
        })
    }
    setLoading(false)
        
}

  const [deleting, setDeleting] = useState(false)
  const deleteFBPixel=async()=>{ 
      setDeleting(true)
      try{
          const {data} = await axios.post(
              apiUrl + '/store/delete-fb-pixel',
              {
                  store_id:  localStorage.getItem('storeId'),
                  pixel_id: pixel.trim(),
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

          setTokenActive(false)
          setApiCheked(false)
          setToken('')

          setTestEventchecked(false)
          setTestCode('')
          deletePixel(pixelData.fbPixel)
      }catch(err){
          setGlobalMessageA({
              children: translate('Error while removing your facebook pixel, try again'),
              color: 'red',
              time: 4000
          })
      }
      setDeleting(false)
  }

  const deleteApiToken=async()=>{ 
    setDeleting(true)
    try{
        const {data} = await axios.post(
            apiUrl + '/store/delete-conversions-api',
            {
                store_id:  localStorage.getItem('storeId'),
                pixel_id: pixel.trim(),
            },
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }

        )
        setTokenActive(false)
        setToken('')
        setApiCheked(false)
        setTestCode('')
        setTestEventchecked(false)
    }catch(err){
        setGlobalMessageA({
            children: translate('Error while removing conversions api token, try again'),
            color: 'red',
            time: 4000
        })
    }
    setDeleting(false)
}

  // Test code

  const deleteTestCode=async()=>{
    const prevTestCode = testCode
    setTestCode('')
    setTestEventchecked(false)
    const response = await updatetestCode('')
    if (!response){
        setTestCode(prevTestCode)
        setTestEventchecked(true)
    }
  }

  const onCheck=(checked)=>{
    setTestEventchecked(checked)
    if (!checked){
        deleteTestCode()
    }
  }

  const updatetestCode=async(code)=>{
    setLoading(true)
    const trimmedTestCode = code.trim()
    try{
        const {data} = await axios.post(
            apiUrl + '/store/set-up-test-event-code',
            {
                store_id: localStorage.getItem('storeId'),
                test_event_code: trimmedTestCode || null,
                pixel_id: pixel.trim(),
            },
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        )
        setTestCode(trimmedTestCode)
        defaultTestCode.current = trimmedTestCode
        setLoading(false)
        if(trimmedTestCode){
            setGlobalMessageA({
                color: 'var(--successColor)',
                children: translate('Events test code is set successfully'),
                time: 3000
            })
        }
        return true
    }catch(err){
        setGlobalMessageA({
            color: 'red',
            children: translate('Error setting up your test code'),
            time: 3000
        })
        setLoading(false)
        return false
    }
  }
  return (
    <div className={classes['card'] + ' column g-4 '} disabled={deleting}>
        <div className='d-f align-items-center justify-content-between'>
        <span/>
        { active && <IconWithHover onClick={deleteFBPixel} iconClass='fa-solid fa-trash color-red'/> }
        </div>
        <div className='d-flex g-3'>
            <Input label='Facebook Pixel ID' disabled={active} value={pixel} onChange={setPixel} />
            { !active && <Button outline disabled={loading || !pixel.trim()} onClick={setUpFBPixel} style={{width: 56}} ><i className='fa-solid fa-check'/></Button>}
        </div>
            

        { active && <>
            { !tokenActive && <div className='d-f align-items-center g-3'>
                <input type='checkbox' checked={apiChecked} onChange={e=>setApiCheked(e.target.checked)} />
                <h3 className='color-primary'>{ translate('Conversions API') }</h3>
            </div>}
                
            { apiChecked &&  <div className='d-flex flex-column g-3'>
                <div className='d-flex g-3 align-items-center'>
                    <Input label='Conversions API token' disabled={tokenActive} value={token} onChange={setToken} />
                    { !tokenActive && <Button outline style={{width: 56, height: 56}} disabled={loading || token.trim().length === 0} onClick={setUpConversionApi} ><i className='fa-solid fa-check'/></Button>}
                    { tokenActive && <IconWithHover iconClass='fa-solid fa-xmark' size={28} disabled={loading} onClick={deleteApiToken} />}
                </div>
                { tokenActive &&  <>
                        <div className='d-flex g-3 align-items-center'>
                            <input type='checkbox' checked={testEventChecked} onChange={e=>onCheck(e.target.checked)} /> 
                            { !testEventChecked && <h4>{ translate('Test event code') }</h4>}
                            {
                                testEventChecked && <>
                                    <input value={testCode} onChange={e=>setTestCode(e.target.value)} className='box-input' style={{width: 200}} placeholder={translate('Test event code')} />
                                    { testCode !== defaultTestCode.current && <Button outline style={{width: 44, height: 44}} disabled={loading || token.trim().length === 0} onClick={updatetestCode.bind(this, testCode)} ><i className='fa-solid fa-check'/></Button>}

                                </>
                            }
                        </div>
                        { (testEventChecked && testCode.trim()) && <h4 className='lh-1' style={{opacity:0.9}}>{ translate('If you are not testing keep this field empty') }</h4>}
                    </>
                }
            </div>}
        </>
        }
    </div>
  )
}

const FacebookPixel=()=>{
    const [fbPixels, setFbPixels] = useState([])
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
            if(data.length === 0) setFbPixels([{
                apiToken : null,
                eventTestCode: null ,
                fbPixel : "",
            } ])
            else{
                setFbPixels(data)
            }
                
        }catch(err){
            setError(true)
  
        }
        setFetchingData(false)
            
    }
    useEffect(()=>{
        getFBPixel()
    }, []) 
    
    const deletePixel=(pixelId)=>{
        setFbPixels(fbPixels=>fbPixels.filter(elem=>elem.fbPixel !== pixelId))
    }
    const updatePixels=(pixelId, pixelData)=>{
        setFbPixels(fbPixels=>{
            const newList = [...fbPixels]
            newList.find(elem=> elem.fbPixel === pixelId).fbPixel = pixelData.fbPixel
            return newList
        })
    }
    console.log(fbPixels)
    return (
        <div className={classes['container']}> 

            <div className={classes['card'] + ' d-f '}>
                <Img src={facebookImage} width={ 100 } style={{ objectFit: 'cover' }}/>
                <div className='flex-1'>
                    <h3 className='color-primary'>{translate('Facebook pixel and Conversions API') }</h3>
                    <p className='lh-1'>{translate('Add meta pixel and conversions api to your store to improve our conversion rate.')}</p>
                </div>
            </div>
            {
                fbPixels && fbPixels.map(pixel=>(
                    <FacebookSinglePixel 
                        key={pixel.fbPixel} 
                        pixelData={pixel} 
                        deletePixel={deletePixel} 
                        updatePixels={updatePixels}
                    />
                ))
            }
            <div className={classes['card']}>
                <Button 
                    className='col-12 g-3' 
                    onClick={()=>setFbPixels(fbPixels=>[...fbPixels, 
                    {
                        apiToken : null,
                        eventTestCode: null ,
                        fbPixel : "",
                    }    
                    ])}
                    disabled={(fbPixels.length > 0 && fbPixels[fbPixels.length-1].fbPixel) === ''}
                >
                    <i className='fa-solid fa-plus-square'/>
                    { translate('Add ') }
                </Button>
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