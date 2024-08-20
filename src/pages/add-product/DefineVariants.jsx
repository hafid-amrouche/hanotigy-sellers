import Button from 'components/Button'
import React, { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { adjustScrollPosition, deleteImage, translate } from 'utils/utils'
import classes from '../AddProduct.module.css'
import Select from 'components/tags/Select'
import IconWithHover from 'components/IconWithHover'
import './VariationSection.css'
import ColorPicker from 'components/ColorPicker'
import DialogComponent from 'components/tags/Dialog'
import MotionItem from 'components/Motionitem'
import { AnimatePresence, color, motion } from 'framer-motion'
import { useContextSelector } from 'use-context-selector'
import { AddProductContext } from './store/add-product-context'
import UploadImageButton from './UploadImageButton'

const variantTypes = [
    {
        label: 'Dropdown',
        value: 'dropdown'
    },
    {
        label: 'Radio button',
        value: 'radio-button'
    },
    {
        label: 'Text button',
        value: 'text-button'
    },
    {
        label: 'Colored square',
        value: 'colored-square'
    },
    {
        label: 'Image with text',
        value: 'image-with-text'
    },
]

const LabelOptionButton=({order, option, removeOption})=>{
    return(
        <div className='container p-1 d-f g-3 color-text' style={{background: 'rgba(var(--primaryColor-rgb), 0.2)'}}>
            <h4 className='p-1'>{option.label}</h4>
            <IconWithHover onClick={()=>removeOption(order)} iconClass='fa-solid fa-xmark' />
        </div>
    )
}
const ColorOptionButton=({order, option, setOption, removeOption})=>{
    const colorChangeHandler=(color)=>{
        setOption(
            order,
            {
                ...option,
                color: color
            }
        )
        modalRef.current.close()
    }
    const [showColorPicker, setShoxColorPicker] = useState(false) 
    const modalRef = useRef()
    return(
        <div className='container p-1 d-f g-3 color-text' style={{background: 'rgba(var(--primaryColor-rgb), 0.2)'}}>
            <div className='d-f g-2'>
                <button style={{
                    backgroundColor: option.color,
                }}
                onClick={()=>{setShoxColorPicker(true)}}
                className={classes['color-button']}
                />
                <h4 style={{alignSelf: 'center'}}>{option.label}</h4>
                { showColorPicker && <DialogComponent open={showColorPicker} backDropPressCloses={false} close={()=>setShoxColorPicker(false)} ref={modalRef} >
                    <ColorPicker color={option.color} onChange={colorChangeHandler} closeModal={()=>modalRef.current?.close()}  /> 
                </DialogComponent>}
            </div>
            <IconWithHover onClick={()=>removeOption(order)} iconClass='fa-solid fa-xmark' />
        </div>
    )
}

const ImagesModalContent=({option, setOption, order, innerImage, imageInputRef, setInnerImage, modelRef})=>{
    const galleryImages = useContextSelector(AddProductContext, state=>state.productInfo.galleryImages)

    useEffect(()=>{
        if (!galleryImages.map(image=>image.imageUrl).includes(option.image)){
            setOption(
                order, 
                {
                    ...option,
                    image: null
                }
            )
        }
        if (!galleryImages.map(image=>image.image).includes(innerImage)){
            setInnerImage(null)
        }
    }, [galleryImages])
    return(
        <div 
            style={{
                width: '80vw',
                maxWidth: 600,
                height: '60vh',
                backgroundColor: 'var(--containerColor)',
                borderRadius: 8,
                padding: 10,
            }}
            className='column'
        >
            <button
                onClick={()=>{
                    imageInputRef.current?.click()
                }}
                style={{margin: 'auto'}}
            >
                <IconWithHover iconClass='fa-solid fa-cloud-arrow-up color-primary'  style={{fontSize: 56}}/>
            </button>
            <hr style={{margin: '20px 0'}}/>
            <div style={{
                flex: 1,
                overflowY: 'auto',
            }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 16,
                    paddingTop: 10,
                }}>
                    {galleryImages.map((file)=>(
                        <MotionItem
                            Tag={motion.div} 
                            animate={{scale: [1, 0.5, 1], opacity: 1}} 
                            transition={{duration: 0.5}} 
                            style={{
                            backgroundImage: `url(${file.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: 80,
                            height: 80
                            }}
                            key={file.order} 
                            onClick={()=>{
                                setInnerImage(file.image)
                                setOption(
                                    order, 
                                    {
                                        ...option,
                                        image: file.imageUrl
                                    }
                                )
                            modelRef.current?.close()
                            }}
                            className={classes['suggest-image']} 
                        
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
const ImageTextOptionButton=({order, option, setOption, removeOption})=>{
    const [deleting, setDeleting] = useState(false)

    const removeOptionHandler = async(order)=>{
        setDeleting(true)
        if (option.image && option.image.includes('/variants/')){ // check if image is upload not from the gallery
           const response = await deleteImage(option.image) 
           if (response){
                removeOption(order)
            }
        }
        else{
            removeOption(order)
        }
        setDeleting(false)
    }
    const imageChangeHandler=(image)=>{
        setOption(
            order, 
            {
                ...option,
                image: image
            }
        )
      }
    return(
        <>
            <div className={'container d-f g-3 color-text'} disabled={deleting} style={{background: 'rgba(var(--primaryColor-rgb), 0.2)', padding: 4}}>
                <div className='d-f g-2'>
                    <UploadImageButton image={option.image} url='/upload-variant-image' size={38} resolution={1080} imageChangeHandler={imageChangeHandler} />
                    <h4 style={{alignSelf: 'center'}}>{option.label}</h4>
                </div>
                <IconWithHover onClick={()=>removeOptionHandler(order)} iconClass='fa-solid fa-xmark' />
            </div>
        </>
        
    )
}

const OptionButton=({type, ...props})=>{
    if (['dropdown', 'radio-button', 'text-button'].includes(type)) return <LabelOptionButton {...props} />
    else if (type ==='colored-square') return <ColorOptionButton {...props} />
    else if (type ==='image-with-text') return <ImageTextOptionButton {...props} />
}


const VariantInput = ({addOption, variantOptions, disabled})=>{
    const [option, setOption]=useState({
        label: '',
        color: '#ffffff',
        image: null
    })
    const clickHandler=()=>{
        addOption(
            {
                label : option.label.trim(),
                color: '#ffffff',
                image: null
            }
        )
        setOption(option=>({
            ...option,
            label: '',
        }))
    }
    const changeHandler=(e)=>{
        setOption(option=>({
            ...option,
            label: e.target.value,
        }))
    }
    
    const blurHandler=(e)=>{
        setOption(option=>({
            ...option,
            label: option.label.trim(),
        }))
    }

    const trimmed= option.label.trim() 
    const disabledOption = (trimmed === '' )|| (Object.values(variantOptions).find(elem => elem.label === option.label.trim()))
    return(
        <form style={{display: disabled ? 'none' : 'flex'}} className='d-f g-2 align-center w-fit-content container p-2' onSubmit={(e)=>{
            e.preventDefault()
            clickHandler()
        }}
        >
            <input onChange={changeHandler} value={option.label} onBlur={blurHandler} placeholder='Option' className='flex-1 box-input p-4 borderless' />
            <button disabled={disabledOption}>                
                <IconWithHover iconClass={'fa-solid fa-circle-check ' + (disabledOption ? '' : 'jiggle')} style={{color: 'var(--successColor)'}} size={22} />
            </button>        
        </form>
    )
}

const VariantCard=({varinatName, updateVariantName, order, variantType, setVariantType, variantOptions, updateVariantOptions, error})=>{
    const variantTypeObj = useMemo(()=>variantTypes.find(item=>item.value === variantType), [variantType])
    const [variantInnerOptions, setVariantInnerOptions]=useState(variantOptions)
    const changeHandler=(newVariantTypeObj)=>{
        const newVariantType = newVariantTypeObj.value
        setVariantType(newVariantType, order)
    }
    const addOption=(option)=>{
        setVariantInnerOptions(options=>{
            const optionsKeys = Object.keys(variantInnerOptions)
            const newOrder = optionsKeys.length > 0 ?  Number(optionsKeys[optionsKeys.length - 1]) + 1 : 1
            return{
                ...options,
                [newOrder]: option
            }
        })
    }
    const removeOption=(order)=>{
        setVariantInnerOptions(options=>{
            const newlist = {...options}
            delete newlist[order]
            return newlist
        })
    }

    const setOption=(order, option)=>{
        setVariantInnerOptions(options=>({
            ...options,
            [order]: option
        }))
    }

    const firstCicleDone = useRef(false)
    useEffect(()=>{
        if(firstCicleDone.current) updateVariantOptions(order, variantInnerOptions)
        else firstCicleDone.current = true 
    }, [variantInnerOptions])  

    const [innerName, setInnerName] = useState(varinatName)
    const trimmedInnerName = innerName.trim() 

    // update variant name either each 2 seconds or on blur
    const innerNameRef= useRef(innerName) // userRef becauese insode the time interval function the variable innerName and variantName do not get updated in realtime
    innerNameRef.current = innerName
    const variantNameRef= useRef(varinatName)
    variantNameRef.current = varinatName
    const timeOut = useRef()
    useEffect(()=>{
        clearTimeout(timeOut.current)
        timeOut.current = setTimeout(()=>{
            if (innerNameRef.current !== variantNameRef.current){ 
                updateVariantName(innerNameRef.current.trim(), order)
            }
        }, 1000)
        return ()=>clearTimeout(timeOut.current)
    }, [innerName])
    return(
        <div className='column g-3'>
            <div className='d-f g-3 f-wrap'>
                <div className='flex-1 d-f'>
                    <input
                        placeholder={translate('Name : Color, Size, Material...')}
                        className={'box-input flex-1' + (error ? ' error' : '')}
                        value={innerName}
                        onChange={(e)=>setInnerName(e.target.value, order)}
                        onBlur={(e)=>{
                            setInnerName(e.target.value.trim())
                            updateVariantName(e.target.value.trim(), order)
                        }}
                    />
                </div>
                <div className='flex-1'>
                    <Select options={variantTypes.map(elem=>({...elem, id : elem.value}))} selectedOption={variantTypeObj} onChange={changeHandler} className='flex-1' />
                </div>
            </div>
            <div className='container p-2 ' style={{minHeight: 160}}>
                <AnimatePresence>
                    { trimmedInnerName && <div className='d-f f-wrap g-3' style={{alignItems: 'start'}}>
                        {Object.entries(variantInnerOptions).map(([order, option])=>
                            <MotionItem key={order}>
                                <OptionButton  type={variantType} removeOption={removeOption} setOption={setOption} option={option} order={order} />
                            </MotionItem>
                        )}
                        <MotionItem>
                            <VariantInput disabled={error || !trimmedInnerName} addOption={addOption} variantOptions={variantInnerOptions} type={variantType}/>
                        </MotionItem>
                    </div>}
                </AnimatePresence>
                    
            </div>
        </div>
    )
}


const DefineVariants = memo(forwardRef(({variants, setVariants}, ref) => {
    const [variantError, setVarinatError] = useState(false)
    const variantsNames = Object.values(variants).map(item=>item.name)
    const varinatsKeys = Object.keys(variants)
    useImperativeHandle(ref, () => ({
        addVariant: ()=>document.querySelector('#add-variant-button').click(),
    }))

    const clickHandler=(e)=>{
        if(variantsNames.length !== 0) setTimeout(()=>adjustScrollPosition(e.target, -20), 0)
        setVariants(varinatsList=>{
            let newList = {...varinatsList}
            if (varinatsKeys.length === 0 ) return ({
                1: {
                    name: '',
                    type: 'dropdown',
                    options: {},
                }   
            })
            else {
                const lastKey = varinatsKeys[varinatsKeys.length-1]
                newList[Number(lastKey) + 1] = {
                    name: '',
                    type: 'dropdown',
                    options: {},
                }
                return newList
            }
        })
    }
    const removeVariant=(order)=>{
        if (order === variantError) setVarinatError(null)
        setVariants(varinatsList=>{
            const newList = {...varinatsList}
            delete newList[order]
            return newList
        })
    }
    const setVariantType=(type, variantOrder)=>{
        setVariants(variants=>{
            const newList = {...variants}
            newList[variantOrder].type = type
            return newList
        })
    }
    const updateVariantName=(name, variantOrder)=>{
        if (variants[variantOrder].name === name) {
            return
        }
        const otherVariantsList = {...variants} // variants excluding the object with the variantOrder
        delete otherVariantsList[variantOrder]
        const otherVariantsNames = Object.values(otherVariantsList).map(variant=>variant.name)
        if (otherVariantsNames.includes(name.trim())){
            setVarinatError(variantOrder)
        }else{
            setVarinatError(null)
        }
            
        setVariants(variants=>{
            const newList = {...variants}
            newList[variantOrder].name = name
            return newList
        })
    }
    const updateVariantOptions=(order, options)=>{
        setVariants(variants=>{
            const newList = {...variants}
            newList[order].options = options
            return newList
        })
    }
    return (
        <div className={ classes['card'] + ' container column add-product'}>
                {varinatsKeys.length > 0 && <div className='column g-4'>
                    { varinatsKeys.map((order)=>(
                            <MotionItem key={order}>
                                <div className='column g-3 container p-2'>
                                    <div className='row-reverse'>
                                        <IconWithHover iconClass='fa-solid fa-trash color-red' className='p-2' size={24} onClick={()=>removeVariant(order)} />
                                    </div>
                                    <VariantCard {...{
                                        varinatName: variants[order].name, 
                                        updateVariantName, 
                                        order, 
                                        setVariantType,
                                        variantType: variants[order].type,
                                        variantOptions: variants[order].options,
                                        updateVariantOptions, 
                                        error: variantError === order
                                    }} />
                                </div>
                            </MotionItem>
                        ))}
                    </div>
                }            
        <Button outline disabled={variantError || variantsNames.includes('')} id='add-variant-button' onClick={clickHandler}>{translate('Add variant')}</Button>
    </div>
  )
}))

export default DefineVariants