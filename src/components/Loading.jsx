import React from 'react'
import classes from './Loading.module.css'

const Loading = (props) => {
  return (
    <div {...props}>
      <div className={classes["progress-bar"]}>
        <div className={classes["progress-bar-value"]}></div>
      </div>
    </div>
  )
}

export default Loading