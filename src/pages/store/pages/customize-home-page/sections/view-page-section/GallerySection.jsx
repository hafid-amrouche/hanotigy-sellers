import React from 'react'
import { useCustomizeHomePageContext } from '../../store/CustomizeHomePageContext'
import ProductsSwiper from './components/ProductsSwiper'

const GallerySection = ({section, zoom}) => {
    const {selectedDevice, visionMode} = useCustomizeHomePageContext() 

    const sectionDesign = section.design[selectedDevice]

    // title 
    const titleDesign = sectionDesign.title
    const {
        showTitle,
        size: titleSize,
        direction,
        padding,
        label: {
            color: titleLabelColorObject,
        },
    } = titleDesign
    const titleLabelColor = titleLabelColorObject[visionMode]

    return(
        <div >
                { showTitle && 
                    <div className='d-flex g-2 align-items-center color-primary' style={{ justifyContent: direction, color: titleLabelColor, padding}}>
                        <strong style={{fontSize: titleSize, color: titleLabelColor}} >{ section.title }</strong>
                    </div>
                }
                { section.products.length > 0 && <ProductsSwiper key={zoom} section={section} zoom={zoom} />}
        </div>     
    )
}

export default GallerySection