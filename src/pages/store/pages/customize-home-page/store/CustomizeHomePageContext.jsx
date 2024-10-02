import { apiUrl } from 'constants/urls'
import { createContext, useContext, useEffect, useState } from 'react'
import { useUserContext } from 'store/user-context'
import { defaultDesignMobile, defaultDesignPC, defaultGeneralDesign } from '../constants'
import { useBrowserContext } from 'store/browser-context'

const root = document.getElementById('root')


const CustomizeHomePageContext = createContext({
    sections: [], 
    setSections: ()=>{},
    selectedSectionId : 'general-design', 
    selectedSectionType: '',
    setselectedSectionId: ()=>{},
    updateSectionDesign: (id, newDesign)=>{},
    selectedDevice: 'mobile', 
    setSelectedDevice: ()=>{},
    isMobile: true,
    sectionDesign : {},
    store: {},
    primaryColor : null,
    visionMode: localStorage.getItem("theme"),
    generalDesign: {},
    updateGeneralDesign: ()=>{},
    fullScreen: false, 
    setFullScreen: ()=>{}
})

const CustomizeHomePageContextProvider = ({children})=>{
    const [sections, setSections] = useState(null)
    const [store, setStore] = useState(null)
    const {userData} = useUserContext()

    const [generalDesign, setGeneralDesign] = useState(defaultGeneralDesign)

    const {colors}=useBrowserContext()
    useEffect(()=>{
      fetch(
        apiUrl + '/product/home-customization-products?domain='+ userData.domain,
      ).then((response)=>{
        response.json().then(data=>{
          window.storeData = data.store
          const color = {
            light: data.store.primaryColor,
            dark: data.store.primaryColorDark
          }

          defaultDesignPC.title.label.color = defaultDesignMobile.title.label.color = color

          defaultDesignPC.products.product.title.color = defaultDesignMobile.products.product.title.color = {
            light: colors.textColor,
            dark: colors.containerColor
          }

          defaultDesignPC.products.product.price.color = defaultDesignMobile.products.product.price.color = color

          defaultDesignMobile.products.bordersRounded = data.store.bordersRounded
          defaultDesignPC.products.bordersRounded  = data.store.bordersRounded
          let newSections = data.sections.map(sec=>{
            if (sec.type === 'products-container'){
              return {
                ...sec,
                design: data.sections.design || {
                  'mobile': defaultDesignMobile,
                  'PC': defaultDesignPC
                }
              }
            }
            else return sec
          })
          setSections(newSections)
          setStore(data.store)
          data.generalDesign && setGeneralDesign(data.generalDesign)
          
        })
      })
    }, [])

    const [visionMode, setVisonMode] = useState()
    useEffect(()=>{
      if (store){
        setVisonMode((store.visionMode === 'auto') ? localStorage.getItem("theme") : store.visionMode)
      }
    }, [store])

    useEffect(()=>{
      if(window.storeData){
        root.style.setProperty('--store-primary-color', visionMode === 'light' ? window.storeData['primaryColor'] :window.storeData['primaryColorDark'] )
      }
    }, [visionMode])
  
    const [selectedSectionId, setselectedSectionId] = useState('general-design')

    useEffect(()=>{
        document.documentElement.classList.add('no-scroll')
        return ()=> document.documentElement.classList.remove('no-scroll')
    }, [])

    const [selectedDevice, setSelectedDevice] = useState('mobile')

    const updateSectionDesign=(id, newDesign)=>{
      setSections(sections=>{
        const newState = [...sections]
        const section = newState.find(elem=>elem.id === id)
        section.design[selectedDevice] = {
          ...section.design[selectedDevice],
          ...newDesign
        }
        return newState
      })        
    }
    const isMobile = selectedDevice === 'mobile'

    const selectedSection = sections?.find(sec=>sec.id === selectedSectionId)
    let sectionDesign = selectedSection?.design
    sectionDesign = sectionDesign ? sectionDesign[selectedDevice] : {}

    const primaryColor = store && (store.mode === 'light' ? store.primaryColor : store.primaryColorDark)
    
    const updateGeneralDesign = (newGeneralDesign)=>{
      setGeneralDesign({
        ...generalDesign,
        [selectedDevice]: newGeneralDesign
      })
    }

    const [fullScreen, setFullScreen] = useState(false)

    const value={
        sections,
        setSections,
        selectedSectionId, 
        selectedSectionType: selectedSection?.type,
        setselectedSectionId,
        updateSectionDesign,
        selectedDevice, setSelectedDevice,
        isMobile,
        sectionDesign,
        store,
        primaryColor: primaryColor,
        visionMode,
        generalDesign: generalDesign[selectedDevice],
        updateGeneralDesign,
        fullScreen, setFullScreen
    }
    return(
        <CustomizeHomePageContext.Provider value={value}>
            {sections && children}
        </CustomizeHomePageContext.Provider>
    )
}

export default CustomizeHomePageContextProvider
export const useCustomizeHomePageContext = ()=>useContext(CustomizeHomePageContext)