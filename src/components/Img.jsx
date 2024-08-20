import React from 'react'
import alt from '../assets/image-not-found.png'

const Img = ({src, ...props}) => {
  return (
    <img src={src || alt} onError={({currentTarget}) =>currentTarget.src= alt} { ...props }/>
  )
}

export default Img