import Hero from '@/components/Hero'
import HeroText from '@/components/HeroText'
import NavBar from '@/components/NavBar'
import SettingPannel from '@/components/SettingPannel'
import React from 'react'

const page = () => {
  return (
    <div className='w-screen relative'>
      <NavBar/>
      <Hero/>
        <div className='absolute h-full w-full top-0'>
           <HeroText/>
        </div>
      <SettingPannel/>
    </div>
  )
}

export default page