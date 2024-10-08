import { useEffect } from "react"

const useNonStickyHeader=()=>{
    useEffect(()=>{
        const header = document.getElementById('header')
        if(header) header.style.position = 'relative'
        return ()=>{
            if(header) header.style.position = 'sticky'
        }
    }, [])
}
export default useNonStickyHeader