import { useCustomizeHomePageContext } from 'pages/store/pages/customize-home-page/store/CustomizeHomePageContext'
import React from 'react'
import { translate } from 'utils/utils'


const MiniCard=({product, sectionDesign})=>{
    const {visionMode, isMobile} = useCustomizeHomePageContext()
    const productsDesign =  sectionDesign.products
    
    const {
        gap,
        bordersRounded,
        borderColor: borderColorObject,
        backgroundColor: backgroundColorObject,
        borderWidth,
        product: {
            width,
            image: {
                aspectRatio,
                objectFit
            },
            title: {
                size : productTitleSize,
                color: titleColorObject
            },
            price: {
                size : productPriceSize,
                color: priceColorObject
            }
        }
    } = productsDesign

    const backgroundColor = backgroundColorObject[visionMode]
    const borderColor = borderColorObject[visionMode]
    const titleColor = titleColorObject[visionMode]
    const priceColor = priceColorObject[visionMode]

    const borderRadius = isMobile ? 4 : 8
    return(
        <div style={{padding: gap/2, width}}>
            <div  
                style={{ 
                    overflow: 'hidden', 
                    borderRadius: bordersRounded ? borderRadius : undefined, 
                    boxShadow: '0 5px 20px var(--textFadingColor)',
                    border: `${borderWidth}px solid ${borderColor}`,
                }}>
                    <div
                        style={{
                            backgroundColor: backgroundColor,
                        }}
                    >
                        <div 
                            style={{
                                width: '100%', 
                                aspectRatio: aspectRatio, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent:'center',
                                backgroundImage: `url(${product.image})`,
                                backgroundSize: objectFit,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                            }} 
                        />
                        <div className='px-2'>
                            <strong className='cut-text' style={{fontSize: productTitleSize, color: titleColor}}>{ product.title }</strong>
                            {  product.price ? 
                                <h4 style={{color: priceColor, fontSize: productPriceSize}}>{ product.price } {translate('DA')} </h4> :
                                <h4 style={{color: 'red', fontSize: productPriceSize}} >{ product.price } {translate('No price')} </h4> 
                            }
                        </div>
                    </div>  
                        
            </div>
        </div>
            
)}

const SimpleSwiper = ({section}) => {
    const {selectedDevice} = useCustomizeHomePageContext()
    const sectionDesign = section.design[selectedDevice]
    const productsDesign = sectionDesign.products
    const {
        gap,
        bordersRounded,
        borderColor: borderColorObject,
        backgroundColor: backgroundColorObject,
        borderWidth,
        justifyContent,
        product: {
            width,
            image: {
                aspectRatio,
                objectFit
            },
            title: {
                size : productTitleSize,
                color: titleColorObject
            },
            price: {
                size : productPriceSize,
                color: priceColorObject
            }
        }
    } = productsDesign

  return (
    <div className='d-f flex-wrap' style={{
        justifyContent: justifyContent
    }}>
        {
            section.products.map(product=><MiniCard key={product.product_id} product={product} sectionDesign={sectionDesign} />)
        }
    </div>
  )
}

export default SimpleSwiper