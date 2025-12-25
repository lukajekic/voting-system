import { ChevronLeft } from 'lucide-react'
import React from 'react'

const BackButton = ({link}) => {
  return (
  <a href={link}><button className='btn w-10 p-0 flex items-center justify-center'><ChevronLeft></ChevronLeft></button></a>
    
  )
}

export default BackButton