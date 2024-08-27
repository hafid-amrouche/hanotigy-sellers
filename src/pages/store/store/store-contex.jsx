import axios from "axios";
import { filesUrl } from "constants/urls";
import { useEffect, useState } from "react";
import { createContext } from "use-context-selector";

const StoreContext = createContext({
    color: "5d6c99", 
    setColor: ()=>{},
    bordersRounded: true, 
    setBordersRounded: ()=>{},
    logo: "", 
    setLogo: ()=>{},
})

const StoreContextProvider=({children})=>{
    const [color, setColor] = useState(null)
    const [bordersRounded, setBordersRounded] = useState(false)
    const [logo, setLogo] = useState(null)

    useEffect(()=>{
        axios.get(
            filesUrl + '/get-store-for-edit?store_id=' + localStorage.getItem('storeId'),
            {
                headers:{
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'

                }
            }
        ).then(response=>{
            const {data} = response
            setColor(data.primaryColor)
            setBordersRounded(data.bordersRounded)
            setLogo(data.logo)
        })
    }, [])

    const defaultValue = {
        color, 
        setColor,
        bordersRounded, 
        setBordersRounded,
        logo, 
        setLogo,
    }
    const [content, setContent] = useState(<></>)
    useEffect(()=>{
        if (color) setContent(children)
    }, [color])
    return(
        <StoreContext.Provider value={defaultValue}>
            {content}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider
export {StoreContext}
