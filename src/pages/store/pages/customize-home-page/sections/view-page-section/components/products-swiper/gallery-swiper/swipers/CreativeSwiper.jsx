import React  from 'react'
import { useCustomizeHomePageContext } from 'pages/store/pages/customize-home-page/store/CustomizeHomePageContext';

import { Swiper, SwiperSlide } from 'swiper/react';

import { EffectCreative } from 'swiper/modules';

// Import conditionally
import 'swiper/css';
import 'swiper/css/effect-creative';
import MiniCard from '../components/MiniCard';

const CreativeSwiper=({section})=>{
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
        className: "mySwiper2",
        centerInsufficientSlides:  justifyContent === 'center' || justifyContent === 'space-evenly',

        effect: 'creative',
        creativeEffect: {
          prev: {
            shadow: true,
            translate: ['-100%', 0, -500],
          },
          next: {
            shadow: true,
            translate: ['100%', 0, -500],
          },
        },
        style: {
            width: width,
            overflow: 'unset'
        },
        modules: [EffectCreative],
        slidesPerView: 1,
        spaceBetween: 0,
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
export default CreativeSwiper