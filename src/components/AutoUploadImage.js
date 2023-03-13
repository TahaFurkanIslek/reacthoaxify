import React from 'react'

const AutoUploadImage = (props) => {
  const{image}=props  
  return (
    <div><img className='img-thumbnail' src={image} alt="hoax-attachment"/></div>
  )
}

export default AutoUploadImage