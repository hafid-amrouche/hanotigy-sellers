import React, { useState } from 'react'
import { translate } from 'utils/utils'
import ShippingByStateSection from 'components/ShippingByState'
import Button from 'components/Button'
import axios from 'axios'
import { apiUrl } from 'constants/urls'
import { useBrowserContext } from 'store/browser-context'
import Loader from '../../components/Loader'
import { useUserContext } from 'store/user-context'

const Shipping = () => {
  const {setUserData, userData} = useUserContext()
  const [states, setStates] = useState(userData.shippingCosts)
  const [loading, setLoading] = useState(false)
  const {setGlobalMessageA} = useBrowserContext()
  const updateShippingCosts=async()=>{
    setLoading(true)
    try{
      await axios.post(
        apiUrl + '/store/update-shipping-costs',
        {
          costs_list: states.map(state=>({
            id: state.id,
            cost: state.cost,
            costToHome: state.costToHome
          }))
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      )
      
      setGlobalMessageA({
        color: 'var(--successColor)',
        children: translate('You settings were saved'),
        time: 3000
      })
      setUserData(userData=>({
        ...userData,
        shippingCosts: states
      }))
    }
    catch(error){
      setGlobalMessageA({
        color: 'red',
        children: translate('You settings were not saved'),
        time: 3000
      })
    }
    setLoading(false)
  }
  
  return (
    <div className='container m-2 column p-1'>
        <h3 className='color-primary p-2'>{translate('Shipping ')} ({translate('DA')})</h3>
        <div className='column g-3' style={{marginBottom: 100}}>
          <ShippingByStateSection {...{states, setStates}} />
          <div style={{position: 'fixed', bottom: 0, width: '100%', left: 0}}>
           <div className='p-2'>
            <Button className='g-3' outline onClick={updateShippingCosts} background style={{width: '100%'}}>
                <i className='fa-solid fa-bookmark'/>
                <h3 className='color-inherit'>
                  { translate('Save') }
                </h3>
                { loading && <Loader diam={22} />}
              </Button>
           </div>
          </div>
        </div>
    </div>
  )
}

export default Shipping