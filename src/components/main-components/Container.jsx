import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import classes from './Container.module.css';
import Header from './Header';
import Sidebar from './sidebar/Sidebar';
import SidebarContent from '../main-components/sidebar/SidebarContent';
import { useUserContext } from '../../store/user-context';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
      window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
};

const Container = () => {
  const [open, setOpen] = useState(false)
  const {userData} = useUserContext()

  return (
    <>
      <ScrollToTop/>
      <div className={classes.container}>
        <Header setOpen={setOpen}/>
        <div className={classes.container__body} >
            {userData &&
              <Sidebar open={open} onClickBackdrop={()=>setOpen(false)}>
                <SidebarContent setOpen={setOpen} />
              </Sidebar>
            }
            <div className={classes.content}>
              <Outlet/>
            </div>
        </div>
      </div>
    </>
      
      
  )
}

export default Container