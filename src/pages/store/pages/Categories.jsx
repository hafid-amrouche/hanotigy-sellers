import Button from 'components/Button'
import DialogComponent from 'components/tags/Dialog'
import Input from 'components/tags/Input'
import React, { useEffect, useRef, useState } from 'react'
import { slugify, translate } from 'utils/utils'
import axios from 'axios'
import { apiUrl } from 'constants/urls'
import { useBrowserContext } from 'store/browser-context'
import IconWithHover from 'components/IconWithHover'
import UploadImageButton from 'components/UploadImageButton'
import Loader from 'components/Loader'
import { useUserContext } from 'store/user-context'
import Img from 'components/Img'

const AddCategoryContent=({setCategories, close, category=null})=>{
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription]= useState('')
    const [image, setImage] = useState(null)
    useEffect(()=>{
       if(category){
            setTitle(category.label)
            setSlug(category.slug)
            setDescription(category.description)
            setImage(category.image)
        }
    }, [category])

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
                apiUrl + (category ? '/category/update-category' : '/category/add-category'),
                {
                    title,
                    description,
                    image,
                    slug: slug,
                    store_id: localStorage.getItem('storeId'),
                    category_id : category ? category.id : undefined
                },
                {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            if(category) {
                setCategories(categories=>{
                    const newState = [...categories]
                    const selectedCategory = newState.find(cat=>cat.id == category.id)
                    selectedCategory.label= title
                    selectedCategory.image = image
                    selectedCategory.slug= slug
                    selectedCategory.description=description
                    return newState
                })
            }else{
                setCategories(categories=>(
                    [
                        {
                            id: response.data.catgeoryId,
                            label: title,
                            image,
                            slug,
                            description
                        },
                        ...categories
                    ]
                ))
            }
           
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
                <h4>https://{userData.domain}/categories/</h4>
                <input style={{minWidth: 200}} placeholder={'Slug'} value={slug} onChange={(e)=>setSlug(slugify(e.target.value))} className='flex-1 box-input' />
            </div>
            <textarea defaultValue={description} onBlur={(e)=>setDescription(e.target.value.trim())} placeholder={'Description for the category'} className='box-input' />
            <div className='d-f  align-center justify-center'>
                <UploadImageButton type='category' resolution={480} key={image} image={image} imageChangeHandler={setImage} url='/upload-category-image' size={64} />
            </div>
            { !loading && <Button outline className='g-3' disabled={title.trim().length === 0 } onClick={saveCategory}><i className='fa fa-solid fa-bookmark'></i> { translate('Save category') }</Button>}
            { loading && <Button className='g-3'  disabled><Loader diam={20} /> { translate('Saving...') }</Button>}
        </div>
    )
}

const Categories = () => {
    const [categories, setCategories] = useState([])
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
        }
        catch(err){
            console.log(err)
            setError(true)
        }
        setloading(false)
    }

    useEffect(()=>{
        getCategories()
    }, [])

    const {setGlobalMessageA} = useBrowserContext()
    const [deleting, setDeleting] = useState(null)
    const deleteCategory=async(categoryId)=>{
        setDeleting(categoryId)
        try{
            const response = await axios.post(
                apiUrl + '/category/delete-category',
                {
                    category_id:categoryId,
                    store_id: localStorage.getItem('storeId')
                },
                {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            setCategories(categories=>categories.filter(cat=>cat.id !== categoryId))
        }
        catch(err){
            console.log(err)
            setGlobalMessageA({
                color: 'red',
                children: translate('Category was not deleted'),
                time: 3000
              })
        }
        setDeleting(null)
    }


    const addCategoriesHandler=()=>{
        addModalRef.current?.open()
    }
    const addModalRef = useRef()

    const [selectedCategory, setSelectedCategory] = useState(null)
    const updateCategoriesHandler=(categoryId)=>{
        setSelectedCategory(categories.find(cat=>cat.id == categoryId))
        updateModalRef.current?.open()
    }
    const updateModalRef = useRef()

    if(loading) {
        return  (
            <div className='p-3 d-f align-center justify-center flex-1'> 
                <Loader diam={100} />
            </div>
        )
    }
    else if (error){
        return (
            <div className='column g-4 align-center justify-center'> 
                <h4 className='color-red'>{ translate('Error loading categories.') }</h4>
                <Button onClick={getCategories} className='g-4'>
                    <i className='fa-solid fa-rotate-right'></i>
                    {translate('Reload') }
                </Button>
            </div>
        )
    }
  return (
    <div className='m-3 container column g-3'>
        <div className='p-2'>
           
            { categories.length === 0 &&  <h3 className='text-center mb-3'>{ translate('You have no categories yet') }</h3>}
            { categories.length > 0 &&
                <div className='d-flex flex-column g-4 mb-4'>
                    {categories.map(cat=><div key={cat.id} disabled={deleting} className={`d-f g-3 align-items-center${ cat.id === deleting ? ' blur' : ''}`}>
                        <Img
                            src={cat.image}
                            width={40}
                            height={40}
                            style={{
                                objectFit: 'cover',
                                borderRadius: 8
                            }}
                            
                        />
                        <h3 className='flex-1'>{cat.label}</h3>
                        <div className='d-flex g-4'>
                            <IconWithHover  onClick={()=>updateCategoriesHandler(cat.id)} iconClass='fa-solid fa-edit' />
                            <IconWithHover  onClick={()=>deleteCategory(cat.id)} iconClass='fa-solid fa-trash color-red' />
                        </div>
                    </div>)}
                </div>
            }
            
            <Button className='w-100' onClick={addCategoriesHandler}>{translate('Add categories')}</Button>
            <DialogComponent open={false} ref={updateModalRef} backDropPressCloses>
                <AddCategoryContent setCategories={setCategories} category={selectedCategory} close={()=>updateModalRef.current?.close()}/>
            </DialogComponent>
            <DialogComponent open={false} ref={addModalRef} backDropPressCloses>
                <AddCategoryContent setCategories={setCategories} close={()=>addModalRef.current?.close()}/>
            </DialogComponent>
        </div>      
    </div>
    
  )
}

export default Categories