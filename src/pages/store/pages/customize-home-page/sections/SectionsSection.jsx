import { Reorder } from 'framer-motion'
import React, { useEffect, useMemo, useState } from 'react'
import { ReorderItemWithDrag } from 'components/ReorderItemWithDrag'
import IconWithHover from 'components/IconWithHover'
import { translate } from 'utils/utils'
import { useCustomizeHomePageContext } from '../store/CustomizeHomePageContext'
import Img from 'components/Img'
import Button from 'components/Button'
import MotionItem from 'components/Motionitem'
import DialogComponent from 'components/tags/Dialog'
import { createPortal } from 'react-dom'
import axios from 'axios'
import { apiUrl, filesUrl } from 'constants/urls'
import { useUserContext } from 'store/user-context'
import Accordiant from 'components/Accordiant'
import swipeImage from '../../../../../assets/icons/store/home-customization/swipe.png'
import imageImage from '../../../../../assets/icons/store/home-customization/image.png'
import textImage from '../../../../../assets/icons/store/home-customization/text.png'
import categoryImage from '../../../../../assets/icons/store/home-customization/layers.png'
import { swiperDefaultDesign } from '../constants'
import UploadImageButton from 'components/UploadImageButton'

const AddProductsDialog=({show, setShow, section,  nonSelectedProducts, setNonSelectedProducts})=>{

  const {setSections} = useCustomizeHomePageContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [page, setPage] = useState(1)
  const [numPages, setNumPages]= useState([])
  const [hasPrev, setHasPrev]=useState(false)
  const [hasNext, setHasNext]=useState(false)


  const {userData} = useUserContext()

  const addProductToSection=(product)=>{
    setSections(sections=>{
      const newSections = [...sections]
      const currentSection = newSections.find(sec=>sec.id === section.id)
      currentSection.products= [...currentSection.products, product]
      setNonSelectedProducts(nonSelectedProducts=>nonSelectedProducts.filter(elem=>elem.product_id !== product.product_id))
      return newSections
    })
  }

  useEffect(()=>{
    if (nonSelectedProducts?.length === 0){
      if (numPages === 1) return
      else if(page === numPages) setPage(page - 1)
      else setPage(page + 1)
    }
  }, [nonSelectedProducts])

  const isTopPicks = section.id === 'top-picks'
  const getNonSelctedProducts=async()=>{
    setLoading(true)
    setError(false)
    try{
      const response = await axios.post(
        apiUrl + ( isTopPicks ? '/store/non-selected-top-pick-products' : '/store/non-selected-category-products'),
        {
          excluded_products : [...section.products, ...(nonSelectedProducts || [])].map(product=>product.product_id),
          domain: userData.domain,
          category_id: isTopPicks ? undefined : section.id,
          page
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          }
        }
      )
      setNonSelectedProducts(response.data.products)
      setNumPages(response.data.numPages)
      setHasNext(response.data.hasNext)
      setHasPrev(response.data.hasPrev)
    }catch(error){
      console.log(error)
      setError(true)
    }
    setLoading(false)
  }

  useEffect(()=>{
    if(!nonSelectedProducts && show)  getNonSelctedProducts()
  }, [show])

  useEffect(()=>{
    if(show) getNonSelctedProducts()
  }, [page])
  return(
    <DialogComponent open={show} close={()=>setShow(false)}> 
      <div className='container column' style={{width: '80vw', height: '80vh'}}>
        <div className='p-2 flex-1' style={{overflowY: 'auto'}}>
          <h3>{ section.id === 'top-picks' ? translate('All products') : translate('{category} products', {'category': section.title}) }</h3>
          <hr className='my-2'/>
          <div className='d-f g-2 flex-wrap' style={{justifyContent: 'center'}}>
            {nonSelectedProducts && nonSelectedProducts.map(product=>(
              <div key={product.product_id} onClick={()=>addProductToSection(product)} className='container column scale-on-hover' style={{width: 122}}>
                <Img
                  src={product.image}
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: 'cover'
                  }}
                />
                <h4 className='px-1 cut-text'>{ product.title }</h4>
              </div>
            ))}
          </div>
        </div>
        { (hasNext || hasPrev) && 
          <div disabled={loading} className='p-2 d-f g-3 justify-center' style={{alignItems: 'start'}}>
              <Button disabled={!hasPrev} onClick={()=>{setPage(page-1)}}><i style={{fontSize: 22}} className='fa-solid fa-chevron-left py-1'/></Button>
              <div className='d-f g-2 f-wrap justify-center'>
                  {Array.from({ length: numPages }, (_, i) => i).map(i=>(
                      <Button key={i} outline={page === i+1} onClick={()=>{setPage(i + 1)}}>
                          {i+1}
                      </Button>
                  ))}
              </div>
              <Button disabled={!hasNext}  onClick={()=>{setPage(page+1)}}><i style={{fontSize: 22}} className='fa-solid fa-chevron-right py-1'/></Button>
          </div>
      }
      </div>
    </DialogComponent>
  )
}

