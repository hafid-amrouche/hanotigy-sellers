import Button from "components/Button"
import DialogComponent from "components/tags/Dialog"
import { useState } from "react"
import { translate } from "utils/utils"

export const LocalApplyToAll=({chain, action, type})=>{
  const [show, setShow] = useState(false)
    
  const confirmAction=()=>{
    action()
    setShow(false)
  }
  return (
    <div className='d-f' style={{justifyContent: 'end'}}>
      <span onClick={()=>setShow(true)} style={{color: 'var(--primaryColor)', textDecoration:'underline', cursor:'pointer'}}>{ translate('Apply to all') }</span>
      <DialogComponent open={show} close={()=>setShow(false)}>
        <div className='container p-2'>
          <h4>
            {translate('Are you sure you want to apply this settings "{chain}" to all {type}', { chain: chain.join(' > '), type})}
          </h4>
          <div className='d-f mt-3 g-3' style={{justifyContent: 'end'}}>
            <Button outline onClick={confirmAction}>{ translate('Yes') }</Button>
            <Button theme='dark' onClick={()=>setShow(false)}>{ translate('No') }</Button>
          </div>
        </div>
      </DialogComponent>
    </div>
  )
}
  export default LocalApplyToAll;