import { createContext, useContext, useEffect, useState } from "react"
import browserDataJson from "../json/browser-data.json"
import { hexToRgb, translate } from "../utils/utils"

const {browserData : BD} = browserDataJson

const ltr = {
    left: 'left',
    right: 'right',
    Left: 'Left',
    Right: 'Right',
    l: 'l',
    r: 'r',
}
const rtl = {
    left: 'right',
    right: 'left',
    Left: 'Right',
    Right: 'Left',
    l: 'r',
    r: 'l',
}

const BrowserContext = createContext({
    theme: 'light',
    toggleTheme: ()=>{},
    browserData: BD,
    setBrowserData: ()=>{},
    colors: BD.colors['light'],
    setloading: ()=>{},
    loading: false,
    setMetaData: ({title, description})=>{},
    globalMessageA: {
        color: 'var(--primaryColor)',
        time: 4000,
        children: null
    }, 
    setGlobalMessageA: ({color, time})=>{},
    langTerms: ltr
    
})

const root = document.getElementById('root')

const BrowserContextProvider=({children})=>{
    // language
    const lang ='en'
    const langTerms = lang === 'ar' ? rtl : ltr

    // theme
    const defaultTheme = localStorage.getItem('theme') || 'light'
    const [theme, setTheme] = useState(defaultTheme)
    const toggleTheme = ()=> setTheme(state =>state === 'light' ? 'dark' : 'light')
   
    useEffect(()=>{
        localStorage.setItem('theme', theme)
    }, [theme])
   
    // browser data
    const [browserData, setBrowserData] = useState(BD)

    // colors
    const [colors, setColors] = useState(BD.colors[theme])

    useEffect(()=>{
        setColors(()=>{
            const newColors = BD.colors[theme]
            for (let key in newColors) {
                root.style.setProperty(`--${key}`, colors[key])
                root.style.setProperty(`--${key}-rgb`, hexToRgb(colors[key]))
            }
            return newColors
        })
            
    }, [theme, setColors])

    // loading
    const [loading, setloading]=useState(false)

    // title and description
    const [metaData, setMetaData] = useState({
        title: translate('Hanotify'),
        description: translate('Obtenir votre e-store dans hanotify')
    })
    useEffect(()=>{
        document.getElementById('page-title').innerHTML = metaData.title
        document.getElementById('page-description').setAttribute('content', metaData.description)
    }, [metaData])

    // Global message notification
    const [globalMessageA, setGlobalMessageA] = useState(null)

    // default context value
    const defaultBrowserValue={
        theme,
        toggleTheme,
        browserData,
        setBrowserData,
        colors,
        setloading,
        loading,
        setMetaData,
        setGlobalMessageA,
        globalMessageA,
        langTerms
    }
    return(
        <BrowserContext.Provider value={defaultBrowserValue}>
            <div style={{display: "flex", flexDirection: 'column'}}  id='app'>
                { browserData && children} 
            </div>
        </BrowserContext.Provider>
    )
}

export default BrowserContextProvider
export const useBrowserContext = ()=> useContext(BrowserContext)