const CategorySubSection = ({section})=>{
  const {setSections, selectedSectionId} = useCustomizeHomePageContext()
  const [show, setShow]=useState(false)
  const products = section.products
  const [nonSelectedProducts, setNonSelectedProducts] = useState(null)

  const updateSectionProducts=(newProducts)=>{
    setSections(sections=>{
      const newSections = [...sections]
      const currentSection = newSections.find(sec=>sec.id == section.id)
      currentSection.products = newProducts
      return newSections
    })
  }
  const deleteProduct=(product)=>{
    setSections(sections=>{
      const newSections = [...sections]
      const currentSection = newSections.find(sec=>sec.id == section.id)
      currentSection.products = currentSection.products.filter(elem=> elem.product_id !== product.product_id)
      setNonSelectedProducts( nonSelectedProducts => [product, ...(nonSelectedProducts || [])])
      return newSections
    })
  }

  return (
    <div >
      <Reorder.Group axis="y" onReorder={updateSectionProducts} values={products} className='g-2 column p-1'>
        {products.map(product=>
          <ReorderItemWithDrag 
            item={product} 
            key={product.product_id} 
            className={'container'}
          >
            <div className='d-f g-3 align-items-center flex-1 p-1' style={{maxWidth: '100%'}}> 
              <Img 
                src={product.image} 
                style={{
                  width: 32,
                  height: 32,
                  objectFit: 'cover'
                }}
                className='border'
              />
              <div className='flex-1 p-relative' style={{alignSelf: 'stretch'}}>
                <h4 className='cut-text' style={{width: '100%', position: 'absolute', top: 0}}>{ product.title }</h4>
              </div>
              <IconWithHover  className={`fa-solid fa-trash color-red`} onClick={deleteProduct.bind(this, product)} />
            </div>
        </ReorderItemWithDrag>                
        )}
      </Reorder.Group>
      <MotionItem className='p-1'>
        <Button outline className='col-12 g-3 d-f' style={{padding: 2}} onClick={()=>setShow(true)}>
          <i className='fa-solid fa-square-plus' style={{fontSize: 24}} />
          { translate('Add product') }
        </Button>
      </MotionItem>
      {
        createPortal(  
          <AddProductsDialog {...{show, setShow, section, nonSelectedProducts, setNonSelectedProducts}} />
          , document.getElementById('home-page')
        )
      }
      
    </div>
  )
}

const SwiperImageRow=({removeImage, updateImage, imageObj, index})=>{
  return(
    <div className='d-f g-3 align-items-center flex-1 p-1' style={{maxWidth: '100%'}}> 
      <UploadImageButton 
        {...{
          image: imageObj.url, 
          imageChangeHandler: (newImage)=>updateImage(index, {...imageObj, url: newImage}), 
          size: 40, 
          url: '/upload-swiper-image', 
          outputFormat: null, 
          resolution: 2024,  
          type: 'store/home-page/swiper-image', 
        }}
      />

      <input defaultValue={imageObj.link} placeholder={translate('Link for the image')} onBlur={e=>updateImage(index, {link: e.target.value.trim()})} className='box-input flex-1' style={{padding: '4px'}}  />
      <IconWithHover className={`fa-solid fa-trash color-red`} onClick={removeImage} />
    </div>
)
}

