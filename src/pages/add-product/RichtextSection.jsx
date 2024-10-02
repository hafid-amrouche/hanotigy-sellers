import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import RichText from '../../components/RichText/RichText';
import { addLazyLoadingToImages, cleanHtml, reduceImageQuality, translate } from 'utils/utils';
import useScrollToTop from 'hooks/useScrollToTop';
import { useContextSelector } from 'use-context-selector';
import { AddProductContext } from './store/add-product-context';
import Accordiant from 'components/Accordiant';
import axios from 'axios';
import { filesUrl } from 'constants/urls';


const RichTextSection=forwardRef((props, ref)=>{
    const defaultRichText = useContextSelector(AddProductContext, state=>state.productInfo.richText)
    const [richText, setRichText] = useState(defaultRichText)
    const [show, setShow] = useState(true)
    useScrollToTop(show, '#rich-text-section', 70)
    useImperativeHandle(ref, ()=>{
      const cleanRichText = cleanHtml(richText)
      return({
        richTextData: show && cleanRichText? {richText: addLazyLoadingToImages(cleanRichText)}: {}
      })
    })

    const productId = useContextSelector(AddProductContext, state=>state.productInfo.productId)
    const handleImageUploadBefore = async (files) => {
      const image = (await reduceImageQuality(files, 0.7, 1080, 'webp', false))[0]
      const authToken = localStorage.getItem('token'); // Replace with your actual authentication token
      const formData = new FormData();
      formData.append('image', image);
      formData.append('product_id', productId)
      formData.append('store_id', localStorage.getItem('storeId'))
  
      await axios({
        method: 'POST',
        url: filesUrl + '/upload-rich-text-image', // Replace with your actual upload URL
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        data: formData
      })
        .then((response) => {
          document.querySelector(`img[src^='data']`).setAttribute('src', response.data.url)
          editorRef.current.appendContents('');
        })
        .catch((error) => {
          document.querySelectorAll(`img[src^='data']`).forEach(elem=>elem.parentElement.parentElement.remove())
          alert(translate('Image was not uploaded'))
        });
    };
    const editorRef = useRef()
    return(
        <div  id='rich-text-section'>
            <div className={'p-2 m-3 container d-f align-center g-3 cursor-pointer'} onClick={()=>setShow(!show)}>
                <Accordiant checked={show} setChecked={()=>{}} />
                <h3 className='color-primary'>{translate('Description')}</h3>
            </div>
            {show && <div className='m-3'>
                <RichText 
                    onChange={(value)=>setRichText(value)} 
                    defaultValue={richText} 
                    handleImageUploadBefore={handleImageUploadBefore}
                    ref={editorRef}
                />
            </div>}
        </div>
            
    )
})

export default RichTextSection