import { createContext, useContext, useEffect, useState } from "react";

export const  UserContext = createContext({
    userData : null,
    setUserData : ()=>{},
})

let userDataFromBrowser = JSON.parse(localStorage.getItem('userData'))

export const UserContextProvider =({children})=>{
  // userData
  const [userData, setUserData] = useState(userDataFromBrowser)
  useEffect(()=>{
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('token', userData.token)
      localStorage.setItem('storeId', userData.storeId)
    }
    else {
      localStorage.removeItem('userData')
      localStorage.removeItem('token')
      localStorage.removeItem('storeId')
    }
  }, [userData])

  // token expiration handling
//   const {setLoading} = useBrowserContext()
//   const refreshToken = ()=>{
//     setLoading(true)
//     axios.post(
//       `${apiUrl}/user/refresh-user-token/`,
//       {refresh: userData.refresh, token : userData.token},
//       {
//         headers : {
//           "Content-Type": "application/form-data",
//         }
//       }
//     ).then(response=>{
//       const newUserData = {
//         ...userData,
//         access : response.data.access_token,
//         token : response.data.access_token,
//         loginDate:new Date()

//       }
//       setUserData(newUserData)
//       setLoading(false)
//     }).catch(error=>setLoading(false))
//   }
//   const loginDate = useRef(userData.loginDate)
//   loginDate.current = useMemo(()=>userData.loginDate, [userData.loginDate]) 
//   function checkTokenExpiry() {
//     const cond = ((Date.now()-new Date(loginDate.current))/1000) > 250560 // 29 days
//     if (cond) {
//       refreshToken()
//     }
//   } 
//   useEffect(()=>{
//     let interval
//     if(userData.id){
//       checkTokenExpiry()
//       setInterval(checkTokenExpiry, 3600000); // 3600000 milliseconds = 1 hour
//     }
//     return()=> clearInterval(interval) 
//   },[])

  
  // Default value
  const defaultUserContextValue={
    userData,
    setUserData,
  }
    return (
        <UserContext.Provider value={defaultUserContextValue}>
            {children}
        </UserContext.Provider>
    )
}

const useUserContext =()=> useContext(UserContext)
export {useUserContext}