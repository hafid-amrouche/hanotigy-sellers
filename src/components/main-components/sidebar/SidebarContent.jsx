import React from 'react'
import classes from './SidebarContent.module.css'
import SidebarComponent from './SidebarComponent'
import { translate } from '../../../utils/utils'
import { useUserContext } from '../../../store/user-context'

const sidebarElemnts =[
  {
      label: translate("Dashboard"),
      iconClass: "fa-solid fa-house",
      link: 'dashboard',
  },
  {
      label: translate("Orders"),
      iconClass: "fa-solid fa-box",
      link: 'orders',
      childrenData:[
          {
              label: translate("Orders"),
              iconClass: "fa-solid fa-box",
              link: 'orders',
          },
          {
              label: translate("Obandoned orders"),
              iconClass: "fa-solid fa-box",
              link: 'orders/abandoned-orders',
          },
      ]
  },
  {
      label: translate("Products"),
      iconClass: "fa-solid fa-tags",
      link: 'products',
      childrenData:[
        {
            label: translate("Add product"),
            iconClass: "fa-solid fa-square-plus",
            link: 'products/add',
        },
        {
            label: translate("Your product"),
            iconClass: "fa-solid fa-tags",
            link: 'products',
        },
    ]
  },
  {
      label: translate("Store"),
      iconClass: "fa-solid fa-store",
      link: 'store',
      childrenData:[
        {
            label: translate("General design"),
            iconClass: "fa-solid fa-palette",
            link: 'store/design',
        },
        {
            label: translate("Categories"),
            iconClass: "fa-solid fa-list",
            link: 'store/categories',
        },
        {
          label: translate("Customize pages"),
          iconClass: "fa-solid fa-edit",
          link: 'store/customize-home-page',
      },
    ]
  },
  {
    label: translate("Apps"),
    iconClass: "fa-solid fa-puzzle-piece",
    link: 'apps',
  },
  {
      label: translate("Statistics"),
      iconClass: "fa-solid fa-chart-line",
      link: 'stats',
  },
  {
      label: translate("Credit scoore"),
      iconClass: "fa-solid fa-credit-card",
      link: 'credit-scoore',
  },
]

const sidebarBottomElemnts =[
  {
      label: translate("Settings"),
      iconClass: "fa-solid fa-gear",
      link: 'settings',
  },
  {
      label: translate("Support"),
      iconClass: "fa-solid fa-headset",
      link: 'support',
  },
  
]

const SidebarContent = ({setOpen}) => {
  const {userData} = useUserContext()
  return (
    <div className={classes.sidebar} >
      <div className={classes['title-container']}>
      <i className={ classes['title__icon'] + " fa-solid fa-arrow-left"} onClick={setOpen.bind(this, false)}></i>
        <i className="fa-solid fa-user" style={{fontSize: 22}}></i>
        <h3>{userData.full_name}</h3>
      </div>
      <hr/>
      <div>
        {
          sidebarElemnts.map(elem=><SidebarComponent {...elem} key={elem['link']} onClick={setOpen.bind(this, false)} />)
        }
      </div>
      <div className={classes['bottom-elements-container']}>
        {
          sidebarBottomElemnts.map(elem=><SidebarComponent {...elem} key={elem['link']} onClick={setOpen.bind(this, false)}  />)
        }
      </div>
    </div>
  )
}

export default SidebarContent