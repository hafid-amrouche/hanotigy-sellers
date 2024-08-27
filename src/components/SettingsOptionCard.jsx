import Img from 'components/Img'
import React from 'react'
import { Link } from 'react-router-dom'

const SettingsOptionCard=({img, title, description, link})=>{
    return(
        <Link to={link} className='d-f g-3 container p-2 scale-on-hover' style={{maxWidth: 380}}>
            <Img src={img} width={64} height={64} className='flex-shrink-0' style={{objecFit: 'cover'}} />
            <div>
                <h3 className='color-primary lh-1'>{ title }</h3>
                <p className='color-grey lh-1 mt-1' style={{fontSize: '0.9rem'}}>{ description }</p>
            </div>
        </Link>
    )
}
export default SettingsOptionCard