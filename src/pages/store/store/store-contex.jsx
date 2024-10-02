import axios from "axios";
import Loader from "components/Loader";
import { filesUrl } from "constants/urls";
import { useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { darkModeOptions, languageOptions } from "../constants";

const StoreContext = createContext({
    color: "#446ec3", 
    setColor: ()=>{},
    colorDark: "#446ec3", 
    setColorDark: ()=>{},
    bordersRounded: true, 
    setBordersRounded: ()=>{},
    logo: "", 
    setLogo: ()=>{},
    favicon: '',
    setFavicon: ()=>{},
    headerOutlined : false,
    setHeaderOutlined: ()=>{},
    name: '',
    setName: ()=>{},
    description: '',
    setDescription: ()=>{},
    language: 'ar', 
    setLanguage: ()=>{},
    mode: 'light',
    setmode: ()=>{},
    footer: '',
    setFooter: ()=>{}
})

const StoreContextProvider=({children})=>{
    const [color, setColor] = useState(null)
    const [colorDark, setColorDark] = useState(null)
    const [bordersRounded, setBordersRounded] = useState(false)
    const [logo, setLogo] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [headerOutlined, setHeaderOutlined] = useState(false)
    const [favicon, setFavicon] = useState('')
    const [language, setLanguage] = useState(null)
    const [mode, setMode] = useState(null)
    const [footer, setFooter] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const getStore=()=>{
        setLoading(true)
        setError(false)
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
            setColorDark(data.primaryColorDark)
            setBordersRounded(data.bordersRounded)
            setLogo(data.logo)
            setName(data.name)
            setDescription(data.description)
            setFavicon(data.favicon)
            setHeaderOutlined(data.headerOutlined)
            setLanguage(languageOptions.find(lang=> lang.value === data.language) || languageOptions[0])
            setMode(darkModeOptions.find(mode=> mode.value === data.mode) || darkModeOptions[0])
            setFooter(data.footer)
            setLoading(false)
        }).catch(err=>{
            console.log(err)
            setError(true)
            setLoading(false)
        })
    }
    useEffect(()=>{
        getStore()
    }, [])

    const defaultValue = {
        color, 
        setColor,
        colorDark,
        setColorDark,
        bordersRounded, 
        setBordersRounded,
        logo, 
        setLogo,
        favicon,
        setFavicon,
        headerOutlined,
        setHeaderOutlined,
        name,
        setName,
        description,
        setDescription,
        language,
        setLanguage,
        mode, 
        setMode,
        footer, 
        setFooter

    }
    const [content, setContent] = useState(<></>)
    useEffect(()=>{
        if (color) setContent(children)
    }, [color])
    return(
        <StoreContext.Provider value={defaultValue}>
            { !loading && content}
            { loading && <div className="d-f flex-1 align-items-center justify-content-center">
                <Loader diam={100} />
            </div>}

        </StoreContext.Provider>
    )
}

export default StoreContextProvider
export {StoreContext}
