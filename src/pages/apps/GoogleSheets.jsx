import React, { useEffect, useState } from 'react'
import classes from '../general.module.css'
import { copyToClipboard, translate } from 'utils/utils'
import Img from 'components/Img'
import gsIcon from '../../assets/icons/apps/google-sheets.png' 
import Button from 'components/Button'
import Input from 'components/tags/Input'
import IconWithHover from 'components/IconWithHover'
import { googleSheetsEmail } from 'constants/emails'
import axios from 'axios'
import { apiUrl } from 'constants/urls'
import { useBrowserContext } from 'store/browser-context'

const GoogleSheets = () => {
    const [active, setActive] = useState(true)
    const [GSID, setGSID] = useState('')
    const [sheetName, setSheetName] = useState('')
    const [loading, setLoading] = useState(false)
    const {setGlobalMessageA} = useBrowserContext()
    const setUpGoogleSheets = async()=>{
        setLoading(true)
        try{
            const {data} = await axios.post(
                apiUrl + '/store/set-up-google-sheets',
                {
                    store_id: localStorage.getItem('storeId'),
                    sheet_name: sheetName,
                    spreadsheet_id: GSID
                },
                {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }
            )
            setGlobalMessageA({
                color: 'var(--successColor)',
                children: data.detail,
                time: 3000
            })
            setActive(true)
        }catch(err){
            setGlobalMessageA({
                color: 'red',
                children: err.response.data.detail || err.message,
                time: 6000
            })
            
        }
        setLoading(false)
            
    }
    const [fetchingData, setFetchingData] = useState(true)
    const [error, setError] = useState(false)
    const getGSInfo=async()=>{ 
        setFetchingData(true)
        setError(false)
        try{
            const {data} = await axios.get(
                apiUrl + '/store/get-gs-info?store_id='+ localStorage.getItem('storeId'),
                {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }

            )
            const gsInfo = data.gsInfo
            if(gsInfo){
                setGSID(gsInfo.spreadsheetId)
                setSheetName(gsInfo.sheetName)
                setActive(true)
            }else{
                setActive(false)
            }
                
        }catch(err){
            setError(true)

        }
        setFetchingData(false)
            
    }

    const [deleting, setDeleting] = useState(false)
    const deleteGSInfo=async()=>{ 
        setDeleting(true)
        try{
            const {data} = await axios.post(
                apiUrl + '/store/delete-gs-info',
                {
                    store_id:  localStorage.getItem('storeId')
                },
                {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }

            )
            setActive(false)
            setGSID('')
            setSheetName('')
        }catch(err){
            setGlobalMessageA({
                children: translate('Error while removing your google sheets account, try again'),
                color: 'red',
                time: 4000
            })
        }
        setDeleting(false)
    }

    useEffect(()=>{
        getGSInfo()
    }, [])
  return (
    <div className={classes['container']}>
        <div className={classes['card'] + ' d-f '}>
            <Img src={gsIcon} width={ 100 } style={{ objectFit: 'cover' }}/>
            <div className='flex-1'>
                <h3 className='color-primary'>{translate('Google Sheets') }</h3>
                <p className='lh-1'>{translate('Google Sheets is a spreadsheet app used to organize, format, and calculate your orders.')}</p>
            </div>
        </div>
        { !error && !fetchingData && active && <div className={classes['card'] + ' column g-4'}  disabled={deleting}>
            <div className='d-f justify-content-between align-items-center'>
                <h3 className='color-primary'>{ translate('Your google sheets information') }</h3>
                <IconWithHover onClick={deleteGSInfo} iconClass='fa-solid fa-trash color-red'/>
            </div>
            <div className='column g-3'>
                <Input label='Google sheet ID' disabled  value={GSID} onChange={setGSID} />
                <Input label='Sheet name' disabled  value={sheetName} onChange={setSheetName} />
            </div>
        </div>}
        { !error && !fetchingData && !active && <div className={classes['card'] + ' column g-4'}>
            <h3 className='color-primary'>{ translate('Setup google sheets') }</h3>
            <h4>{ translate('Step 1: Share your google sheet with this email: ') } <span className='color-primary'>{googleSheetsEmail}<IconWithHover onClick={()=>copyToClipboard(googleSheetsEmail)} iconClass='fa-solid fa-copy p-1'/></span></h4>
            <div className='column g-3'>
                <h4>{ translate('Step 2: Add your google sheets information') }</h4>
                <Input label='Google sheet ID' value={GSID} onChange={setGSID} />
                <Input label='Sheet name' value={sheetName} onChange={setSheetName} />
            </div>
            <Button onClick={setUpGoogleSheets} disabled={loading} >{ translate('Submit') }</Button>
        </div>}
        {
            error && !fetchingData && <div className={classes['card'] + ' column g-4 align-items-center'}>
                    <IconWithHover size={80} onClick={getGSInfo} iconClass='fa-solid fa-rotate-right color-red py-3' />
            </div>
        }
    </div>
  )
}

export default GoogleSheets