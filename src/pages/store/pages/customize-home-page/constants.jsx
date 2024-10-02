import { translate } from "utils/utils"

export const defaultGeneralDesign={
  id: 'general-design',
  type: 'general-design',
  mobile: {
    backgroundColor: {
      light: "#f6f6f6",
      dark: "#121212"
    }
  },
  PC: {
    backgroundColor: {
      light: "#f6f6f6",
      dark: "#121212"
    }
  },
}

export const defaultDesignMobile={
    marginTop: 12,
    marginHorizontal: 4,
    title: {
      showTitle: true,
      size: 26,
      direction: 'center',
      bordersRounded: null,
      padding: 0,
      label:{
        color: {
          light : null,
          dark: null
        },
      },  
    },
    products: {
      productsDisplay: 'simple',
      justifyContent: 'center',
      gap: 8,
      bordersRounded: null,
      borderWidth: 1,
      backgroundColor: {
        light: "#f6f6f6",
      dark: "#121212"
      },
      borderColor: {
        light: '#80808060',
        dark: '#50505080',
      },
      product: {
        width: '50%',
        image: {
          aspectRatio: '1/1',
          objectFit: 'cover'
        },
        title: {
          size: 18,
          color: {
            light: null,
            dark: null
          }
        },
        price: {
          size: 18,
          color: {
            light: null,
            dark: null
          }
        }
      }
    } 
}
  
export const defaultDesignPC={
    marginTop: 0,
    marginHorizontal: 8,
    title: {
      showTitle: true,
      size: 23,
      direction: 'start',
      padding: 8,
      label:{
        color: {
          light : null,
          dark: null
        },
      },
    },
    products: {
      productsDisplay: 'swiper-1',
      justifyContent: 'start',
      gap: 8,
      borderWidth: 1,
      backgroundColor: {
        light: "#f6f6f6",
        dark: "#121212"
      },
      borderColor: {
        light: '#80808060',
        dark: '#50505080',
      },
      product: {
        width: '180px',
        image: {
          aspectRatio: '1/1',
          objectFit: 'cover'
        },
        title: {
          size: 23,
        },
        price: {
          size: 18,
        }
      }
    } 
}

export const justifyContentOptions = [
    {
      id: 1,
      label: translate('Start'),
      value: 'start',
    },
    {
      id: 2,
      label: translate('Center'),
      value: 'center',
    },
    {
      id: 3,
      label: translate('Space'),
      value: 'space-evenly',
    },
]

export const aspectRatioList = [
  {
    id: 1,
    value: '2/1'
  },
  {
    id: 2,
    value: '16/9'
  },
  {
    id: 3,
    value: '4/3'
  },
  {
    id: 4,
    value: '1/1'
  },
  {
    id: 5,
    value: '3/4'
  },
  {
    id: 6,
    value: '9/16'
  },
  {
    id: 7,
    value: '1/2'
  },
]

export const objectFitOptions = [
  {
    id: 1,
    value: 'cover',
    label: translate('Cover')
  }, 
  {
    id: 2,
    value: 'contain',
    label: translate('Contain')
  },
]


export const bordersTypeList = [
  {
    id: 1,
    value: true,
    label: ('Rounded')
  },
  {
    id: 2,
    value: false,
    label: ('Sharp')
  }
]

export const lengthUnitoptions = [
  {
    id: 1,
    value: 'px',
    label: 'Px'
  },
  {
    id: 2,
    value: '%',
    label: '%'
  }
]

export const productsDisplayOptions = [
  {
    id: 1,
    value: 'simple',
    label: translate('Simple')
  },
  {
    id: 2,
    value: 'swiper-1',
    label: translate('Simple swiper')
  },
  {
    id: 3,
    value: 'swiper-6',
    label: translate('Creative swiper'),
  },
  {
    id: 4,
    value: 'swiper-2',
    label: translate('Coverflow swiper')
  },
  {
    id: 5,
    value: 'swiper-3',
    label: translate('Cards swiper')
  },
  {
    id: 6,
    value: 'swiper-4',
    label: translate('Cube swiper')
  },
  {
    id: 7,
    value: 'swiper-5',
    label: translate('Flip swiper')
  },
  
]


export const swiperDefaultDesign = {
  mobile: {
      backgroundColor: {
        light: '#00000000',
        dark: '#00000000',
      },
      marginTop: 0,
      marginHorizontal: 8,
      gap: 4,
      swiperType: 'swiper-1',
      justifyContent: 'center',
      image: {
        border: {
          radius: '4px',
          color:  {
            light: '#80808060',
            dark: '#50505080',
          },
          width: 1,
        },
        width: '180px',
        aspectRatio: '1/1',
        objectFit: 'cover'
      },
  },
  PC: {
    backgroundColor: {
      light: '#00000000',
      dark: '#00000000',
    },
    marginTop: 0,
    marginHorizontal: 8,
    gap: 8,
    swiperType: 'swiper-1',
    justifyContent: 'start',
    image: {
      border: {
        radius: '8px',
        color:  {
          light: '#80808060',
          dark: '#50505080',
        },
        width: 1,
      },
      aspectRatio: '2/1',
      objectFit: 'cover',
      width: '240px',
    },
}

}