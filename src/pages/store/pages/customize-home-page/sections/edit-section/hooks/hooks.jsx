import { useCustomizeHomePageContext } from "../../../store/CustomizeHomePageContext"

export const useApplySectionToAll=(type)=>{
    const {setSections, selectedSectionId, sections, selectedDevice} = useCustomizeHomePageContext()

    const func = ()=>{
        const selectedSection = sections.find(sec=>sec.id === selectedSectionId)
        setSections(sections=>{
            return sections.map(section=>{
            if (section.type === type){
                return {
                ...section,
                design: {
                    ...section.design,
                    [selectedDevice]: selectedSection.design[selectedDevice]
                }
                }
            }
            else return section
            })
        })
    }
    return func
}