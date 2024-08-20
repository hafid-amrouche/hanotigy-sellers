import React, { Suspense } from 'react'
import Loading from './Loading'

const SuspenseComponent = ({Component, ...props}) => {
  return (
      <Suspense fallback={<Loading/>}>
        <Component { ...props }/>
      </Suspense>
  )
}

export default SuspenseComponent