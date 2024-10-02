import React from 'react'
import EditGeneralDesign from './edit-section/edit-general-design/EditGeneralDesign'
import EditCategoryExtention from './edit-section/edit-category/EditCategoryExtention'
import { useCustomizeHomePageContext } from '../store/CustomizeHomePageContext'
import EditSwiperExtention from './edit-section/edit-swiper/EditSwiperExtention'

const EditSection = () => {
  const {selectedSectionId, selectedSectionType} = useCustomizeHomePageContext()
  return (
    <div className='hide-900 container' style={{width: 300}}>
      { selectedSectionId && selectedSectionType === 'products-container' && <EditCategoryExtention />}
      { selectedSectionId === 'general-design' && <EditGeneralDesign /> }
      { selectedSectionId && selectedSectionType === 'swiper' && <EditSwiperExtention /> }
    </div>
  )
}

export default EditSection