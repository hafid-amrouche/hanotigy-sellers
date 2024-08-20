import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import classes from '../AddProduct.module.css'
import { deleteImage, fileToBase64, reduceImageQuality, translate } from 'utils/utils'
import IconWithHover from 'components/IconWithHover'
import Button from 'components/Button'
import Loader from '../../components/Loader'
import axios from 'axios'
import { apiUrl, filesUrl } from 'constants/urls'
import {  motion, Reorder } from 'framer-motion'
import { ReorderItem } from 'components/ReorderItem'
import MotionItem from 'components/Motionitem'
import { useBrowserContext } from 'store/browser-context'
import { useContextSelector } from 'use-context-selector'
import { AddProductContext } from './store/add-product-context'
import DialogComponent from 'components/tags/Dialog'


const uploadImage =async(file)=>{
  try{
    const image = (await reduceImageQuality([file], 0.7, 2048, "webp"))[0];
    const formData = new FormData();
    formData.append('image', image);
    formData.append('product_id', localStorage.getItem('productId'));
    const response = await axios({
        method: 'POST',
        url: filesUrl + '/upload-gallery-image', // Replace with your actual upload URL
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: formData
    })
    return response.data.url
  }
  catch{
    return null
  }
}

const UploadImagesSection = forwardRef(({show}, ref) => {
  const defaultGalleryImages = useContextSelector(AddProductContext, state=>state.productInfo.galleryImages) 

  const {setGlobalMessageA} = useBrowserContext()

  const [files64Base ,setFiles64Base] = useState(defaultGalleryImages)
  const files64BaseRef = useRef(files64Base)
  files64BaseRef.current = useMemo(()=>files64Base, [files64Base])
  const [previousOrdering, setPreviousOrdering] = useState([]) // in case if canceling the ordering
  const inputRef = useRef()
  const [disablePinning, setDisablePinning] = useState(false)
  const changeHandler=async (e)=>{
    setDisablePinning(true)
    setTimeout(()=>{
      if(inputRef.current) inputRef.current.value = ''
    }, 200)

    const newFiles = e.target.files
    let newFiles64Base= []
    for (const newFile of newFiles){
      const order = files64Base.length + newFiles64Base.length + 1
      const newFile64Base = {
        base64Url : await fileToBase64(newFile),
        order: order,
        file : newFile,
        status: 'loading'
      }
      newFiles64Base=[
        newFile64Base,
        ...newFiles64Base
      ]
    }
    setFiles64Base(files=>([
      ...newFiles64Base,
      ...files
    ]))
    const newImagesUrl = []
    for (const file64base of newFiles64Base){
        const imageUrl = await uploadImage(file64base.file)
        if (imageUrl){
          setFiles64Base((oldFiles)=>{
            const newFiles=  [...oldFiles]
            const file = newFiles.find(file=>file.order === file64base.order)
            file.status = 'success'
            file.imageUrl = imageUrl
            return newFiles
          })
          newImagesUrl.push(imageUrl)
        }
        else{
          setGlobalMessageA({
            color: 'red',
            children: translate('Your image was not added'),
            time: 2000
          })
          setFiles64Base(files=>{
            const newFiles = files.filter(file=>file.order !== file64base.order)
            return newFiles.filter(file=>file.order !== file64base.order)
          })
        }
    }
    setDisablePinning(false)
    saveImages([...newImagesUrl, ...files64Base.map(file=>file.imageUrl)])
  }

  const deleteImageHandler=async(url)=>{
    setFiles64Base(files=>{
      const newFiles=  [...files]
      const file = newFiles.find(file=>file.imageUrl === url)
      file.status = 'deleting'
      return newFiles
    })

    const response =await deleteImage(url)
    if (!response){
      setFiles64Base(files=>{
        const newFiles=  [...files]
        const file = newFiles.find(file=>file.imageUrl === url)
        file.status = 'success'
        return newFiles
      })
      return
    } 
    setFiles64Base(files=>{
      const newState = files.filter(file=>file.imageUrl !== url)
      saveImages(newState.map(file=>file.imageUrl))
      return newState
    })
  }

  const [deletingAll, setDeletingAll] = useState(false)
  const deleteAllImages =async()=>{
    deleteAllModal.current?.close()
    setDeletingAll(true)
    try{
      const response = await axios.post(
          filesUrl + '/delete-all-gallery-images',
          {
              product_id: localStorage.getItem('productId'),
          },
          {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
              }
          }
      )
      const deletedImages = response.data.deletedImages
      setFiles64Base(files=>{
        const newFiles = files.filter(file=>!deletedImages.includes(file.imageUrl))
        saveImages(newFiles.map(file=>file.imageUrl))
        return newFiles
      })
    }catch{
      setGlobalMessageA({
        color: 'red',
        children: translate('All images were not deleted'),
        time: 2000
      })
    }
    setDeletingAll(false)
  }
  const deleteAllModal = useRef()

  
  const setDefault=(order)=>{
    const arr = [...files64Base]
    const index = arr.findIndex(item => item.order === order);

    // If the object is found and it's not already at the top
    if (index > -1 && index !== 0) {
      // Remove the object from its current position
      const [item] = arr.splice(index, 1);
      // Insert the object at the beginning of the array
      arr.unshift(item);
    }

    setFiles64Base(arr)
    if (!reorder) saveImages(arr.map(file=>file.imageUrl))
    document.querySelector('.' + classes['gallery-container']).scrollTo({
      top: 0,
      behavior: 'smooth'
  })
  }
  const [reorder, setReorder] = useState(false)
  const [savingReorder, setSavingReorder] = useState(false)
  const saveImages=async(newImages)=>{
    
    setSavingReorder(true)
    try{
      const response = await axios.post(
          apiUrl + '/product/save-gallery',
          {
              product_id: localStorage.getItem('productId'),
              gallery_images: newImages
          },
          {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
              }
          }
      )
      setGlobalMessageA({
        color: 'var(--successColor)',
        children: translate('Your images were saved successfully'),
        time: 2000
      })
      setReorder(false)
    }catch{
      setGlobalMessageA({
        color: 'red',
        children: translate('images were not saved'),
        time: 2000
      })
    }
    setSavingReorder(false)  
  }

  const cancelReorder=()=>{
    setFiles64Base((prev)=>{
      if (JSON.stringify(prev) === JSON.stringify(previousOrdering)) setReorder(false)
      else setTimeout(()=>setReorder(false), 800)
      return previousOrdering
    })
    
  }
  const reorderImagesHandler=()=>{
    if(reorder) {
      if (JSON.stringify(previousOrdering) === JSON.stringify(files64Base)) {
        setReorder(false)
        return
      }      
      saveImages(files64Base.map(file=>file.imageUrl)) 
    }
    else{
      setReorder(true)
      setPreviousOrdering(files64Base)
    }
  }
  const totalDisabling = deletingAll || savingReorder

  useImperativeHandle(ref, ()=>({
    galleryImages: files64Base.length > 0 ? files64Base.map(file=>file.imageUrl) : undefined
  }))

  console.log(files64Base) 
  return <div className={'container column p-2 m-3 g-4'}>
    <div>
      <h3 className='color-primary mt-2'>{translate('Images')}</h3>
    </div>
    {
     show && (
        <div className={'column'} id='upload-images-section'>
            <div disabled={totalDisabling}>
              <input
                  type='file'
                  accept="image/jpeg, image/png, image/gif, image/bmp, image/webp, image/tiff"
                  multiple={true}
                  onChange={changeHandler}
                  style={{
                    display: 'none'
                  }}
                  ref={inputRef}
                />
              <div className={'container p-3 ' + classes['gallery-container']} style={{height: '60vh', overflowY:'auto', borderRadius: 0}}>
                { files64Base.length === 0 &&

                      <div style={{width: '100%', height: '100%'}} className='d-f align-center justify-center'>
                        <MotionItem>
                          <IconWithHover iconClass='fa-solid fa-cloud-arrow-up color-primary' size={100} onClick={()=>inputRef.current?.click()} />
                        </MotionItem>
                      </div>
                  }
                  {
                    files64Base.length > 0 &&
                      <>
                        { !reorder &&
                          <div className='d-f g-4 mb-3'>
                            <MotionItem className='flex-1'>
                              <Button onClick={()=>inputRef.current?.click()} outline style={{width: '100%', gap: 8}}>
                                <i className='fa-solid fa-square-plus' style={{fontSize: 20}}></i>
                                {translate('Add Images')}
                              </Button>
                            </MotionItem>
                          </div>
                        }
                        <div className='reorder-item' style={{width: '100%'}}>
                          {
                            reorder &&
                            <Reorder.Group axis="y" onReorder={setFiles64Base} values={files64Base}>
                                {
                                  files64Base.map((file, index)=>(
                                    <ReorderItem item={file} keyExtractor='order' key={file.order} >
                                      <div disabled={file.status === 'deleting'} className='p-2 border d-f  justify-space-between' style={{borderRadius: 0}}>

                                      <div className='d-f g-3 align-center'>
                                        <div className={`${classes['order']} ${index === 0 ? classes['first'] : ''}`}>
                                          <h4 >{index + 1}</h4>
                                        </div>
                                        <div
                                          style={{
                                            backgroundImage: `url(${ file.base64Url || file.imageUrl})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            height: 40,
                                            width: 40,
                                            borderRadius: 8,
                                            border:' 1px solid var(--borderColor)'

                                          }}
                                        >
                                          <div
                                            style={{
                                              backgroundColor: file.status === 'loading' ? 'rgba(var(--containerColor-rgb), 0.6)' : undefined,
                                              height: '100%',
                                              width: '100%',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              position: 'relative',
                                            }}

                                          >
                                            {file.status === 'loading'  && <Loader diam={40} />}
                                          </div>
                                        </div>
                                      </div>
                                        
                                        <div className='d-f align-center g-4'>
                                        { index !== 0 && <IconWithHover disabled={disablePinning} onClick={()=>setDefault(file.order)} iconClass='fa-solid fa-thumbtack color-primary' size={20} />}
                                        </div>  
                                      </div>
                                    </ReorderItem>
                                  ))
                                }
                            </Reorder.Group>
                          }
                          {
                            !reorder &&
                            <div className='d-f f-wrap g-3'>
                              {
                                files64Base.map((file, index)=>(
                                  <MotionItem Tag={motion.div} key={file.order}>
                                    <div disabled={file.status === 'deleting'} className='p-2 border d-f g-3 justify-space-between' >
                                      <div
                                        style={{
                                          backgroundImage: `url(${ file.base64Url || file.imageUrl})`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          height: 100,
                                          width: 100,
                                          borderRadius: 8,
                                          border:' 1px solid var(--borderColor)',

                                        }}
                                      >
                                        <div
                                          style={{
                                            backgroundColor: file.status === 'loading' ? 'rgba(var(--containerColor-rgb), 0.6)' : undefined,
                                            height: '100%',
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                          }}

                                        >
                                          {file.status === 'loading'  && <Loader diam={40} />}
                                        </div>
                                      </div>
                                      <div className='column align-center justify-space-between'>
                                        <IconWithHover disabled={file.status === 'loading'} iconClass='fa-solid fa-trash color-red' onClick={()=>deleteImageHandler(file.imageUrl)} />  
                                        { index !== 0 && <IconWithHover disabled={disablePinning} onClick={()=>setDefault(file.order)} iconClass='fa-solid fa-thumbtack color-primary' size={24} />}
                                    
                                      </div>  
                                    </div>
                                  </MotionItem>
                                ))
                              }
                            </div>
                                
                          }
                            
                        </div>
                      </>
                  }
              </div>
              { files64Base.length > 1 && 
                <div className='d-f justify-space-around mt-2'>
                  <MotionItem style={{width: '48%'}}>
                    <Button disabled={disablePinning} outline={reorder} style={{width: '100%', gap: 8}} className='g-3' onClick={reorderImagesHandler}>
                      <i className="fa-solid fa-bars-staggered" ></i>
                      <span>{ reorder ? translate('Save ordering') : translate('Reorder images')}</span>
                    </Button>
                  </MotionItem>
                  { !reorder &&
                    <MotionItem disabled={disablePinning} style={{width: '48%'}}>
                      <Button theme='red' onClick={()=>deleteAllModal.current?.toggle()} style={{width: '100%', gap: 8}}>
                        <i className='fa-solid fa-trash' style={{fontSize: 16}}></i>
                        {translate('Delete all')}
                      </Button>
                    </MotionItem>
                  }
                  {  reorder && 
                    <MotionItem style={{width: '48%'}}>
                      <Button theme='dark' style={{width: '100%', gap: 8}} className='g-3' onClick={cancelReorder}>
                        <i className="fa-solid fa-xmark" ></i>
                        <span>{ translate('Cancel reorder')}</span>
                      </Button>
                    </MotionItem>
                  }
                  <DialogComponent ref={deleteAllModal} backDropPressCloses>
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
                        <h4>{ translate('Are you sure you want to delete all images ?') }</h4>
                        <div className='d-f justify-space-between'>
                          <Button theme='red' outline onClick={deleteAllImages} >Delete all</Button>
                          <Button theme='dark' onClick={()=>deleteAllModal.current?.close()}>Cancel</Button>
                        </div>
                    </div>
                  </DialogComponent>
                </div>
              }
            </div>
        </div>
      ) 
    }
  </div>
      
})

export default UploadImagesSection