import Hero from '@/components/Hero'
import HeroText from '@/components/HeroText'
import NavBar from '@/components/NavBar'
import React from 'react'

const page = () => {
  return (
    <div className='w-screen relative'>
      <NavBar/>
      <Hero/>
        <div className='absolute top-0'>
           <HeroText/>
        </div>
    </div>
  )
}

export default page