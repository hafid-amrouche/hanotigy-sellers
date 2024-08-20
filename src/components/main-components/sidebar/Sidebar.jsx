import { useEffect, useState } from "react";
import classes from './Sidebar.module.css'

const Sidebar=({open, onClickBackdrop, children})=>{
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
  
    const openSidebar = () => {
      document.documentElement.classList.add('no-scroll');
      setIsOpen(true);
      setIsClosing(false);
    };
  
    const closeSidebar = () => {
      document.documentElement.classList.remove('no-scroll');
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300); // Match this duration with the CSS animation duration
    };
  
    useEffect(()=>{
      if(open) openSidebar()
      else closeSidebar()
    }, [open])

    // esc and back tab to close the dialog
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
          onClickBackdrop()
        }
      }
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    })
    return (
      <div>
        
        {isOpen && (
          <div className={`${classes['backdrop']} ${isClosing ? classes['backdrop-fade-out'] : ''}`} onClick={onClickBackdrop}>
            <div className={`${classes['sidebar']} ${isClosing ? classes['sidebar-slide-out'] : classes['sidebar-slide-in']}`} onClick={e => e.stopPropagation()}>
              {children}
            </div>
          </div>
        )}
      </div>
    );
  }
  
export default Sidebar