import React from 'react'
import { translate } from 'utils/utils'
import Range from 'components/Range'
import { useCustomizeHomePageContext } from 'pages/store/pages/customize-home-page/store/CustomizeHomePageContext'
import LocalApplyToAll from '../../components/LocalApplyToAll'

const EditGeneralMarginTop=()=>{
  const {sectionDesign, selectedSectionId, updateSectionDesign} = useCustomizeHomePageContext()    
  const marginTop = sectionDesign.marginTop

  const setMarginTop=(value, toAll=false)=>{
    const newDesign={
      marginTop: Number(value)
    }
    updateSectionDesign(selectedSectionId, newDesign, toAll)
  }

  const applyToAllAction=()=>{
    setMarginTop(marginTop, true)
  }

  return(
    <div>
      <div className='d-f align-items-center g-3'>
          <p>{ translate('Margin top') }:</p>
      </div>
      <Range
        min={0}
        max={56}
        step={2}
        value={marginTop}
        setValue={setMarginTop}
      />
      <LocalApplyToAll 
        action={applyToAllAction} 
        chain={[translate('Margin top')]}
      />
    </div>
  )
}

const EditGeneralMarginHorizontal=()=>{
  const {sectionDesign, selectedSectionId, updateSectionDesign} = useCustomizeHomePageContext()    
  const marginHorizontal = sectionDesign.marginHorizontal

  const setMarginHorizontal=(value, toAll=false)=>{
    const newDesign={
      marginHorizontal: Number(value)
    }
    updateSectionDesign(selectedSectionId, newDesign, toAll)
  }

  const applyToAllAction=()=>{
    setMarginHorizontal(marginHorizontal, true)
  }


  return(
    <div>
      <div className='d-f align-items-center g-3'>
          <p>{ translate('Margin Horizontal') }:</p>
      </div>
      <Range
        min={0}
        max={56}
        step={2}
        value={marginHorizontal}
        setValue={setMarginHorizontal}
      />
      <LocalApplyToAll 
        action={applyToAllAction} 
        chain={[translate('Margin horizontal')]}
      />
    </div>
  )
}

export {EditGeneralMarginTop, EditGeneralMarginHorizontal}