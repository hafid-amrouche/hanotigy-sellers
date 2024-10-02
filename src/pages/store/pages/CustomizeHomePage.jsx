import React from 'react'
import classes from './CustomizeHomePage.module.css'
import CustomizeHomePageContextProvider from './customize-home-page/store/CustomizeHomePageContext'
import DeviceTypeArea from './customize-home-page/components/DeviceTypeArea'
import ViewPageSection from './customize-home-page/sections/ViewPageSection'
import EditSection from './customize-home-page/sections/EditSection'
import SectionsSection from './customize-home-page/sections/SectionsSection'



const InnerCustomizeHomePage = () => { 
  return (
    <div className='p-2 p-relative' style={{backgroundColor: 'var(--containerColor)'}} id='home-page' >
      <div className={'d-f g-3 flex-1' + classes['container']} style={{height: 'calc(100vh - 12px)', paddingTop: 38}}>
        <DeviceTypeArea />
        <SectionsSection />
        <ViewPageSection />
        <EditSection />
      </div>
    </div>
  )
}

const CustomizeHomePage=()=>(
  <CustomizeHomePageContextProvider>
    <InnerCustomizeHomePage />
  </CustomizeHomePageContextProvider>
)

export default CustomizeHomePage