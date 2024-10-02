import React from 'react'
import { useCustomizeHomePageContext } from '../../store/CustomizeHomePageContext'

const SwiperSection = ({section, zoom}) => {
    const {selectedDevice} = useCustomizeHomePageContext()
    const imageObjects = section.imageObjects[selectedDevice]
    const sectionDesign = section.design[selectedDevice]
    console.log(sectionDesign)
    return (
        <div>SwiperSection</div>
    )
}

export default SwiperSection