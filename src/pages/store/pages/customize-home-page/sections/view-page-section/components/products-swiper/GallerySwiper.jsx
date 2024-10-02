import React, { lazy }  from 'react'

import SuspenseComponent from 'components/SuspenseComponent'
import { useCustomizeHomePageContext } from 'pages/store/pages/customize-home-page/store/CustomizeHomePageContext'

const DefaultSwiperImport = ()=>import('./gallery-swiper/swipers/DefaultSwiper')
const DefaultSwiper = lazy(DefaultSwiperImport)

const CardsFlowSwiperImport = ()=>import('./gallery-swiper/swipers/CoverFlowSwiper')
const CoverFlowSwiper = lazy(CardsFlowSwiperImport)

const CoverFlowSwiperImport = ()=>import('./gallery-swiper/swipers/CardsFlowSwiper')
const CardsFlowSwiper = lazy(CoverFlowSwiperImport)

const CubeSwiperImport = ()=>import('./gallery-swiper/swipers/CubeSwiper')
const CubeSwiper = lazy(CubeSwiperImport)

const FlipSwiperImport = ()=>import('./gallery-swiper/swipers/FlipSwiper')
const FlipSwiper = lazy(FlipSwiperImport)

const CreativeSwiperImport = ()=>import('./gallery-swiper/swipers/CreativeSwiper') 
const CreativeSwiper = lazy(CreativeSwiperImport)

const GallerySwiper=({section, zoom})=>{
    // products
    const {selectedDevice} = useCustomizeHomePageContext()
    const sectionDesign = section.design[selectedDevice]
    const productsDesign =  sectionDesign.products

    const {
        productsDisplay,
    } = productsDesign


    return(
        <>
            { productsDisplay === 'swiper-1' &&  <SuspenseComponent Component={DefaultSwiper} section={section} zoom={zoom} /> }
            { productsDisplay === 'swiper-2' && <SuspenseComponent Component={CoverFlowSwiper} section={section}  />}
            { productsDisplay === 'swiper-3' && <SuspenseComponent  Component={CardsFlowSwiper} section={section}  />}
            { productsDisplay === 'swiper-4' && <SuspenseComponent Component={CubeSwiper} section={section}  /> }
            { productsDisplay === 'swiper-5' && <SuspenseComponent Component={FlipSwiper} section={section}  /> }
            { productsDisplay === 'swiper-6' && <SuspenseComponent Component={CreativeSwiper} section={section}  /> }
        </>
         
    )
}
    

export default GallerySwiper