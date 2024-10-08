import { useRef, useState} from "react"
import { translate } from "utils/utils"
import CustomCheckbox from "./CustomCheckBox"
import IconWithHover from "./IconWithHover"
import Button from "./Button"
import DialogComponent from "./tags/Dialog"

const StateShippingCostsCard=({state, setStates})=>{
    const blurHndler=(cost, state)=>{
        setStates(states=>{
            const newStates = [...states]
            const newState = newStates.find(elem=>elem.id === state.id)
            newState.cost = cost ==='' ? null : Number(cost)
            return newStates
        })
    }
    const toHomeblurHndler=(cost, state)=>{
        setStates(states=>{
            const newStates = [...states]
            const newState = newStates.find(elem=>elem.id === state.id)
            newState.costToHome = cost ==='' ? null : Number(cost)
            return newStates
        })
    }
    const [costChecked, setCostChecked] = useState(state.cost !== null)
    const [costToHomeChecked, setCostToHomeChecked] = useState(state.costToHome !== null)

    const copyToAllHomeFields=(value=null, approved=false)=>{
        if (!approved) copyToAllHomeFieldsRef.current?.open()
        if(approved) {
            setStates(states=>states.map(stt=>({
                ...stt,
                costToHome: stt.costToHome !== null ? value : null
                }))
            )
            copyToAllHomeFieldsRef.current?.close()
        }
    }
    
    const copyToAllOfficeFields=(value=null, approved=false)=>{
        if (!approved) copyToAllOfficeFieldsRef.current?.open()
        if(approved) {
            setStates(states=>states.map(stt=>({
                ...stt,
                cost: stt.cost !== null ? value : null
                }))
            )
            copyToAllOfficeFieldsRef.current?.close()
        }
    }

    const copyToAllHomeFieldsRef = useRef()
    const copyToAllOfficeFieldsRef = useRef()

    return(
        <div className="d-f g-1 column container p-2 px-1">
            <div  className="d-f align-center g-2 p-relative mb-1" style={{height: 30}}>
                <h4 className="px-1 cut-text" style={{width: '100%', position:'absolute'}}>{`${state.code} - ${state.name}`}</h4>
            </div>
            
            <div className="d-f align-center g-3 p-relative mb-2 mt-3">
                <CustomCheckbox checked={costToHomeChecked}  onChange={e=>{
                    if (e.target.checked) toHomeblurHndler(0, state)
                    else toHomeblurHndler('', state)
                    setCostToHomeChecked(e.target.checked)
                }} />
                <input onClick={()=>setCostToHomeChecked(true)} className={"box-input " +( costToHomeChecked ? 'border-primary' : '')} onChange={(e)=>toHomeblurHndler(e.target.value, state)} value={ (state.costToHome === null) ? '' : state.costToHome } style={{ width: 120}} type='number' min={0} placeholder={translate('Home')} />
                { costToHomeChecked && 
                    <button
                        style={{
                            position: 'absolute',
                            alignSelf: 'flex-start',
                            right: 6,
                            top: -28,
                            color: 'var(--primaryColor)',
                            textDecoration: 'underline',
                            scale: 0.8
                        }}
                        onClick={()=>copyToAllHomeFields()}
                    >  
                        {translate('apply to all')}
                    </button>
                }
                <DialogComponent ref={copyToAllHomeFieldsRef} >
                    <div className='container p-2 column g-4' style={{maxWidth: '80vw'}}>
                        <h4 style={{textAlign: 'start'}}>{translate('Are you sure you want to copy this value "{cost}" to all home shipping cost fields ?', {cost: state.costToHome})}</h4>
                        <div className='d-f justify-space-between'>
                        <Button outline onClick={()=>copyToAllHomeFields(state.costToHome, true)}>Yes</Button>
                        <Button theme='dark' onClick={()=>copyToAllHomeFieldsRef.current?.close()}>No</Button>
                        </div>
                    </div>
                </DialogComponent>
            </div>
            <div className="d-f align-center g-3 p-relative mt-3">
                <CustomCheckbox checked={costChecked} onChange={(e)=>{
                    if (e.target.checked) {
                        blurHndler(0, state)
                    }
                    else blurHndler('', state)
                    setCostChecked(e.target.checked)
                }} />
                <input onClick={()=>setCostChecked(true)} className={"box-input " +( costChecked ? 'border-primary' : '')} onChange={(e)=>blurHndler(e.target.value, state)} value={ (state.cost === null) ? '' : state.cost } style={{ width: 120}} type='number' min={0} placeholder={translate('Office')} />
                { costChecked &&  <button
                        style={{
                            position: 'absolute',
                            alignSelf: 'flex-start',
                            right: 6,
                            top: -28,
                            color: 'var(--primaryColor)',
                            textDecoration: 'underline',
                            scale: 0.8
                        }}
                        onClick={()=>copyToAllOfficeFields()}
                    >  
                        {translate('apply to all')}
                    </button>}
                <DialogComponent ref={copyToAllOfficeFieldsRef} >
                    <div className='container p-2 column g-4' style={{maxWidth: '80vw'}}>
                        <h4 style={{textAlign: 'start'}}>{translate('Are you sure you want to copy this value "{cost}" to all office shipping cost ?', {cost: state.cost})}</h4>
                        <div className='d-f justify-space-between'>
                        <Button outline onClick={()=>copyToAllOfficeFields(state.cost, true)}>Yes</Button>
                        <Button theme='dark' onClick={()=>copyToAllOfficeFieldsRef.current?.close()}>No</Button>
                        </div>
                    </div>
                </DialogComponent>
            </div>
        </div>
    )
}


const ShippingByStateSection=({states: stts, setStates})=>{
        const [search, setSearch] = useState('')
        console.log(stts)
        const states = stts.filter(elem=>elem.name.toLowerCase().includes(search.toLowerCase().trim()))
        return(
        <div style={{minHeight: 200}}> 
            <div className="p-3 d-f align-center g-4 justify-center">
                <IconWithHover iconClass='fa-solid fa-search color-primary' />
                <input value={search} onChange={(e)=>setSearch(e.target.value)} className="box-input" style={{maxWidth: 240}} placeholder={translate('Search a state')} />
            </div>
            <div className='g-3 d-f f-wrap justify-center'>
                {
                    states.map(state=><StateShippingCostsCard key={state.id} state={state} setStates={setStates} />)
                }
            </div> 
        </div>       
    )
}

export default ShippingByStateSection