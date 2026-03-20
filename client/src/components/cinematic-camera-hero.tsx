import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, Text, Environment, MeshDistortMaterial, Center } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

const FloatingElements = () => {
  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-5, 2, -10]}>
          <torusGeometry args={[1, 0.4, 16, 100]} />
          <meshStandardMaterial color="#10b981" wireframe />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[5, -2, -8]}>
          <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
          <meshStandardMaterial color="#3b82f6" wireframe />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.5}>
        <mesh position={[0, 4, -12]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <MeshDistortMaterial
            color="#ec4899"
            speed={2}
            distort={0.4}
            radius={1}
          />
        </mesh>
      </Float>
    </>
  );
};

const Scene = ({ scrollProgress }: { scrollProgress: any }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // Camera movements based on scroll
  // At 0%: Hero view (looking at text)
  // At 100%: Z-zoom into the 'editor screen'
  const zPos = useTransform(scrollProgress, [0, 1], [0, 8]);
  const yPos = useTransform(scrollProgress, [0, 1], [0, -4]);
  const rotationX = useTransform(scrollProgress, [0, 1], [0, -Math.PI / 6]);

  useFrame((state) => {
    if (cameraRef.current) {
      cameraRef.current.position.z = 10 - zPos.get();
      cameraRef.current.position.y = 2 + yPos.get();
      cameraRef.current.rotation.x = rotationX.get();
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 2, 10]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      
      <FloatingElements />

      {/* Hero Title in 3D Space */}
      <Center position={[0, 4, 0]}>
        <Text
          fontSize={1.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          VOXCLIP AI
        </Text>
      </Center>

      {/* Editor Screen 'Portal' */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 9]} />
        <meshStandardMaterial color="#000000" emissive="#10b981" emissiveIntensity={0.2} />
        {/* We'll overlap a 2D HTML editor UI over this in the landing page */}
      </mesh>

      <Environment preset="night" />
    </>
  );
};

export const CinematicCameraHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative h-[200vh] bg-black overflow-hidden">
      <div className="sticky top-0 w-full h-screen">
        <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
          <Scene scrollProgress={scrollYProgress} />
        </Canvas>
        
        {/* Overlay Content (Title handles) */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0, 0]) }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4"
        >
          <div className="space-y-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-emerald-400 font-mono text-sm tracking-[0.5em] uppercase mb-4"
             >
               Agentic Creation Studio
             </motion.div>
             <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none uppercase">
               Cinema <br/><span className="text-zinc-500 italic">Redefined</span>
             </h1>
          </div>
        </motion.div>

        {/* Mock Editor UI Overlay - Zooms in as scroll increases */}
        <motion.div 
          style={{ 
            opacity: useTransform(scrollYProgress, [0.7, 0.9], [0, 1]),
            scale: useTransform(scrollYProgress, [0.8, 1], [0.8, 1]),
            y: useTransform(scrollYProgress, [0.8, 1], [100, 0])
          }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 p-4 md:p-12 lg:p-24"
        >
           <div className="w-full max-w-6xl aspect-video rounded-[2.5rem] bg-zinc-950/80 backdrop-blur-3xl border border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col">
              <div className="h-10 border-b border-white/5 flex items-center px-6 gap-2 bg-black/40">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                <div className="ml-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">VoxClip Agent Console</div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                 <div className="text-center space-y-8">
                    <div className="relative">
                       <motion.div 
                         animate={{ scale: [1, 1.2, 1] }} 
                         transition={{ duration: 2, repeat: Infinity }}
                         className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto"
                       >
                         <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                           <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                         </div>
                       </motion.div>
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-3xl font-bold text-white tracking-tight italic uppercase">Listening to director...</h3>
                       <p className="text-zinc-500 font-mono text-sm leading-relaxed max-w-md mx-auto">
                          "Cut the silence after the 2-minute mark and highlight the most emotionally resonant clips."
                       </p>
                    </div>
                 </div>
              </div>
              <div className="h-32 border-t border-white/5 bg-black/40 px-8 flex items-center gap-4">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className={`h-16 rounded-xl border border-white/5 flex-1 transition-all duration-1000 ${i < 4 ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-white/5'}`} />
                 ))}
              </div>
           </div>
        </motion.div>
      </div>

      <div className="h-screen pointer-events-none" /> {/* Spacer for scroll height */}
    </div>
  );
};
