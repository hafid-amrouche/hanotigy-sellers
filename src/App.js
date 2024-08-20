import React, { useMemo } from 'react'
import { createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Container from './components/main-components/Container'
import BrowserContextProvider from './store/browser-context';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import AbandonedOrders from './pages/orders/pages/AbandonedOrders';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserContextProvider, useUserContext } from './store/user-context';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import Redirect from 'pages/Redirect';
import Shipping from 'pages/settings/Shipping';
import Products from 'pages/Products';
import GoogleSheets from 'pages/apps/GoogleSheets';




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
    {
      path: '/register',
      element: userData ? <Redirect redirect='/dashboard' /> :  <Register/>,
    },
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
              element: <Orders/>,
            },
            {
              path: 'abandoned-orders',
              element: <AbandonedOrders/>,
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
          element: <div />,
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
          element: <div />,
        },
        {
          path: "settings/shipping",
          element: <Shipping />,
        },
        {
          path: "apps/google-sheets",
          element: <GoogleSheets />,
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