import React, { useEffect, useRef, useState } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation } from 'swiper/modules';

// Import conditionally
import 'swiper/css';
import 'swiper/css/navigation';
import { useCustomizeHomePageContext } from 'pages/store/pages/customize-home-page/store/CustomizeHomePageContext';
import MiniCard from '../components/MiniCard';


const DefaultSwiper=({section, zoom})=>{
    const {selectedDevice} = useCustomizeHomePageContext()
    const sectionDesign = section.design[selectedDevice]
    const productsDesign = sectionDesign.products
    const {
        justifyContent,
        gap,
        product: {
            width: cssWidth
        }
    } = productsDesign

    const [slidesPerView, setSliderPerView] = useState(1)
    const [swiperWidth, setSwiperWidth] = useState(0)

    const swiperRef= useRef()
    const checkSwiperWidth = ()=>{
        const newSwiperWidth = (swiperRef.current?.getBoundingClientRect().width / zoom )|| 0
        setSwiperWidth(newSwiperWidth)
    }

    useEffect(()=>{
        let slidesPerView;
        if (cssWidth[cssWidth.length - 1] === '%'){
            const per = Number(cssWidth.slice(0, cssWidth.length -1))
            slidesPerView = 100/ per
        }
        else {
            const width = Number(cssWidth.slice(0, cssWidth.length - 2))
            slidesPerView = swiperWidth/ width
        }
        setSliderPerView(slidesPerView)
    }, [swiperWidth, cssWidth])

    useEffect(()=>{
        window.addEventListener('resize', checkSwiperWidth);
        checkSwiperWidth()
        return () => {
            window.removeEventListener('resize', checkSwiperWidth);
        };
    }, [])

    const props={
        spaceBetween: gap,
        pagination: {
            clickable: true,
        },
        grabCursor: true,
        className: "mySwiper",
        style: {
            width:'100%',
            overflow: 'unset'
        },
        centerInsufficientSlides:  justifyContent === 'center' || justifyContent === 'space-evenly',
        slidesPerView: slidesPerView,            
        modules: [Navigation],    
        navigation: true
    }

    return(
        <div 
            style={{overflowX: 'clip'}}
            ref={swiperRef}
        >
            <Swiper
                {
                    ...props
                }
            >
                {section.products?.map(product=>
                    <SwiperSlide 
                        key={product.product_id}
                        style={{width: '100%'}}
                    >
                        <MiniCard sectionDesign={sectionDesign} product={product} />
                    </SwiperSlide>
                )}
            </Swiper>
        </div>
    )
}

export default DefaultSwiper