import React, { lazy, useState } from 'react'

import SuspenseComponent from '../../components/SuspenseComponent'
import IconWithHover from 'components/IconWithHover';

let PreviewVariants = lazy(()=>import('./variants-section/PreviewVariants'))


const ProductPreview = () => {
    const [showPreview, setShowPreview] = useState(false)
  return (
    <>
    <div style={{position: 'fixed', zIndex: 200, bottom: 0, right:0, display: 'flex', justifyContent:'flex-end', padding: 16}}>
        <IconWithHover className='fa-solid fa-eye color-primary jiggle' style={{backgroundColor: 'var(--containerColor)', padding: 8, borderRadius: 16, border: 'var(--borderColor) 1px solid'}} onClick={()=>setShowPreview(true)} />
    </div>
    { showPreview && 
        <div>
            <SuspenseComponent {...{showPreview, setShowPreview, }} Component={PreviewVariants} />
        </div>
    }
    </>
  )
}

export default ProductPreview