import DialogComponent from 'components/tags/Dialog'
import React, { useEffect, useRef } from 'react'

const PreviewVariants = ({showPreview, setShowPreview}) => {
    const ref = useRef()
    useEffect(()=>{
        if (showPreview) {
          ref.current?.open()
        }
    }, [showPreview])
  return (
    <DialogComponent ref={ref} close={()=>setShowPreview(false)}>
        <div className='container' style={{
            maxWidth: '90vw', 
            maxHeight: '90vh',
            width: 800,
            height:600
        }}>
        </div>
    </DialogComponent>
  )
}

export default PreviewVariants