"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Cinematic Particle System
 * Creates a subtle "starfield" or "dust" effect for depth.
 */
function BackgroundParticles({ count = 2000, color = "#a78bfa" }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 25;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, [count]);

  const groupRef = useRef<any>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0005;
    groupRef.current.rotation.x += 0.0002;
  });

  return (
    <group ref={groupRef}>
      <Points positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={0.012}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

/**
 * Premium Floating Object
 */
function FloatingObject({ position, color, size, speed, distort, opacity, emissiveIntensity, scrollProgress, parallaxFactor }: any) {
  const meshRef = useRef<any>(null!);
  const initialPos = useRef(position);

  useFrame((state) => {
    if (!meshRef.current) return;
    const p = scrollProgress.current;
    
    // Parallax & Scroll-based Depth
    const targetY = initialPos.current[1] + (p * 5 * parallaxFactor);
    const targetZ = initialPos.current[2] + (p * 4 * parallaxFactor);
    
    meshRef.current.position.y = gsap.utils.interpolate(meshRef.current.position.y, targetY, 0.05);
    meshRef.current.position.z = gsap.utils.interpolate(meshRef.current.position.z, targetZ, 0.05);
    
    // Rotation based on scroll
    meshRef.current.rotation.x = p * Math.PI;
    meshRef.current.rotation.y = p * Math.PI * 0.5;
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={distort}
          radius={1}
          transparent
          opacity={opacity}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function SceneContent({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    const p = scrollProgress.current;
    
    // Smooth Camera Track
    // Slight zoom in (decreasing Z) and lift (increasing Y)
    camera.position.z = gsap.utils.interpolate(camera.position.z, 8 - p * 3, 0.05);
    camera.position.y = gsap.utils.interpolate(camera.position.y, 0 + p * 1.5, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <BackgroundParticles count={1200} />
      
      {/* Foreground Element */}
      <FloatingObject 
        position={[2.5, -1, 1]} 
        color="#7C3AED" 
        size={0.8} 
        speed={2} 
        distort={0.4} 
        opacity={0.12} 
        emissiveIntensity={0.5} 
        scrollProgress={scrollProgress}
        parallaxFactor={1.2}
      />

      {/* Midground Element */}
      <FloatingObject 
        position={[-3, 2, -2]} 
        color="#6366F1" 
        size={1.1} 
        speed={1.5} 
        distort={0.3} 
        opacity={0.1} 
        emissiveIntensity={0.3} 
        scrollProgress={scrollProgress}
        parallaxFactor={0.8}
      />

      {/* Background Element */}
      <FloatingObject 
        position={[0, -4, -5]} 
        color="#A78BFA" 
        size={1.5} 
        speed={1} 
        distort={0.2} 
        opacity={0.06} 
        emissiveIntensity={0.2} 
        scrollProgress={scrollProgress}
        parallaxFactor={0.4}
      />

      {/* Atmospheric Grid (Subtle) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]}>
        <planeGeometry args={[50, 50, 50, 50]} />
        <meshStandardMaterial 
          color="#a78bfa" 
          wireframe 
          transparent 
          opacity={0.03} 
        />
      </mesh>
    </>
  );
}

export default function ThreeScene() {
  const [isMobile, setIsMobile] = useState(false);
  const scrollProgress = useRef(0);

  useEffect(() => {
    // Check performance profile
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    setIsMobile(mediaQuery.matches);
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });
    });
    return () => ctx.revert();
  }, []);

  if (isMobile) return null;

  return (
    <div style={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      width: "100%", 
      height: "100vh", 
      zIndex: 0, 
      pointerEvents: "none",
      background: "#06060f" // Seamless blend with existing theme
    }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 35 }} dpr={[1, 2]}>
        <fog attach="fog" args={["#06060f", 6, 16]} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#a78bfa" />
        <spotLight 
          position={[-15, 20, 10]} 
          angle={0.25} 
          penumbra={1} 
          intensity={2} 
          color="#6366f1" 
          castShadow 
        />
        <SceneContent scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