const SwiperSubSection = ({section})=>{
  const {setSections, selectedSectionId, selectedDevice} = useCustomizeHomePageContext()
  const [show, setShow]=useState(false)
  const imageObjects = section.imageObjects[selectedDevice]
  const addImage = (imageObj)=>{
    setSections(sections=>{
      const newSections = [...sections]
      const currentSection = newSections.find(sec=>sec.id === selectedSectionId)
      currentSection.imageObjects[selectedDevice] = [...currentSection.imageObjects[selectedDevice], imageObj]
      return newSections
    })
  }
  const removeImage = (index)=>{
    setSections(sections=>{
      const newSections = [...sections]
      const currentSection = newSections.find(sec=>sec.id === selectedSectionId)
      currentSection.imageObjects[selectedDevice].splice(index, 1)
      return newSections
    })
  }
  const updateImage = (index, update)=>{
    setSections(sections=>{
      const newSections = [...sections]
      const currentSection = newSections.find(sec=>sec.id === selectedSectionId)
      currentSection.imageObjects[selectedDevice][index] = {
        ...currentSection.imageObjects[selectedDevice][index],
        ...update
      }
      return newSections
    })
  }
  const reorderImageObjects=(newImageObjects)=>{
    setSections(sections=>{
      const newSections = [...sections]
      const currentSection = newSections.find(sec=>sec.id === selectedSectionId)
      currentSection.imageObjects[selectedDevice] = newImageObjects
      return newSections
    })
  }
  const disabled = useMemo(()=>(imageObjects.map(image=>image.url).includes('')), [imageObjects])
  return (
    <div >
      { imageObjects.length > 0 && <Reorder.Group axis="y" onReorder={reorderImageObjects} values={imageObjects} className='g-2 column p-1'>
        {imageObjects.map((imageObj, index)=>
          <ReorderItemWithDrag 
            item={imageObj} 
            key={imageObj.url} 
            className={'container'}
          >
            <SwiperImageRow {...{removeImage: removeImage.bind(this, index), updateImage, imageObj, index}}  />
        </ReorderItemWithDrag>
         
        )}
      </Reorder.Group>}
      <MotionItem className='p-1' disabled={disabled}>
        <Button outline className='col-12 g-3 d-f' style={{padding: 2}} onClick={()=>addImage({
          url: '',
          link: ''
        })}>
          <i className='fa-solid fa-square-plus' style={{fontSize: 24}} />
          { translate('Add Image') }
        </Button>
      </MotionItem>
      {/* 
      {
        createPortal(  
          <AddProductsDialog {...{show, setShow, section, nonSelectedProducts, setNonSelectedProducts}} />
          , document.getElementById('home-page')
        )
      } */}
      
    </div>
  )
}

const SectionTop = ({section})=>{
  const {setselectedSectionId, selectedSectionId, setSections} = useCustomizeHomePageContext()
  const deleteSection=()=>{
    setSections(sections=>{
      const newSections = [...sections]
      const currentSection = newSections.find(sec=>sec.id === section.id)
      if (section.type === 'products-container'){
        currentSection.active = false
        return newSections
      } else{
        return newSections.filter(sec=>sec.id !== section.id)
      }      
    })
  }
  
  const image = (
    section.type === 'products-container' ? categoryImage : 
    section.type === 'swiper' ? swipeImage :
    section.type === 'rich-text' ? textImage:
    section.type === 'image-with-link' ? imageImage : 
    ''
  )
  return(
      <div className='d-f align-items-center flex-1'>
        <div className='cursor-pointer d-f g-2 align-items-center flex-1' onClick={()=>setselectedSectionId(section.id === selectedSectionId ? 'general-design' : section.id)}>
          <Img 
            src={image}
            width={30}
          />
          <h3 className='flex-1 py-2 color-primary' >{ section.title }
          </h3>
        </div>
        <IconWithHover onClick={deleteSection} className={`px-1 fa-solid ${ section.type === 'products-container' ? 'fa-xmark' : 'fa-trash color-red' }`} />
      </div>
  )
}

const Section =({section})=>{
  const {selectedSectionId, setselectedSectionId }= useCustomizeHomePageContext()
  const [showExtention, setShowExtention] = useState(false)
  useEffect(()=>{
    if (selectedSectionId !== section.id) setShowExtention(false)
  }, [selectedSectionId])

  useEffect(()=>{
    if (showExtention) setselectedSectionId(section.id)
  }, [showExtention])

  const  isProductContainer = section.type === 'products-container'
  const isSwiper = section.type === 'swiper' 
  return(
    <div className='mb-2 '>
      <ReorderItemWithDrag 
          item={section} 
          key={section.id} 
          className={'container primary-light-on-hover'}
          style={{
              backgroundColor: selectedSectionId === section.id ? 'var(--background200Color)' : undefined,
          }}
        >
          <Accordiant setChecked={setShowExtention} checked={showExtention} />
          <SectionTop section={section} />
      </ReorderItemWithDrag> 
      {
        showExtention && (
          <div style={{backgroundColor: 'var(--background200Color)'}} className='border rounded mt-1'>
            { isProductContainer && <CategorySubSection section={section} />}
            { isSwiper && <SwiperSubSection section={section} /> }
          </div>
        )
      }
    </div>
        
  )
}

const AddCategory=({toggleCategory, setSelectedSectionType})=>{
  const {sections} = useCustomizeHomePageContext()
  const nonSelectedCategories = sections.filter(sec=>!sec.active)
  return(
    <div>
      <div className='d-f align-items-center'>
        <IconWithHover iconClass='fa-solid fa-chevron-left px-2' size={24} onClick={()=>setSelectedSectionType(null)} />
        <h3>{ translate('Add category') }</h3>
      </div>
      <hr className='my-2'/>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8}}>
        {
          nonSelectedCategories.map(category=>(
            <div key={category.id} onClick={()=>toggleCategory(category)} className='container column scale-on-hover' style={{width: 122}}>
              <Img
                src={category.image}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: 'cover'
                }}
              />
              <h4 className='px-1 cut-text'>{ category.title }</h4>
            </div>
          ))
        }
        {
          nonSelectedCategories.length === 0 && <h2>{ translate('No categories here') }</h2>
        }
      </div>
    </div>
  )
}

