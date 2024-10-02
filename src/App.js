import React, { useMemo } from 'react'
import { createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Container from './components/main-components/Container'
import BrowserContextProvider from './store/browser-context';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserContextProvider, useUserContext } from './store/user-context';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Redirect from 'pages/Redirect';
import Shipping from 'pages/settings/Shipping';
import Products from 'pages/Products';
import GoogleSheets from 'pages/apps/GoogleSheets';
import Settings from 'pages/Settings';
import Store from 'pages/Store';
import Apps from 'pages/Apps';
import FacebookPixel from 'pages/apps/FacebookPixel';
import TiktokPixels from 'pages/apps/TiktokPixels';
import Design from 'pages/store/pages/Design';
import Categories from 'pages/store/pages/Categories';
import ThankYoupage from 'pages/store/pages/ThankYoupage';
import PrivacyPolicy from 'pages/store/pages/PrivacyPolicy';
import TermsOfService from 'pages/store/pages/TermsOfService';
import CustomizeHomePage from 'pages/store/pages/CustomizeHomePage';
import CustomizeCategoryPage from 'pages/store/pages/CustomizeCategoryPage';
import CustomizeProductPage from 'pages/store/pages/CustomizeProductPage';

//LAZY LOAD PAGES

const AppWithoutProviding = () => {
  const {userData} = useUserContext()
  const router = useMemo(()=>createBrowserRouter([
    {
      index: true,
      element: <Home/>,
    },
    {
      path: '/login',
      element: userData ? <Redirect redirect='/dashboard' /> : <Login/> ,
    },
    // {
    //   path: '/register',
    //   element: userData ? <Redirect redirect='/dashboard' /> :  <Register/>,
    // },
    {
      path: "/",
      element: userData ? <Container /> : <Redirect redirect='/login' />,
      children: [,
        {
          path: "dashboard",
          element: <Dashboard/>,
        },
        {
          path: "redirect",
          element: <Redirect/>,
        },
        {
          path: "orders",
          element: <Outlet/>,
          children:[
            {
              index: true,
              element: <Orders key={false}/>,
            },
            {
              path: 'abandoned-orders',
              element: <Orders key={true} abandoned/>,
            }
          ]
        },
        {
          path: "products",
          element: <Outlet/>,
          children:[
            {
              index: true,
              element: <Products/>,
            },
            {
              path: ':id',
              element: <AddProduct/>,
            }
          ]
        },
        {
          path: "store",
          element: <Redirect redirect={'design'} />
        },
        {
          path: "store",
          element: <Outlet />,
          children: [
            {
              path: 'design',
              element: <Design />
            },
            {
              path: 'categories',
              element: <Categories/>
            },
          ]
        },
        {
          path: "store",
          element: <Store />,
          children: [
            {
              path: 'customize-category-page',
              element: <CustomizeCategoryPage/>
            },
            {
              path: 'customize-product-page',
              element: <CustomizeProductPage/>
            },
            {
              path: 'thank-you-page',
              element: <ThankYoupage/>
            },
            {
              path: 'privacy-policy',
              element: <PrivacyPolicy/>
            },
            {
              path: 'terms-of-service',
              element: <TermsOfService/>
            }
            
          ]
        },
        {
          path: 'store/customize-home-page',
          element: <CustomizeHomePage/>
        },
        {
          path: "stats",
          element: <div />,
        },
        {
          path: "credit-scoore",
          element: <div />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
        {
          path: "settings/shipping",
          element: <Shipping />,
        },
        {
          path: "apps",
          element: <Apps/>,
        },
        {
          path: "apps/google-sheets",
          element: <GoogleSheets />,
        },
        {
          path: "apps/facebook-pixel",
          element: <FacebookPixel />,
        },
        {
          path: "apps/tiktok-pixels",
          element: <TiktokPixels />,
        },
        {
          path: "support",
          element: <div />,
        },
      ],
    },
  ]), [userData])
  return (
    <RouterProvider router={router} />
  )
}


const App = ()=>(
  <BrowserContextProvider>
      <UserContextProvider>
        <AppWithoutProviding />
      </UserContextProvider>
  </BrowserContextProvider>
)

export default App