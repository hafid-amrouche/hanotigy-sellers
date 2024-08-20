import React from 'react'
import classes from './Dashboard.module.css'
import {translate} from '../utils/utils'
import InfoTable from './dashboard/InfoTable'

const infoTables=[
    {
        title: translate('Orders'),
        iconClass: 'fa-solid fa-box',
        infolist:[
            {
                label: translate('Past 24 hours'),
                value : 0,
            },
            {
                label: translate('Past week'),
                value : 0,
            },
            {
                label: translate('Past month'),
                value : 0,
            },
            {
                label: translate('Past year'),
                value : 0,
            },
            {
                label: translate('All time'),
                value : 0,
            },
        ]
    },
    {
        title: translate('Income'),
        iconClass: 'fa-solid fa-dollar',
        infolist:[
            {
                label: translate('Past 24 hours'),
                value : 0 + translate(' DA '),
            },
            {
                label: translate('Past week'),
                value : 0 + translate(' DA '),
            },
            {
                label: translate('Past month'),
                value : 0 + translate(' DA '),
            },
            {
                label: translate('Past year'),
                value : 0 + translate(' DA '),
            },
            {
                label: translate('All time'),
                value : 0 + translate(' DA '),
            },
        ]
    }
]

const Dashboard = () => {
  return (
    <div className='p-2'>
        <div className={classes['tables-container']}>
            {infoTables.map(table=><InfoTable {...table} />)}
        </div>
    </div>
  )
}

export default Dashboard