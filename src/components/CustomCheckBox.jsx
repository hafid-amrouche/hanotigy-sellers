import React, { useRef } from 'react';
import styles from './CustomCheckbox.module.css';

const CustomCheckbox = ({containerClassName, scale, ...props}) => {
  const inputRef = useRef()
  return (
      <div className={styles.customCheckbox + ' ' + containerClassName} onClick={()=>inputRef.current?.click()} style={{scale}}>
        <input type="checkbox" {...props} ref={inputRef} />
        <span className={styles.checkmark}></span>
      </div>
  );
};

export default CustomCheckbox;
