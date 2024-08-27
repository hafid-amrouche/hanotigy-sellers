import React, { useRef, useState } from 'react';
import SunEditor from 'libs/suneditor-react/src/index';
import plugins from 'libs/suneditor/src/plugins';
import { en } from 'libs/suneditor/src/lang';
import CodeMirror from 'codemirror';
import katex from 'katex';
import 'libs/suneditor/dist/css/suneditor.min.css';
import 'katex/dist/katex.min.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/lib/codemirror.css';
import axios from 'axios';
import { filesUrl } from 'constants/urls';
import { reduceImageQuality, translate } from 'utils/utils';
import { AddProductContext } from 'pages/add-product/store/add-product-context';
import { useContextSelector } from 'use-context-selector';

const options = {
  plugins: plugins,
  height: 250,
  codeMirror: {
    src: CodeMirror,
    options: {
      indentWithTabs: true,
      tabSize: 2
    }
  },
  katex: katex,
  lang: en,
  buttonList: [
    [
      'undo',
      'redo',
      'font',
      'fontSize',
      'formatBlock',
      'bold',
      'underline',
      'italic',
      'paragraphStyle',
      'blockquote',
      'strike',
      'fontColor',
      'hiliteColor',
      'textStyle',
      'removeFormat',
      'outdent',
      'indent',
      'align',
      'horizontalRule',
      'list',
      'lineHeight',
      'table',
      'link',
      'image',
      'video',
      'showBlocks',
      'codeView',
      'fullScreen'
    ]
  ]
};

const RichText = ({ name, onChange, ...props }) => {
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
  const editorRef = useRef(null);
  return (
    <div>
      <SunEditor
        ref={editorRef}
        placeholder={translate("Please type here...")}
        name={name}
        lang="en"
        setDefaultStyle="font-family: Arial; font-size: 14px;"
        setOptions={options}
        onImageUploadBefore={handleImageUploadBefore}
        // onImageUpload={handleImageUpload}
        onChange={onChange}
        autoFocus={false}
        {...props}
      />
    </div>
  );
};

export default RichText;