const defaultSectionTypes = [
  {
    id: 1,
    label: translate('Category'),
    value: 'products-container',
    image: categoryImage
  },
  {
    id: 2,
    label: translate('Swiper'),
    value: 'swiper',
    image: swipeImage

  },
  {
    id: 3,
    label: translate('Rich text'),
    value: 'rich-text',
    image: textImage
  },
  {
    id: 4,
    label: translate('Image with link'),
    value: 'image-with-link',
    image: imageImage
  },

]

const AddSectionDialog=({show, setShow})=>{

  const {setSections, sections} = useCustomizeHomePageContext()

  const [selectedSectionType, setSelectedSectionType] = useState(null)

  useEffect(()=>{
    if (!show) setSelectedSectionType(null)
  }, [show])

  const SectionsTab=({setSelectedSectionType})=>{
    return(
      <div>
          <div className='d-f align-items-center'>
            <h3>{ translate('Sections') }</h3>
          </div>
          <hr className='my-2'/>
          <div className='d-f g-3 flex-wrap' style={{justifyContent: 'center'}}>
          {
              defaultSectionTypes.map(type=><div key={type.id} className='container p-2 scale-on-hover' onClick={()=>setSelectedSectionType(type.value)} >
                <Img 
                  src={type.image}
                  width={100}
                  height={100}
                  style={{borderRadius: 8}}
                />
                <h4>{ type.label }</h4>
              </div>)
            }
          </div>
        </div>
    )
  }

  const toggleCategory=(section)=>{
    setSections(sections=>{
      const newSections = [...sections]
      const currentSection = newSections.find(sec=>sec.id === section.id)
      currentSection.active = true
      return newSections
    })
  }    

  const addSection=(section)=>{
    setSections(sections=>[...sections, section])
  }

  useEffect(()=>{
    if (selectedSectionType === 'swiper'){
      let lastSwiper = sections.filter(section=>section.type === 'swiper')
      if (lastSwiper.length > 0) lastSwiper = lastSwiper[lastSwiper.length - 1]
      else lastSwiper = null
      let id = 1
      if (lastSwiper) id = Number(lastSwiper.id.split('-')[1]) + 1

      addSection({
        id: "swiper-" + id,
        title: translate('Swiper {id}', {id: id}),
        imageObjects: {
          'mobile': [],
          'PC': [] 
        },
        design: {...swiperDefaultDesign},
        type: "swiper",
        active: true,
      })
      setSelectedSectionType(null)
      setShow(false)
    }
  }, [selectedSectionType])

  return(
    <DialogComponent open={show} close={()=>setShow(false)}> 
      <div className='container column' >
        <div className='p-2' style={{overflowY: 'auto', width: '80vw', height: '80vh'}}>  
          { !selectedSectionType && <SectionsTab setSelectedSectionType={setSelectedSectionType} /> }
          { selectedSectionType === 'products-container' && <AddCategory setSelectedSectionType={setSelectedSectionType} toggleCategory={toggleCategory} />}
        </div>
      </div>
    </DialogComponent>
  )
}

const AddSection=()=>{
  const [show, setShow] = useState(false)
  const [nonSelectedCategories, setnNonSelectedCategories] = useState(null)
  return(
    <>
      <Button 
        className='col-12 g-3'
        onClick={()=>setShow(true)}
      >
        <i className='fa-solid fa-square-plus' style={{fontSize: 24}} />
        { translate('Add section') }
      </Button>
      { document.getElementById('home-page') &&
        createPortal(  
          <AddSectionDialog {...{show, setShow, nonSelectedCategories, setnNonSelectedCategories}} />
          , document.getElementById('home-page')
        )
      }
    </>
  )
}

const SectionsSection = () => {
  const {setselectedSectionId, setSections, sections, selectedSectionId }= useCustomizeHomePageContext()
  return (
    <div style={{minWidth: 320, position: 'sticky', top: 64, overflowY: 'auto'}} className='flex-1 no-select'>
        <div 
          className='container p-2 primary-light-on-hover cursor-pointer' 
          onClick={()=>setselectedSectionId('general-design')}
          style={{
              backgroundColor: (selectedSectionId === 'general-design') ? 'var(--background200Color)' : undefined
          }}
        >
          <h3>{ translate('General settings') }</h3>
        </div>
        <hr className='my-2'/>
        <div>
          <Reorder.Group axis="y" onReorder={setSections} values={sections}>
            {sections.filter(sec=>sec.active).map(section=><Section key={section.id} section={section} />)} 
          </Reorder.Group>
        </div>
        <AddSection />
    </div>
  )
}

export default SectionsSection