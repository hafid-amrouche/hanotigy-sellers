import React from 'react';
import classes from './Loader.module.css'

const Loader = ({ diam=18, color}) => {
  return (
    <div className={classes["loading-state"]} style={{width: diam, height: diam}}>
      <div className={classes["loading"]} style={{borderWidth: diam /16, borderTopColor: color}}></div>
    </div>
  );
};



export default Loader;