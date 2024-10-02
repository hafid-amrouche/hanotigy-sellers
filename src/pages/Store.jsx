import Button from 'components/Button'
import React from 'react'
import { translate } from 'utils/utils'
import { Link, Outlet, useLocation } from 'react-router-dom'

const options=[
    {
        label: translate('Home'),
        link: '/store/customize-home-page'
    },
    {
        label: translate('Category'),
        link: '/store/customize-category-page'
    },
    {
        label: translate('Product'),
        link: '/store/customize-product-page'
    },
    {
        label: translate('Thank you page'),
        link: '/store/thank-you-page'
    },
    {
        label: translate('Privacy policy'),
        link: '/store/privacy-policy'
    },
    {
        label:  translate('Terms of service'),
        link: '/store/terms-of-service'
    },
]

const Store=()=>{
    const location = useLocation()
    let link = location.pathname
    if (link[link.length - 1] === '/') link=link.slice(0, link.length - 1)
    const option = options.find(op=>op.link === link)
    return (
        <div className='container m-2 column p-2 g-4 flex-1 p-relative'>
            <div className='d-f g-2' style={{overflowX: 'auto'}}>
                    {options.map(op=>(
                        <Link key={op.label} to={op.link} style={{flexShrink: 0, marginBottom: 8}}>
                            <Button style={{borderRadius: 20}} outline={op.label === option.label} >{translate(op.label)}</Button>
                        </Link>
                            
                    ))}
            </div>
            <Outlet />
        </div>
    )
}
export default Store