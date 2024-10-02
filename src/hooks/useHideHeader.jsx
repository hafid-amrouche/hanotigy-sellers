import React, { useEffect } from 'react'

const useHideHeader = () => {
    useEffect(()=>{
        const header = document.getElementById('header')
        if(header) header.style.display = 'none'
        return ()=>{
            if(header) header.style.display = 'block'
        }
    }, [])
}

export default useHideHeader