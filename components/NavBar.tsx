"use client"
import React, { useState } from 'react'
import { useAppSound } from '@/utils/soundHandler'
import Vibrate from './ui/Vibrate'
const NavBar = () => {
  let d = new Date()
  const [year, setYear] = useState(d.getFullYear())
  const click = useAppSound({sound:"click"});

  return (
    <div className='h-[12vh] px-4 py-2 fixed top-0 w-screen flex justify-around items-center text-white'>
      <div className='flex flex-col text-[14px]'>
        <div className='line-clamp-[-1]'>
          <span><span className='w-[20px] inline-block h-[10px] bg-orange-400'></span> S</span>arthak
        </div>
        <div className='mt-[-3px]'>
          <span>N</span>avale @{year}
        </div>
      </div>
      <div className='flex gap-10'>
          <div className='cursor-pointer'><i className="ri-linkedin-line text-white"></i></div>
          <div className='cursor-pointer'><i className="ri-github-line"></i></div>
          <div className='cursor-pointer'><i className="ri-instagram-line"></i></div>
      </div>
      <div className=''>
         <Vibrate>
              <div className='cursor-pointer' onClick={()=>click()}>contact</div>
         </Vibrate>
      </div>
    </div>
  )
}

export default NavBar