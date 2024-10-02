import React from 'react'
import { useCustomizeHomePageContext } from 'pages/store/pages/customize-home-page/store/CustomizeHomePageContext';

import { Swiper, SwiperSlide } from 'swiper/react';

import { EffectCube } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cube';
import MiniCard from '../components/MiniCard';

const CubeSwiper=({section})=>{
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

      effect: 'cube',
      cubeEffect: {
        shadow: false,
        slideShadows: true,
      },
      pagination: true,
      modules: [EffectCube],
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

export default CubeSwiper