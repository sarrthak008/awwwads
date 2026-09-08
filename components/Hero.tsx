'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { EffectComposer, Bloom, SMAA, Vignette } from '@react-three/postprocessing'
import { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

function Model({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/model/model.glb')
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

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Listen to Lenis scroll updates and update progress (0 to 1)
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
          zIndex: 0,
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