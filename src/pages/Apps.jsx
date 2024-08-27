import React from 'react'
import facebookImage from '../assets/icons/apps/facebook.png'
import GSImage from '../assets/icons/apps/google-sheets.png'
import { translate } from 'utils/utils'
import SettingsOptionCard from 'components/SettingsOptionCard'

const apps=[
    {
        img: facebookImage,
        title: translate('Facebook pixel'),
        description: translate('Add facebook pixel to your store to improve our conversion rate.'),
        link: 'facebook-pixel',
    },
    {
        img: GSImage,
        title: translate('Google Sheets'),
        description: translate('Google Sheets is a spreadsheet app used to organize, format, and calculate your orders.'),
        link: 'google-sheets',
    },
]

const Apps = () => {
  return (
    <div className='container m-2 p-2 d-f g-3'>
        { apps.map(app=>(
           <SettingsOptionCard key={app.link} {...app} /> 
        )) }
    </div>
  )
}

export default Apps