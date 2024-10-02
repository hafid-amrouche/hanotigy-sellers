import React from 'react'
import GallerySwiper from './products-swiper/GallerySwiper'
import { useCustomizeHomePageContext } from '../../../store/CustomizeHomePageContext'
import SimpleSwiper from './products-swiper/SimpleSwiper'

const ProductsSwiper=({section, zoom})=>{
    // products
    const {selectedDevice} = useCustomizeHomePageContext()
    const sectionDesign = section.design[selectedDevice]


    const productsDesign =  sectionDesign.products

    const {
        productsDisplay,
    } = productsDesign


    return(
        <div>
            { section.products.length > 1 && productsDisplay !== 'simple' && <GallerySwiper section={section} zoom={zoom} />}
            {( section.products.length === 1 || productsDisplay === 'simple') && <SimpleSwiper section={section} />}
        </div>
    )
}

export default ProductsSwiper