import Hero from '@/components/Hero'
import NavBar from '@/components/NavBar'
import React from 'react'

const page = () => {
  return (
    <div className='h-[1000vh] w-screen relative'>
      <NavBar/>
      <Hero/>
    </div>
  )
}

export default page