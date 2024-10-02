import React, { useEffect, useRef } from 'react'
import { useBrowserContext } from '../../store/browser-context'
import classes from './GlobalMessage.module.css'

const GlobalMessage = ({children}) => {
    const {globalMessageA, setGlobalMessageA} = useBrowserContext()
    const interval1 = useRef()
    const interval2 = useRef()
    const interval3 = useRef()
    useEffect(()=>{ 
        clearInterval(interval1.current)
        clearInterval(interval2.current)
        clearInterval(interval3.current)
        if (globalMessageA && notificationRef.current){ 
            interval1.current = setTimeout(()=>{
                notificationRef.current.style.transform= 'translateY(0%)';
                clearInterval(interval1.current)
            }, 500)
            interval2.current = setTimeout(()=>{
                notificationRef.current.style.transform= 'translateY(-100%)';
                clearInterval(interval2.current)
            }, globalMessageA.time + 500)
            interval3.current = setTimeout(()=>{
                setGlobalMessageA(null)
                clearInterval(interval3.current)
            }, globalMessageA.time + 1000)

        }
        return ()=>{
            clearInterval(interval1.current)
            clearInterval(interval2.current)
            clearInterval(interval3.current)
        }
    }, [globalMessageA])

    const notificationRef = useRef()
    return (
        <div
            ref={notificationRef} 
            className={classes['container']} 
            style={{
                backgroundColor: globalMessageA.color
            }}
        
        ><div className='p-1' style={{ color: 'var(--containerColor)'}}>{children}</div>
        </div>
    )
}

export default GlobalMessage