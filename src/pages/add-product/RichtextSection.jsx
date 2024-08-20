import React, { forwardRef, useImperativeHandle, useState } from 'react'
import RichText from '../../components/RichText/RichText';
import { translate } from 'utils/utils';
import useScrollToTop from 'hooks/useScrollToTop';
import { useContextSelector } from 'use-context-selector';
import { AddProductContext } from './store/add-product-context';
import Accordiant from 'components/Accordiant';


const RichTextSection=forwardRef((props, ref)=>{
    const defaultRichText = useContextSelector(AddProductContext, state=>state.productInfo.richText)
    const [richText, setRichText] = useState(defaultRichText)
    const [show, setShow] = useState(!!defaultRichText)
    useScrollToTop(show, '#rich-text-section', 70)
    useImperativeHandle(ref, ()=>({
        richTextData: show && (richText !== '<p><br></p>' )? {richText}: {}
    }))

    return(
        <div  id='rich-text-section'>
            <div className={'p-2 m-3 container d-f align-center g-3'}>
                <Accordiant checked={show} setChecked={setShow} />
                <h3 className='color-primary'>{translate('Description')}</h3>
            </div>
            {show && <div className='m-3'>
                <RichText 
                    onChange={(value)=>setRichText(value)} 
                    defaultValue={defaultRichText} 
                />
            </div>}
        </div>
            
    )
})

export default RichTextSection