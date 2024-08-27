import React from 'react'
import shippingImage from '../assets/icons/settings/shipped.png'
import { translate } from 'utils/utils'
import SettingsOptionCard from 'components/SettingsOptionCard'



const Settings = () => {
  return (
    <div className='container m-2 p-2 d-f g-3'>
        <SettingsOptionCard
            img={shippingImage}
            title={translate('Shipping')}
            description={translate('Personlize your shipping cost according to the states')}
            link='shipping'
        />
    </div>
  )
}

export default Settings