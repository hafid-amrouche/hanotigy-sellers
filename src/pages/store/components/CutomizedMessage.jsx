import axios from 'axios';
import RichText from 'components/RichText/RichText';
import { filesUrl } from 'constants/urls';
import React, { useRef } from 'react'
import { reduceImageQuality, translate } from 'utils/utils'


const CutomizedMessage=({message, setMessage})=>{
    const handleImageUploadBefore = async (files) => {
        const image = (await reduceImageQuality(files, 0.7, 640, 'webp', false))[0]
        const authToken = localStorage.getItem('token'); // Replace with your actual authentication token
        const formData = new FormData();
        formData.append('image', image);
        formData.append('store_id', localStorage.getItem('storeId'))
    
        await axios({
          method: 'POST',
          url: filesUrl + '/upload-store-image', // Replace with your actual upload URL
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
      const editorRef = useRef(null);
    return(
        <RichText
            onChange={(value)=>setMessage(value)} 
            defaultValue={message} 
            handleImageUploadBefore={handleImageUploadBefore}
            ref={editorRef}
        />
    )
}

export default CutomizedMessage