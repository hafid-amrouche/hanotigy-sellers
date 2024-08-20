import { useEffect, useRef } from 'react'
import { adjustScrollToTop } from 'utils/utils'

const useScrollToTop = (show, id, delta) => {
    const firstCycleDone = useRef(false)
    useEffect(()=>{
        if(show && firstCycleDone.current){ 
            setTimeout( adjustScrollToTop(document.querySelector(id), -delta) , 100)
        }
        firstCycleDone.current = true
    }, [show])
}

export default useScrollToTop