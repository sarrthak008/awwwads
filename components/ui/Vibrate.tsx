"use client"
import React, { useRef } from 'react'
import gsap from 'gsap'

interface VibrateProps {
  children: React.ReactNode
}

const Vibrate = ({ children }: VibrateProps) => {
  const parentV = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    if (!parentV.current) return
    navigator.vibrate(0.6)
    gsap.to(parentV.current, {
      keyframes: {
        x: [0, -3, 3, -3, 3, 0],
      },
      duration: 0.4,
      ease: 'power1.inOut',
    })
  }

  return (
    <div className='inline-block' ref={parentV} onMouseEnter={handleEnter}>
      {children}
    </div>
  )
}

export default Vibrate