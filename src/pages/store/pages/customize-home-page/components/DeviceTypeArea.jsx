import Button from 'components/Button'
import React, { useEffect } from 'react'
import { useCustomizeHomePageContext } from '../store/CustomizeHomePageContext'
import { useDialogContext } from 'components/tags/Dialog'
const DeviceButton=({type, className, setSelectedDevice, selectedDevice})=>(<Button background outline={selectedDevice === type} onClick={()=>setSelectedDevice(type)} className='px-1'><i style={{fontSize: 24, width: 32}} className={className} /></Button>)


const DeviceTypeArea = () => {
    const {setSelectedDevice, selectedDevice, setFullScreen, fullScreen, setselectedSectionId} = useCustomizeHomePageContext()
    useEffect(()=>{
      if (fullScreen) setselectedSectionId(null)
      else setselectedSectionId('general-design')
    }, [fullScreen])

    const {closeDialog} = useDialogContext()
  return (
    <div style={{position: 'absolute', top: 4, right: 22, zIndex: 2}}>
      <div className='d-f g-3 m-2'>
          <Button background onClick={()=>{fullScreen ? closeDialog() : setFullScreen(true)}} >
            <i className={`fa-solid fa-${fullScreen ? 'compress' : 'expand'}`}></i>
          </Button>
          <DeviceButton type='mobile' setSelectedDevice={setSelectedDevice} selectedDevice={selectedDevice} className={'fa-solid fa-mobile-screen'} />    
          <DeviceButton type='PC' setSelectedDevice={setSelectedDevice} selectedDevice={selectedDevice} className={'fa-solid fa-laptop'} />    
      </div>
    </div>
      
  )
}

export default DeviceTypeArea