import React, { useEffect, useState } from 'react'
import classes from './Range.module.css'

const Range = ({ min, max, step, setValue, value, unit }) => {
    const [innerValue, setInnerValue] = useState(value)
    const handleChange = (e) => {
      setValue(Number(e.target.value));
    };
    useEffect(()=>{
        setInnerValue(value)
    }, [value])
    return (
      <div className={classes["range-slider-container"]}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={innerValue}
          onMouseUp={handleChange}
          onTouchEnd={handleChange}
          onChange={e=>setInnerValue(e.target.value)}
          style={{
            background: `linear-gradient(90deg, var(--primaryColor) ${(innerValue - min) / (max - min) * 100}%, rgba(var(--primaryColor-rgb), 0.4) ${(innerValue - min) / (max - min) * 100}%)`,
          }}
        />
        <h4 style={{width: 27, height: 30}} className='text-center'>{innerValue}</h4>
        <h4>{ unit }</h4>
      </div>
    );
  };
  

export default Range