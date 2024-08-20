import React from 'react'
import classes from './InfoTable.module.css'

const InfoTable = ({iconClass, title, infolist}) => {
  return (
    <div className={classes['table'] + ' container'}>
        <div className={classes['title-container']}>
            <i className={`${iconClass} ${classes.title__icon}`}></i>
            <h4>{title}</h4>
        </div>
        <hr/>
        <div>
           {infolist.map((obj)=>(
                <div key={obj.id} className={classes['table-item']}>
                    <h4>{obj.label}</h4>
                    <h4>{obj.value}</h4>
                </div>
            ))}
        </div>
    </div>
  )
}

export default InfoTable