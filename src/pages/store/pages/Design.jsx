import Button from 'components/Button'
import ColorPicker from 'components/ColorPicker'
import DialogComponent from 'components/tags/Dialog'
import React, { useEffect, useRef, useState } from 'react'
import { addLazyLoadingToImages, extractImageUrls, reduceImageQuality, translate } from 'utils/utils'
import StoreSvg from '../../store/svg/StoreSvg'
import axios from 'axios'
import { apiUrl, filesUrl } from 'constants/urls'
import Loader from 'components/Loader'
import { useBrowserContext } from '../../../store/browser-context'
import  StoreContextProvider, { StoreContext } from '../../store/store/store-contex'
import { useContextSelector } from 'use-context-selector'
import browserTabImage from '../../../assets/icons/store/browser-tab.png'
import Select from 'components/tags/Select'
import { darkModeOptions, languageOptions } from '../constants'
import IconWithHover from 'components/IconWithHover'
import RichText from 'components/RichText/RichText'
import classes from '../../Store.module.css'
import UploadImageButton from 'components/UploadImageButton'

const InfoSection=()=>{
    const {
        setDescription, 
        setName,
        name,
        description,
        language,
        setLanguage,
        mode,
        setMode
    } = useContextSelector(StoreContext, state=>state)
    return(
        <div className='container p-2 '>
               <div className='col-12 col-md-6 p-1'>
                <div className='d-f g-3 align-items-center'>
                        <h4 className='flex-shrink-0' style={{width: 90}}>{ translate('Name') }</h4>
                        <input className='box-input' value={name} onChange={e=>setName(e.target.value)} onBlur={e=>setName(e.target.value.trim())} />
                    </div>
               </div>
                <div className='d-f g-3 col-12 col-md-6 p-1'>
                    <h4 className='flex-shrink-0 mt-1'  style={{width: 90}}>{ translate('Description') }</h4>
                    <textarea className='box-input' value={description} onChange={e=>setDescription(e.target.value)} onBlur={e=>setDescription(e.target.value.trim())}  />
                </div>
                <div className='d-f g-3 col-12 col-md-6 p-1'>
                    <h4 className='flex-shrink-0 mt-1'  style={{width: 90}}>{ translate('Language') }</h4>
                    <Select options={languageOptions} selectedOption={language} onChange={setLanguage} />
                </div>
                <div className='d-f g-3 col-12 col-md-6 p-1'>
                    <h4 className='flex-shrink-0 mt-1'  style={{width: 90}}>{ translate('Night mode') }</h4>
                    <Select options={darkModeOptions} selectedOption={mode} onChange={setMode} />
                </div>
           </div>
    )
}

