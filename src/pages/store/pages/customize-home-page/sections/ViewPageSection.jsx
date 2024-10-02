import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useCustomizeHomePageContext } from '../store/CustomizeHomePageContext'
import { scrollToTop } from 'utils/utils'
import Button from 'components/Button'
import useHideHeader from 'hooks/useHideHeader'
import DialogComponent from 'components/tags/Dialog'
import DeviceTypeArea from '../components/DeviceTypeArea'
import './ViewPageSection.css'
import GallerySection from './view-page-section/GallerySection'
import SwiperSection from './view-page-section/SwiperSection'


const ViewPageSection = () => {
    const {selectedSectionId, sections, selectedDevice, visionMode, generalDesign, fullScreen, setFullScreen, setselectedSectionId} = useCustomizeHomePageContext() 
    const isMobile = selectedDevice === 'mobile'
    const [viewPagePCWidth, setViewPagePCWidth] = useState(window.innerWidth)
    const [viewPageMobileWidth, setViewPageMobileWidth] = useState(380)

    const [innerViewPageWidth, setInnerViewPageWidth] = isMobile ? [viewPageMobileWidth, setViewPageMobileWidth] : [viewPagePCWidth, setViewPagePCWidth]

    const viewPageRef = useRef()
    let [zoom, setZoom] = useState(1)
    let [safeViewPageWidth, setSafeViewWidth] = useState(innerViewPageWidth)

    const updateSafeViewWidth=()=>{
        let safeViewPageWidth;
        if (isMobile){
            if (viewPageMobileWidth < 320){
                safeViewPageWidth = 320
            }
            else if(viewPageMobileWidth > 450){
                safeViewPageWidth = 450
            }
            else{
                safeViewPageWidth = viewPageMobileWidth
            }
            
        }else{
            if (viewPagePCWidth < 1280){
                safeViewPageWidth = 1280
            }
            else if(viewPagePCWidth > 1920){
                safeViewPageWidth = 1920
            }
            else{
                safeViewPageWidth = viewPagePCWidth
            }
        }
        setSafeViewWidth(safeViewPageWidth)
        setInnerViewPageWidth(safeViewPageWidth)
    }
    
    
    const updateZoom=()=>{
        const viewPageWidth = viewPageRef.current?.getBoundingClientRect().width
        if (viewPageRef.current) {
            setZoom(viewPageWidth/safeViewPageWidth)
        }
    }

    useEffect(()=>{
        if (!fullScreen)  {
            window.addEventListener('resize', updateZoom);
            setInnerViewPageWidth(safeViewPageWidth)
            updateZoom()
        }
        else{
            setZoom(1)
            window.removeEventListener('resize', updateZoom);
        }
        return () => {
            window.removeEventListener('resize', updateZoom);
        };
    }, [isMobile, safeViewPageWidth, fullScreen])

    useEffect(()=>{
        updateSafeViewWidth()
    }, [isMobile])

    useEffect(()=>{
        const selectedSectionIdElement = document.querySelector('#section-' + selectedSectionId)
        if(selectedSectionIdElement) scrollToTop(selectedSectionIdElement)          
      }, [selectedSectionId])
    
    useEffect(()=>{
        const selectedSectionIdElement = document.querySelector('#section-' + selectedSectionId)
        if(selectedSectionIdElement) setTimeout(()=>scrollToTop(selectedSectionIdElement), 500)
    }, [sections])

    useHideHeader()
    
    // general design
    const backgroundColor = generalDesign.backgroundColor[visionMode]


    const fullScreenStyle= fullScreen ? {
        overflowY: 'auto',
        height: '100vh',
        width: isMobile ? '30vw' : '100vw' ,
        maxWidth: undefined
    } : {}

    const Tag = fullScreen ? DialogComponent : Fragment
    const TagProps = fullScreen ? {open: true, darkness: 1, backDropPressCloses: false, close: ()=>setFullScreen(false)} : {}

    return (
        <div className='hide-900' key={selectedDevice} style={{flex: 100, position: 'relative', minWidth: 0 }} id='sections-container'>
            <div style={{position: 'absolute', width: '100%' , top: -35}} className='d-f justify-content-center g-3' >
                <input type='number' onChange={(e)=>setInnerViewPageWidth(Number(e.target.value))} className='box-input' value={innerViewPageWidth} style={{width: 80, textAlign: 'center', height: 30, padding: '0 4px'}} /> 
                <h4>PX</h4> 
                { safeViewPageWidth !== innerViewPageWidth && 
                    <div style={{position: 'relative'}}>
                        <Button onClick={()=>updateSafeViewWidth(innerViewPageWidth)} style={{borderRadius: '50%', width:30, height:30, position:'absolute'}}><i className='fa-solid fa-check'></i> </Button>
                    </div>
                }
            </div>
            <Tag {...TagProps}>
                <div className='border' style={{minWidth: 200, maxWidth:( isMobile ? '40%' : undefined),  margin: 'auto', overflowY: 'auto', overflowX: 'hidden', height: '100%', ...fullScreenStyle}}>
                    { fullScreen && <DeviceTypeArea /> }
                    <div ref={viewPageRef} className={'view-page h-100'}>
                        <div className='column g-2' style={{ zoom: zoom, minHeight: '100%', backgroundColor:backgroundColor, }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                            >
                                { sections.map(section=>{
                                    const sectionDesign = section.design[selectedDevice]
                                    const isSelcted = selectedSectionId === section.id
                                    const marginTop = sectionDesign.marginTop
                                    const marginHorizontal = sectionDesign.marginHorizontal
                                    return(
                                        <div 
                                            key={section.id} 
                                            className='cursor-pointer' 
                                            onClick={()=>!fullScreen &&  setselectedSectionId(section.id)} 
                                            style={{
                                                padding: `${marginTop}px ${marginHorizontal}px 0 ${marginHorizontal}px`, 
                                                border: isSelcted ? '1px solid var(--textColor)': undefined,
                                            }}
                                        >
                                            {section.type==='products-container' && <GallerySection zoom={zoom} section={section} />}
                                            {section.type==='swiper' && <SwiperSection zoom={zoom} section={section} />}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>     
                    </div>
                </div>
            </Tag>
           
        </div>
    )
}

export default ViewPageSection