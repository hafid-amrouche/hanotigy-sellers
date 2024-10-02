import React, { forwardRef, useRef, useState } from 'react';
import SunEditor from 'libs/suneditor-react/src/index';
import plugins from 'libs/suneditor/src/plugins';
import { en } from 'libs/suneditor/src/lang';
import CodeMirror from 'codemirror';
import katex from 'katex';
import 'libs/suneditor/dist/css/suneditor.min.css';
import 'katex/dist/katex.min.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/lib/codemirror.css';
import { translate } from 'utils/utils';

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

const RichText = forwardRef(({ name, onChange, handleImageUploadBefore, editorRef, className, ...props }, ref) => {
 
  return (
    <div
      className={className}
    >
      <SunEditor
        ref={ref}
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
});

export default RichText;
