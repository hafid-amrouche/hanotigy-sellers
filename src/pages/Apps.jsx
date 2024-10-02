import React from 'react'
import facebookImage from '../assets/icons/apps/facebook.png'
import tiktokImage from '../assets/icons/apps/tiktok.png'
import GSImage from '../assets/icons/apps/google-sheets.png'
import { translate } from 'utils/utils'
import SettingsOptionCard from 'components/SettingsOptionCard'

const apps=[
    {
      img: GSImage,
      title: translate('Google Sheets'),
      description: translate('Google Sheets is a spreadsheet app used to organize, format, and calculate your orders.'),
      link: 'google-sheets',
    },
    {
      img: facebookImage,
      title: translate('Facebook pixel and Conversions API'),
      description: translate('Add meta pixel and conversions api to your store to improve our conversion rate.'),
      link: 'facebook-pixel',
    },
    {
      img: tiktokImage,
      title: translate('Tiktok pixels'),
      description: translate('Add tiktok pixel to your store to improve our conversion rate from your tiktok ad account.'),
      link: 'tiktok-pixels',
  },
    
]

const Apps = () => {
  return (
    <div className='container m-2 p-2 d-f g-3 flex-wrap'>
        { apps.map(app=>(
           <SettingsOptionCard key={app.link} {...app} /> 
        )) }
    </div>
  )
}

export default Apps