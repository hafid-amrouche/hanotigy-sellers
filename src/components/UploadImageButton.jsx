import React, { useRef, useState } from 'react'
import { deleteImage, fileToBase64, reduceImageQuality, translate } from 'utils/utils'
import DialogComponent from 'components/tags/Dialog'
import IconWithHover from 'components/IconWithHover'
import Loader from './Loader'
import axios from 'axios'
import { filesUrl } from 'constants/urls'
import { useContextSelector } from 'use-context-selector'
import { useBrowserContext } from 'store/browser-context'
import { AddProductContext } from 'pages/add-product/store/add-product-context'


const UploadImageButton=({image, imageChangeHandler, size=32, url='/upload-variant-image', outputFormat='webp', resolution=1080, extraData={}, fixedWidth=true, type, rounded=true, fixHeight=true})=>{
    const [showModal, setShowModal] =useState(false)
    const modelRef = useRef()
    const productId = useContextSelector(AddProductContext, state=>state.productInfo.productId)
    const [loading, setLoading] = useState(false)
  
    const {setGlobalMessageA} = useBrowserContext()
    const [innerImage, setInnerImage] = useState(image)
  
    const imageInputRef = useRef()
    const changeHandler= async(event)=>{
      setLoading(true)
      setTimeout(()=>modelRef.current?.close(), 100)
      try{ 
          const files = event.target.files
          const file = (await reduceImageQuality(files, 0.7, resolution, outputFormat, fixHeight))[0];
          if (file) {
              const formData = new FormData();
              formData.append('image', file);
              formData.append('store_id', localStorage.getItem('storeId'));
              Object.entries(extraData).forEach(([key, value])=>{
                formData.append(key, value)
              })
              if (productId) formData.append('product_id', productId)
              const response = await axios({
                  method: 'POST',
                  url: filesUrl + url, // Replace with your actual upload URL
                  headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  data: formData
              })
              imageChangeHandler(response.data.url)
              setInnerImage(await fileToBase64(files[0]))
          }
          setLoading(false) 
      }
      catch(error){
        console.log(error)
        setLoading(false)
        setGlobalMessageA({
          color: 'red',
          children: translate('Image was not uploaded'),
          time: 2000
        })
      }
      if (imageInputRef.current) imageInputRef.current.value=''
    }
  
    const [deleting, setDeleting] = useState(false)
    const deleteImageFunction=async()=>{
      setDeleting(true)
      try{
        const response = await deleteImage(image, type) 
        if (response){
            imageChangeHandler(null)
            setInnerImage(null)
        } 
        modelRef.current?.close()
      }
      catch(error){
        console.log(error)
      }
        
      setDeleting(false)
    }
    return(
      <>
        <input type='file' onChange={changeHandler} 
        accept="image/jpeg, image/png, image/gif, image/bmp, image/webp, image/tiff"
          style={{display: 'none'}} ref={imageInputRef} />
        <button 
            style={{
                width: size || 38,
                height: size || 38,
                backgroundColor: innerImage ? 'transparent' : undefined,
                border: innerImage ? 'none' : undefined,
                borderRadius : rounded ? undefined : 0,
                borderRadius: 4,
                position: 'relative'
            }}
            className='container'
            onClick={()=> image ? setShowModal(true) : imageInputRef.current?.click()}
        >
            { !innerImage && !loading && <i className='fa-solid fa-cloud-arrow-up color-primary' style={{fontSize: size/2}} />}
            <div style={{position:'absolute', left: -1, top:0, height: size, minWidth: size}}>
            {innerImage && <img src={innerImage} id={innerImage} style={{objectFit: 'cover', height: size, width: fixedWidth ? size : undefined, borderRadius:rounded ? 4 : 0}} />}
              { loading && <div style={{backgroundColor: 'rgba(var(--containerColor-rgb), 0.5)', minWidth: '100%', height: '100%', zIndex: 1, position: 'absolute', top: 0}} className='d-f align-center justify-center'><Loader diam={24} /></div> }
             </div>
        </button>
        {showModal && <DialogComponent open={showModal} close={()=>setShowModal(false)} backDropPressCloses={true} ref={modelRef}>
          <div 
              style={{
                  backgroundColor: 'var(--containerColor)',
                  borderRadius: 8,
                  position: 'relative',
                  padding: 10,
              }}
              className='column'
          >
              {
                innerImage && (
                  <div disabled={deleting}>
                    <div className='d-f g-4 justify-center align-center'>
                      <div 
                        style={{
                          width: 200,
                          height: 200,
                          borderRadius: rounded ? 8 : 0,
                          backgroundImage: `url('${innerImage}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
          

                        }}
                      >
                        <button
                            onClick={()=>{
                                imageInputRef.current?.click()
                            }}
                            style={{
                              margin: 'auto',
                              position: 'absolute'
                            }}
                        >
                            <IconWithHover style={{backgroundColor: 'rgba(var(--containerColor-rgb), 0.6)', fontSize: 32, padding: 4, borderRadius: rounded ? 4 : 0}} iconClass='fa-solid fa-cloud-arrow-up color-primary' />
                        </button>
                        <IconWithHover style={{position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(var(--containerColor-rgb), 0.6)', padding: 4, borderRadius: rounded ? 4 : 0}} iconClass='fa-solid fa-trash color-red m-2' onClick={deleteImageFunction} />
                      </div>
                    </div>
                  </div>
                )
                  
              }
          </div>
        </DialogComponent>
    }
    </>
    )
  }

export default UploadImageButton