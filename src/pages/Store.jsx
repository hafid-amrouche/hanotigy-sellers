import Button from 'components/Button'
import ColorPicker from 'components/ColorPicker'
import DialogComponent from 'components/tags/Dialog'
import React, { useRef, useState } from 'react'
import { translate } from 'utils/utils'
import StoreSvg from './store/svg/StoreSvg'
import UploadImageButton from './add-product/UploadImageButton'
import axios from 'axios'
import { apiUrl } from 'constants/urls'
import Loader from 'components/Loader'
import { useBrowserContext } from 'store/browser-context'
import StoreContextProvider, { StoreContext } from './store/store/store-contex'
import { useContextSelector } from 'use-context-selector'
const options=[
    'Design',
    'Categories',
    'Thnnk you page'
]

const StoreSvgSection=()=>{
    const {
        color, 
        setLogo,
        bordersRounded,
        logo
    } = useContextSelector(StoreContext, state=>state)
    return(
        <div className='p-relative' style={{margin: 'auto', textAlign: 'center'}}>
            <div>
                <StoreSvg primaryColor={color} bordersRounded={bordersRounded}/> 
                <div style={{position: 'absolute', top:8, left: 8}}>
                    <UploadImageButton
                        image={logo}
                        imageChangeHandler={setLogo}
                        resolution={480}
                        size={30}
                        fixedWidth={false}
                        url='/upload-store-logo'
                        type='store'
                        outputFormat={null}
                        extraData={{
                            store_id: localStorage.getItem('storeId')
                        }}
                        rounded={bordersRounded}
                    />    
                </div>
            </div>
        </div>
    )
}

const BordersSection=()=>{
    const {
        bordersRounded, 
        setBordersRounded,
    } = useContextSelector(StoreContext, state=>state)
    return(
        <div className='d-f container p-1 col-12 justify-content-between align-items-center px-2'>
            <h4 className='color-primary lh-1'>{ translate('Borders:') }</h4>
            <div className='d-f  align-items-center g-3'>
                <Button outline={!bordersRounded} onClick={()=>setBordersRounded(false)} style={{borderRadius: 0, padding: '0 16px'}}>{ translate('Sharp') }</Button>
                <Button outline={bordersRounded} onClick={()=>setBordersRounded(true)} style={{borderRadius: 8, padding: '0 16px'}}>{ translate('Rounded') }</Button>
            </div>
        </div>
    )
}

const MainColorSection=()=>{
    const [showColorPicker, setShowColorPicker] = useState(false)
    const {
        color, 
        setColor,
    } = useContextSelector(StoreContext, state=>state)
    return(
        <div>
            <div className='d-f container p-1 col-12 justify-content-between align-items-center px-2'>
                <h4 className='color-primary lh-1'>{ translate('Primary color:') }</h4>
                <div className='d-f  align-items-center g-3'>
                    <div style={{border: 'var(--textColor) 1px solid', borderRadius: 4, padding:2}}>
                        <div style={{width: 40, height: 20, borderRadius: 2, backgroundColor: color, cursor: 'pointer'}} onClick={()=>setShowColorPicker(true)} />
                    </div>
                    <h4>{ color }</h4>
                </div>
                <DialogComponent open={showColorPicker} backDropPressCloses={false} close={()=>setShowColorPicker(false)}>
                    <ColorPicker color={color} onChange={setColor} />
                </DialogComponent>
            </div>
        </div>
)
}

const InnerStore = () => {
    const [option, setOption] = useState(options[0])
    const {
        color, 
        bordersRounded, 
        logo, 
    } = useContextSelector(StoreContext, state=>state)

    const defaultColor = useRef(color)
    const defaultBordersRounded = useRef(bordersRounded)
    const defaultLogo = useRef(logo)

    const [loading, setLoading] = useState(false)
    
    const {setGlobalMessageA} = useBrowserContext()
    const updateStore=async()=>{
        setLoading(true)
        try{
            const response = await axios.post(
                apiUrl + "/store/update-store-info",
                {
                    primary_color: color,
                    borders_rounded: bordersRounded,
                    logo,
                    store_id : localStorage.getItem('storeId')

                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    }
                }
            )
            defaultColor.current = color
            defaultBordersRounded.current= bordersRounded
            defaultLogo.current = logo
            setGlobalMessageA({
                color : 'var(--successColor)',
                time: 3000,
                children: translate('Store design was upadated')
            })
        }catch(err){
            console.log(err)
            setGlobalMessageA({
                color : 'red',
                time: 3000,
                children: translate('Store design was not updated')
            })
        }
        setLoading(false)        
    }

    const disabled = loading || ((defaultBordersRounded.current === bordersRounded )&& (defaultColor.current === color) && (defaultLogo.current === logo)) 
    return (
        <div className='container m-2 column p-2 g-4'>
           <div className='d-f g-2'>
            {options.map(op=>(
                <Button style={{borderRadius: 20}} outline={op === option} key={op} onClick={()=>setOption(op)}>{op}</Button>
            ))}
           </div>
           <div className='container p-2'>
                <div className='d-f g-4 f-wrap justify-content-between' style={{alignItems: 'flex-start'}}>
                    <div className='flex-1 column g-3' style={{maxWidth: 400, minWidth: 300}}>
                        <MainColorSection  />
                        <BordersSection />
                    </div>
                    <StoreSvgSection />
                </div>
           </div>
           <Button className='g-3' disabled={disabled} onClick={updateStore}>
                <i className='fa-solid fa-bookmark'/>
                { translate('Save') }
                {loading && <Loader diam={22} />}
            </Button>
        </div>
    )
}

const Store=()=>{
    return(
        <StoreContextProvider>
            <InnerStore/>
        </StoreContextProvider>
    )
}
export default Store