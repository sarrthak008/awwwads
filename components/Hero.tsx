'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, useProgress } from '@react-three/drei'
import { EffectComposer, Bloom, SMAA, Vignette } from '@react-three/postprocessing'
import { Suspense, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

function MainLoader({ setLoading }: { setLoading: (loading: boolean) => void }) {
  const { progress, active } = useProgress()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setLoading(false)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [active, progress, setLoading])

  if (!isVisible) return null

  return (
    <div 
      className='h-screen w-screen fixed bg-black z-50 flex flex-col items-center justify-center text-white transition-opacity duration-500'
      style={{ opacity: progress === 100 ? 0 : 1 }}
    >
      <div className="text-xl font-medium spcae tracking-wider mb-4">
        LOADING {Math.round(progress)}%
      </div>
      <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gray-500 transition-all duration-150 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function Model({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/model/new.glb')
  const { actions, names } = useAnimations(animations, group)

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.geometry.computeVertexNormals()

        if (child.material.map) {
          child.material.map.anisotropy = 16
          child.material.map.generateMipmaps = true
          child.material.map.minFilter = THREE.LinearMipmapLinearFilter
          child.material.map.needsUpdate = true
        }

        child.material.roughness = 0.6
        child.material.metalness = 0.2
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    if (names.length > 0) {
      actions[names[0]]?.reset().fadeIn(0.5).play()
    }

    return () => {
      if (names.length > 0) {
        actions[names[0]]?.fadeOut(0.5)
      }
    }
  }, [actions, names, scene])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()

    const idleRotationY = t * 0.2
    const idleFloat = Math.sin(t * 0.8) * 0.15

    const scrollRotationY = scrollProgress.current * Math.PI * 2
    const scrollTiltX = scrollProgress.current * 0.3
    const scale = (1 - scrollProgress.current * 0.2) * 1.5

    group.current.rotation.y = idleRotationY + scrollRotationY
    group.current.rotation.x = scrollTiltX
    group.current.position.y = idleFloat 
    group.current.scale.set(scale, scale, scale)
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/model/new.glb')

export default function Hero() {
  const scrollProgress = useRef(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', (e) => {
      scrollProgress.current = e.progress
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <>
      {/* 2. MainLoader sits over everything until the model flags complete */}
      <MainLoader setLoading={setIsLoading} />

      {/* Spacer div to create page scroll height */}
      <div style={{ height: '300vh', width: '100%' }} />

      <section
        style={{
          width: '100%',
          height: '100vh',
          background: '#000',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 7], fov: 50 }}
          dpr={[1, 2]}
          shadows={{ type: THREE.PCFSoftShadowMap }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
        >
          <Suspense fallback={null}>
            <Model scrollProgress={scrollProgress} />
          </Suspense>

          <ambientLight intensity={0.5} />
          
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          >
            <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 0.1, 50]} />
          </directionalLight>

          <pointLight position={[-5, -2, -5]} intensity={0.5} color="#ff6b9d" />

          <EffectComposer multisampling={8}>
            <SMAA />
            <Bloom intensity={0.6} luminanceThreshold={0.25} luminanceSmoothing={0.9} />
            <Vignette eskil={false} offset={0.1} darkness={0.6} />
          </EffectComposer>
        </Canvas>
      </section>
    </>
  )
}