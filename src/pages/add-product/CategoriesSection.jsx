import Button from 'components/Button'
import DialogComponent from 'components/tags/Dialog'
import Input from 'components/tags/Input'
import MultipleSelect from 'components/tags/MulipleSelect'
import useScrollToTop from 'hooks/useScrollToTop'
import React, {forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { slugify, translate } from 'utils/utils'
import axios from 'axios'
import { apiUrl } from 'constants/urls'
import { useBrowserContext } from 'store/browser-context'
import IconWithHover from 'components/IconWithHover'
import { useContextSelector } from 'use-context-selector'
import { AddProductContext } from './store/add-product-context'
import Accordiant from 'components/Accordiant'
import Loader from 'components/Loader'
import UploadImageButton from 'components/UploadImageButton'
import { useUserContext } from 'store/user-context'

const AddCategoryContent=({setCategories, setSelecetdCategories, close})=>{
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription]= useState('')
    const [image, setImage] = useState(null)
    const [loading, setloading] = useState(false)
    const {setGlobalMessageA} = useBrowserContext()

    const blurHandler=(newValue)=>{
        setTitle(newValue)
        if(!slug.trim())setSlug(slugify(newValue))
    }

    const saveCategory=async()=>{
        setloading(true)
        try{
            const response = await axios.post(
                apiUrl + '/category/add-catgeory',
                {
                    title,
                    description,
                    image,
                    slug: slug
                },
                {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            setCategories(categories=>(
                [
                    {
                        id: response.data.catgeoryId,
                        label: title,
                        image,
                    },
                    ...categories
                ]
            ))
            if (setSelecetdCategories) setSelecetdCategories(categories=>([
                {
                    id: response.data.catgeoryId,
                    label: title,
                    image,
                },
                ...categories
            ]))
            close()
        }
        catch(err){
            console.log(err)
            setGlobalMessageA({
                color: 'red',
                children: translate('Gallery was not created'),
                time: 3000
              })
        }
        setloading(false)
    }

    const {userData} = useUserContext()
    return(
        <div style={{
            width: '80vw',
            maxWidth: 600,
            mxHeight: '60vh',
            backgroundColor: 'var(--containerColor)',
            borderRadius: 8,
            padding: 10,
            gap: 16,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h3 className='color-primary'>{ translate('Add Category') }</h3>
            <Input label={'Title'} value={title} onChange={setTitle} onBlur={blurHandler} className='flex-1' />
            <div className='d-f align-center g-3 f-wrap'>
                <h4>https://{userData}/categories/</h4>
                <input style={{minWidth: 200}} placeholder={'Slug'} value={slug} onChange={(e)=>setSlug(slugify(e.target.value))} className='flex-1 box-input' />
            </div>
            <textarea defaultValue={description} onBlur={(e)=>setDescription(e.target.value.trim())} placeholder={'Description for the category'} className='box-input' />
            <div className='d-f  align-center justify-center'>
                <UploadImageButton type='category' resolution={480} image={image} imageChangeHandler={setImage} url='/upload-category-image' size={64} />
            </div>
            { !loading && <Button outline className='g-3' disabled={title.trim().length === 0 } onClick={saveCategory}><i className='fa fa-solid fa-bookmark'></i> { translate('Save category') }</Button>}
            { loading && <Button className='g-3'  disabled><Loader diam={20} /> { translate('Saving...') }</Button>}
        </div>
    )
}

const CategoriesSection = forwardRef((props, ref) => {
    const [categories, setCategories] = useState([])
    const [categoriesFetch, setCategoriesFetched] = useState(false)
    const [loading, setloading] = useState(false)
    const [error, setError] = useState(false)
    const getCategories=async()=>{
        setError(false)
        setloading(true)
        try{
            const response = await axios.get(
                apiUrl + '/category/get-categories',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            setCategories(response.data)
            console.log(response.data)
            setSelecetdCategories(()=>(
                response.data.filter(cat=>defaultSelectedCategories.map(cat=>cat.id).includes(cat.id))
            ))
            setCategoriesFetched(true)
        }
        catch(err){
            console.log(err)
            setError(true)
        }
        setloading(false)
    }
            
    let defaultSelectedCategories = useContextSelector(AddProductContext, state=>state.productInfo.selectedCategories)
    const [selectedCategories, setSelecetdCategories] = useState(defaultSelectedCategories)
    const [show, setShow] = useState(defaultSelectedCategories.length > 0)
    useScrollToTop(show, '#category-container', 70)
    const mutipleSelectRef = useRef()
    const addCategoriesHandler=()=>{
        modalRef.current?.open()
    }
    const modalRef = useRef()
    let emptyOptionsElment
    if(loading) {
        emptyOptionsElment =  (
            <div className='p-3 d-f align-center justify-center'> 
                <Loader diam={60} />
            </div>
        )
    }
    else if (error){
        emptyOptionsElment = (
            <div className='p-3 column g-4 align-center justify-center'> 
                <h4 className='color-red'>{ translate('Error loading categories.') }</h4>
                <Button onClick={getCategories} className='g-4'>
                    <i className='fa-solid fa-rotate-right'></i>
                    {translate('Reload') }
                </Button>
            </div>
        )
    }

    else if (categories.length === 0 ){
        emptyOptionsElment = (
            <div className='column align-center justify-center g-4 p-3'>
                <h4>{ translate('You have no categories yet') }</h4>
                <Button onClick={addCategoriesHandler}>{translate('Add categories')}</Button>
                <DialogComponent open={false} ref={modalRef} backDropPressCloses>
                    <AddCategoryContent setCategories={setCategories} close={()=>modalRef.current?.close()}/>
                </DialogComponent>
            </div>
        )
    }
    
    useImperativeHandle(ref, ()=>({
        categoriesData: show ? {selectedCategories: selectedCategories.map(cat=>cat.id)} : {}
    }))

  return (
    <div className='p-2 m-3 container column g-3' id='category-container'>
        <div className={' d-f align-center g-3 cursor-pointer'} onClick={()=>setShow(!show)} >
            <Accordiant checked={show} setChecked={()=>{}} />
            <h3 className='color-primary'>{translate('Categories')}</h3>
        </div>            
        { show &&
            <div className='d-f g-4 align-center' style={{width: '100%', zIndex: 110}}>
                <MultipleSelect 
                    ref={mutipleSelectRef}
                    label={( !categoriesFetch  && `${ selectedCategories.map(obj=>obj.label).join(' | ')}` )|| translate('Categories')   } 
                    options={categories} 
                    selectedOptions={selectedCategories}
                    onChange={(selectedOptions)=>setSelecetdCategories(selectedOptions)}
                    containerStyle={{width: 'calc(100% - 64px)'}}
                    onShowOptions={()=>!categoriesFetch ? getCategories() : undefined}
                    emptyOptionElemnt={emptyOptionsElment}
                />
                <IconWithHover iconClass='fa-solid fa-square-plus color-primary' size={48} onClick={()=>modalRef.current?.open()} />
                <DialogComponent open={false} ref={modalRef} backDropPressCloses>
                    <AddCategoryContent setCategories={setCategories} setSelecetdCategories={setSelecetdCategories} close={()=>modalRef.current?.close()}/>
                </DialogComponent>
            </div>
        }
    </div>
    
  )
})

export default CategoriesSection