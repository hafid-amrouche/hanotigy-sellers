import React, { useEffect, useRef } from 'react'
import classes from './OptionsContainer.module.css'
import ClickOutsideComponent from './ClickOutsideComponent'
import { adjustScrollToTop } from 'utils/utils'

const OptionsContainer = ({className, show, scroll=true, children, setShow, style, position= 'absolute', alwaysShown=<></>, props}) => {
  useEffect(()=>{
    if(show && scroll) adjustScrollToTop(ref.current, -60)
  }, [show])
  const ref = useRef()
  return (
    <ClickOutsideComponent onClickOutside={()=>setShow(false)}>
      <div ref={ref}></div>
      {alwaysShown}
      {show &&(
        <>
          <div className='p-relative pb-2'>
            <div className={ `${classes['options']} ${className} right-0 no-select column` } style={{position, ...style }} {...props}>
              <div style={{
                maxHeight: '60vh',
                overflowY: 'auto',
                overflowX: 'hidden',
                marginBottom: 8,
              }}
                className={'container ' + classes['container'] }
              >
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </ClickOutsideComponent>
  ) 
}

export default OptionsContainer