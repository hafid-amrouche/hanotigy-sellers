import React from 'react'
import { useCustomizeHomePageContext } from 'pages/store/pages/customize-home-page/store/CustomizeHomePageContext';

import { Swiper, SwiperSlide } from 'swiper/react';

import { EffectFlip} from 'swiper/modules';

// Import conditionally
import 'swiper/css';
import 'swiper/css/effect-flip';
import MiniCard from '../components/MiniCard';

const FlipSwiper=({section})=>{
    const {selectedDevice} = useCustomizeHomePageContext()
    const sectionDesign = section.design[selectedDevice]
    const productsDesign = sectionDesign.products
    const {
        justifyContent,
        product: {
            width
        }
    } = productsDesign

    const props = {
        pagination: {
            clickable: true,
        },
        grabCursor: true,
        className: "mySwiper",
        centerInsufficientSlides:  justifyContent === 'center' || justifyContent === 'space-evenly',

        effect: 'flip',
        modules: [EffectFlip],
        style: {
            width,
            overflow: 'unset'
        },
        spaceBetween: 0
    }

    return(
        <div 
            style={{overflowX: 'clip'}}
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

export default FlipSwiper