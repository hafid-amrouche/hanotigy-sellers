import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import classes from './Dialog.module.css'
import { useBlocker } from "react-router-dom";

const DialogComponent = forwardRef(({open, backDropPressCloses=true, close=()=>{}, children}, ref) => {

  useImperativeHandle(ref, () => ({
    close: closeDialog,
    open: openDialog,
    toggle: ()=> isOpen ? closeDialog() : openDialog()
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openDialog = () => {
    document.documentElement.classList.add('no-scroll');
    setIsOpen(true);
    setIsClosing(false);
  };

  const closeDialog = () => {
    document.documentElement.classList.remove('no-scroll');
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      close()
    }, 300); // Match this duration with the CSS animation duration
  };

  useEffect(()=>{
    if (open) openDialog()
    else closeDialog()
  }, [open])



  // esc and back tab to close the dialog
  useBlocker(() =>{
      if (!isOpen) return false
      closeDialog()
      return true
    }
  );


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        closeDialog()
      }
    }
    if (open) document.addEventListener('keydown', handleKeyDown);
    else document.removeEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
  };

  }, [open]);
  return (
    <>
      {isOpen && (
        <div className={`${classes['backdrop']} ${isClosing ? classes['backdrop-fade-out'] : ''}`} onClick={ ()=>{if (backDropPressCloses) closeDialog()} }>
          <div className={`${classes['dialog']} ${isClosing ? classes['dialog-slide-down'] : ''}`} onClick={e => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </>
  );
})

export default DialogComponent;