const StoreSvgSection=()=>{
    const {
        color: colorLight, 
        colorDark,
        bordersRounded,
        logo,
        headerOutlined,
        language,
        mode
    } = useContextSelector(StoreContext, state=>state)
    const [svgModeDark, setSvgModeDark] = useState(false)
    const modeValue = mode.value
    const darkMode =  modeValue === 'dark' || (modeValue === 'auto' && svgModeDark)
    const [color, backgroundColor, containerColor, textColor ]= darkMode? [colorDark, "#1f1f1f", "#1f1f1f", '#ffffff'] : [colorLight, '#ffffff', '#ffffff', '#11181C']
    return(
        <div className='p-relative' style={{margin: 'auto', textAlign: 'center'}}>
            <div>
                <StoreSvg 
                    primaryColor={color} 
                    bordersRounded={bordersRounded} 
                    headerOutlined={headerOutlined} 
                    lang={language.value} 
                    backgroundColor={backgroundColor}
                    containerColor={containerColor}
                    textColor={textColor}
                /> 
                <div style={{position: 'absolute', top:8, [ language.value !=='ar' ? 'left' : 'right']: 8}} className={ !logo ? 'jiggle' : ''}>
                    <img
                        src={logo}
                        height={30}
                        style={{
                            borderRadius: bordersRounded ? 4 : 0
                        }}
                    />    
                </div>
                { modeValue === 'auto' && <div style={{position: 'absolute', top:8, display: 'flex', justifyContent: 'center', width: '100%'}} >
                    <IconWithHover onClick={()=>setSvgModeDark(!svgModeDark)} color={textColor} size={30} className={`fa-solid fa-${ svgModeDark ? 'sun' : 'moon' }`} /> 
                </div>}
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
                <Button outline={!bordersRounded} onClick={()=>setBordersRounded(false)} style={{ padding: '0 16px'}}>{ translate('Sharp') }</Button>
                <Button outline={bordersRounded} onClick={()=>setBordersRounded(true)} style={{padding: '0 16px'}}>{ translate('Rounded') }</Button>
            </div>
        </div>
    )
}
const HeaderOulined=()=>{
    const {
        headerOutlined, 
        setHeaderOutlined,
    } = useContextSelector(StoreContext, state=>state)
    return(
        <div className='d-f container p-1 col-12 justify-content-between align-items-center px-2'>
            <h4 className='color-primary lh-1'>{ translate('Header type:') }</h4> 
            <div className='d-f  align-items-center g-3'>
                <Button outline={!headerOutlined} onClick={()=>setHeaderOutlined(false)} style={{padding: '0 16px'}}>{ translate('Filled') }</Button>
                <Button outline={headerOutlined} onClick={()=>setHeaderOutlined(true)} style={{padding: '0 16px'}}>{ translate('Outlined') }</Button>
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

const MainDarkColorSection=()=>{
    const [showColorPicker, setShowColorPicker] = useState(false)
    const {
        colorDark, 
        setColorDark,
    } = useContextSelector(StoreContext, state=>state)

    return(
        <div>
            <div className='d-f container p-1 col-12 justify-content-between align-items-center px-2'>
                <h4 className='color-primary lh-1'>{ translate('Primary dark color:') }</h4>
                <div className='d-f  align-items-center g-3'>
                    <div style={{border: 'var(--textColor) 1px solid', borderRadius: 4, padding:2}}>
                        <div style={{width: 40, height: 20, borderRadius: 2, backgroundColor: colorDark, cursor: 'pointer'}} onClick={()=>setShowColorPicker(true)} />
                    </div>
                    <h4>{ colorDark }</h4>
                </div>
                <DialogComponent open={showColorPicker} backDropPressCloses={false} close={()=>setShowColorPicker(false)}>
                    <ColorPicker color={colorDark} onChange={setColorDark} />
                </DialogComponent>
            </div>
        </div>
    )
}

const FaviconSection=()=>{
    const {
        favicon, 
        setFavicon,
        name
    } = useContextSelector(StoreContext, state=>state)
    return(
        <div className='container p-2' >
                    <div className='d-f g-4 f-wrap justify-content-between' style={{alignItems: 'flex-start'}}>
                        <div className='flex-1 d-f g-3 border p-2 justify-content-between' style={{maxWidth: 400, minWidth: 300}}>
                            <h3>{ translate('Edit favicon') }:</h3>
                            <UploadImageButton
                                image={favicon}
                                imageChangeHandler={setFavicon}
                                resolution={120}
                                size={38}
                                fixedWidth={false}
                                url='/upload-store-favicon'
                                type='store/favicon'
                                outputFormat={null}
                                extraData={{
                                    store_id: localStorage.getItem('storeId')
                                }}
                            />    
                        </div>
                       <div style={{margin: 'auto', position: 'relative'}}>
                            <img
                                src={browserTabImage}
                                width={300}
                            />
                            { favicon && <img
                                width={16}
                                height={16}
                                style={{
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    left: 80,
                                    top:12,
                                    borderRadius: 4
                                }}
                                src={favicon}
                            />}
                            {
                                !favicon && <i 
                                    className='fa-solid fa-earth-americas'
                                    style={{
                                        objectFit: 'cover',
                                        position: 'absolute',
                                        left: 80,
                                        top:12,
                                        fontSize: 16
                                    }}
                                />
                            }
                            <p 
                                style={{
                                    position: 'absolute',
                                    top: 6,
                                    fontSize: 14,
                                    left: 104,
                                    maxWidth: 136
                                }}
                                className='cut-text'
                            >
                                {name || translate('New tab qmod qdsod q')}
                            </p>
                            
                       </div>
                    </div>
            </div>
    )
}
const LogoSection=()=>{
    const {
        logo, 
        setLogo,
    } = useContextSelector(StoreContext, state=>state)
    return(
            <div className='flex-1 d-f g-3 border p-2 justify-content-between' style={{maxWidth: 400, minWidth: 300}}>
                <h4 className='color-primary'>{ translate('Logo') }:</h4>
                <UploadImageButton
                    image={logo}
                    imageChangeHandler={setLogo}
                    resolution={480}
                    size={38}
                    fixedWidth={false}
                    url='/upload-store-logo'
                    type='store/logo'
                    outputFormat={null}
                    extraData={{
                        store_id: localStorage.getItem('storeId')
                    }}
                />    
            </div>
    )
}

const StoreDesignSection=()=>{
    const {
        color, 
        setColorDark,
        mode
    } = useContextSelector(StoreContext, state=>state)

    useEffect(()=>{
        if (mode.value === 'light') setColorDark(color)
    }, [color])

    
    return(
        <div className='container p-2' >
            <div className='d-f g-4 f-wrap justify-content-between' style={{alignItems: 'flex-start'}}>
                <div className='flex-1 column g-3' style={{maxWidth: 400, minWidth: 300}}>
                    <LogoSection />
                    <MainColorSection  />
                    { mode.value !=='light' && <MainDarkColorSection />}
                    <HeaderOulined />
                    <BordersSection />
                </div>
                <StoreSvgSection />
            </div>
        </div>
    )
}

const FooterSection =()=>{
    const { footer, setFooter} =  useContextSelector(StoreContext, state=>state)
    const handleImageUploadBefore = async (files) => {
        const image = (await reduceImageQuality(files, 0.7, 640, 'webp', false))[0]
        const authToken = localStorage.getItem('token'); // Replace with your actual authentication token
        const formData = new FormData();
        formData.append('image', image);
        formData.append('store_id', localStorage.getItem('storeId'))
    
        await axios({
          method: 'POST',
          url: filesUrl + '/upload-store-image', // Replace with your actual upload URL
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          data: formData
        })
          .then((response) => {
            document.querySelector(`img[src^='data']`).setAttribute('src', response.data.url)
            editorRef.current.appendContents('');
          })
          .catch((error) => {
            document.querySelectorAll(`img[src^='data']`).forEach(elem=>elem.parentElement.parentElement.remove())
            alert(translate('Image was not uploaded'))
          });
      };
      const editorRef = useRef(null);
    return(
        <div className='container p-2' style={{marginBottom: 24}}>
            <h3 className='lh-1'>{ translate('Add a footer') }</h3>
            <p className='mb-4'>{ translate('This will be displayed in the bottom of your store') }</p>
            <RichText 
                onChange={(value)=>setFooter(value)} 
                defaultValue={footer} 
                handleImageUploadBefore={handleImageUploadBefore}
                ref={editorRef}
                className={classes['footer']}
            />
    </div>
    )
}

const InnerDesign = () => {
    const {
        color, 
        colorDark,
        setColorDark,
        bordersRounded, 
        logo,
        name,
        description,
        headerOutlined,
        favicon,
        language,
        mode,
        footer
    } = useContextSelector(StoreContext, state=>state)

    useEffect(()=>{
        if (mode.value === 'light') setColorDark(color)
    }, [color])

    const defaultColor = useRef(color)
    const defaultColorDark = useRef(colorDark)
    const defaultBordersRounded = useRef(bordersRounded)
    const defaultLogo = useRef(logo)
    const defaultName = useRef(name)
    const defaultDescription = useRef(description)
    const defaultHeaderOutlined = useRef(headerOutlined)
    const defaultFavicon = useRef(favicon)
    const defaultLanguage = useRef(language)
    const defaultMode = useRef(mode)
    const defaultFooter = useRef(footer)

    const [loading, setLoading] = useState(false)
    
    const {setGlobalMessageA} = useBrowserContext()
    const updateStore=async()=>{
        setLoading(true)
        try{
            const response = await axios.post(
                apiUrl + "/store/update-store-info",
                {
                    primary_color: color,
                    primary_color_dark: colorDark,
                    borders_rounded: bordersRounded,
                    logo,
                    name: name,
                    description: description,
                    store_id : localStorage.getItem('storeId'),
                    header_outlined: headerOutlined,
                    favicon: favicon,
                    language: language.value,
                    mode : mode.value,
                    footer: (footer && footer !== '<p><br></p>' )? addLazyLoadingToImages(footer) : '',
                    images_urls : extractImageUrls(footer)

                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    }
                }
            )
            defaultColor.current = color
            defaultColorDark.current = colorDark
            defaultBordersRounded.current= bordersRounded
            defaultLogo.current = logo
            defaultName.current = name
            defaultDescription.current = description
            defaultFavicon.current = favicon
            defaultHeaderOutlined.current = headerOutlined
            defaultLanguage.current = language
            defaultMode.current = mode
            defaultFooter.current = footer
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

    const disabled = loading || (
        (defaultBordersRounded.current === bordersRounded )&& 
        (defaultColor.current === color) && 
        (defaultColorDark.current === colorDark) && 
        (defaultLogo.current === logo) &&
        (defaultName.current === name) &&
        (defaultDescription.current === description) &&
        (defaultFavicon.current === favicon) &&
        (defaultHeaderOutlined.current === headerOutlined) &&
        (defaultLanguage.current.value === language.value) &&
        (defaultMode.current.value === mode.value) &&
        (defaultFooter.current === footer)
    ) 
    return (
        <div className='p-2 column g-3'>
            <InfoSection />
            <StoreDesignSection />
            <FaviconSection/>
            <FooterSection />
            <div style={{position: 'fixed', width: '100%', left: 0, right: 0, padding: '5px 10px', bottom: 0, backgroundColor:'var(--containerColor)', zIndex: 120}}>
                <Button className='g-3 w-100' disabled={disabled} onClick={updateStore}>
                    <i className='fa-solid fa-bookmark'/>
                    { translate('Save') }
                    {loading && <Loader diam={22} />}
                </Button>
            </div>
        </div>
    )
}

const Design =()=>(
    <StoreContextProvider>
        <InnerDesign/>
    </StoreContextProvider>
)

export default Design