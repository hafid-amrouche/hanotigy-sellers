import axios from 'axios';
import { filesUrl } from 'constants/urls';
import React, { useEffect, useRef, useState } from 'react'
import { translate, cleanHtml } from 'utils/utils'
import classes from '../../Store.module.css'
import Button from 'components/Button';
import Loader from 'components/Loader';
import { useBrowserContext } from 'store/browser-context';
import CutomizedMessage from '../components/CutomizedMessage'


const Li = ({children})=>(
  <div className='d-f g-2 align-items-center lh-12'>
    <i className='fa-solid fa-circle-dot' style={{fontSize: 12}}></i>
    {children}
  </div>
)


const ThankYoupage = () => {
  const [showOrderInfo, setShowOrderInfo] = useState(true) 
  const [message, setMessage] = useState()
  const [showRelatedProducts, setShowRelatedProducts] = useState(true)

  const showOrderInfoRef = useRef(true)
  const messageRef = useRef()
  const showRelatedProductsRef = useRef(true)

  const [loading, setLoading] = useState(false)
  const {setGlobalMessageA} = useBrowserContext()

  const [fecthing, setFetching] = useState(false)
  const getThankYouData=async()=>{
    setFetching(true)
    const {data} = await axios.get(
      filesUrl + '/get-thank-you-for-edit?store_id=' + localStorage.getItem('storeId'),
      {
        'headers': {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
    setShowOrderInfo(data.showOrderInfo)
    setShowRelatedProducts(data.showRelatedProducts)
    setMessage(data.message)

    showOrderInfoRef.current = data.showOrderInfo
    messageRef.current = data.message
    showRelatedProductsRef.current = data.showRelatedProducts

    setFetching(false)
  }
  useEffect(()=>{
    getThankYouData()
  }, [])
  const updateThankYou=async()=>{
    setLoading(true)
    try{
      await axios.post(
        filesUrl + '/save-thank-you',
        {
          store_id: localStorage.getItem('storeId'),
          thank_you: {
            showOrderInfo,
            message : cleanHtml(message),
            showRelatedProducts
          }
        },
        {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      )
      
    showOrderInfoRef.current = showOrderInfo
    messageRef.current = message
    showRelatedProductsRef.current = showRelatedProducts
      setGlobalMessageA({
        'color': 'var(--successColor)',
        children: translate('Thank you page was updated successfully'),
        time: 3000
      })
    }catch{
      setGlobalMessageA({
        'color': 'red',
        children: translate('Error while updating the thank you page'),
        time: 3000
      })
    }
    setLoading(false)
  }

  const disabled = 
  (showOrderInfo === showOrderInfoRef.current)  &&
  (message === messageRef.current) &&
  (showRelatedProducts === showRelatedProductsRef.current)
 
  if (fecthing) return(
    <div className='d-f align-items-center justify-content-center flex-1'>
        <Loader diam={100} />
    </div>
  )
  return (
    <div>
        <h3>{translate('Customize your thank you page')}</h3>
        <div  className='column g-4 mt-2'>
          <div className='container p-2'>
              <div className='d-f g-3 align-items-center'>
                <input checked={showOrderInfo} onChange={e=>setShowOrderInfo(e.target.checked)} type='checkbox' />
                <h3 className='color-primary'>{translate('Show order informations')}</h3>
              </div>
              { showOrderInfo && 
                <div className='mt-2'>
                  <h4>
                    { translate('Client will see order information which includes:') }
                  </h4>
                  <div className='px-2'>
                      <Li>{ translate('Product title') }</Li>
                      <Li>{ translate('Product image')}</Li>
                      <Li>{ translate('Order variants') }</Li>
                      <Li>{ translate('Price') }</Li>
                      <Li>{ translate('Quantity') }</Li>
                      <Li>{ translate('Shipping price') }</Li>
                      <Li>{ translate('Total price') }</Li>
                  </div>
                </div>
              }
          </div>
          <div className='container p-2'>
              <div className={'column g-3 ' + classes['footer']}>
                <h3 className='color-primary'>{translate('Customized message')}</h3>
                <CutomizedMessage {...{message, setMessage}} />
              </div>
          </div>
          
          <div className='container p-2 mb-4'>
            <div className='d-f g-3 align-items-center'>
              <input checked={showRelatedProducts} onChange={e=>setShowRelatedProducts(e.target.checked)} type='checkbox' />
              <h3 className='color-primary'>{translate('Show related products')}</h3>
            </div>
            { showRelatedProducts && <h4 className='mt-2'>{ translate('This section will change according to the product settings') }</h4>}
          </div>
        </div>
        <div style={{position: 'fixed', width: '100%', left: 0, right: 0, padding: '5px 10px', bottom: 0, backgroundColor:'var(--containerColor)', zIndex: 120}}>
            <Button className='g-3 w-100' disabled={disabled} onClick={updateThankYou}>
                <i className='fa-solid fa-bookmark'/>
                { translate('Save') }
                {loading && <Loader diam={22} />}
            </Button>
        </div>
    </div>
  )
}

export default ThankYoupage