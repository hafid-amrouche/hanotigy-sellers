import Button from 'components/Button'
import DialogComponent from 'components/tags/Dialog'
import React, { useState } from 'react'
import { translate } from 'utils/utils'

export const ApplyToAll=({action, ...props})=>{
 
  const [show, setShow] = useState(false)
    
  const confirmAction=()=>{
    action()
    setShow(false)
  }
  return (
    <>
      <Button  onClick={()=>setShow(true)} style={{border: '0', borderRadius: 0}} {...props}>{ translate('Apply to all') }</Button>
      <DialogComponent open={show} close={()=>setShow(false)}>
        <div className='container p-2'>
          <h4>
            {translate('Are you sure you want to apply this settings to all categories')}
          </h4>
          <div className='d-f mt-3 g-3' style={{justifyContent: 'end'}}>
            <Button outline onClick={confirmAction}>{ translate('Yes') }</Button>
            <Button theme='dark' onClick={()=>setShow(false)}>{ translate('No') }</Button>
          </div>
        </div>
      </DialogComponent>
    </>
  )
}
