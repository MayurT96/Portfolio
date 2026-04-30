"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sphere, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingObjects() {
  const groupRef = useRef<any>(null);
  const count = 35;

  const objects = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 20 - 5,
      ] as [number, number, number],
      scale: Math.random() * 1.8 + 0.3,
      speed: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(time * 0.15) * 0.8;
    groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.2;
    groupRef.current.rotation.y = Math.cos(time * 0.05) * 0.2;
    
    // Parallax
    const pointer = state.pointer;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pointer.x * 3, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, pointer.y * 3, 0.05);
  });

  return (
    <group ref={groupRef as any}>
      {objects.map((obj, i) => (
        <Float
          key={i}
          speed={obj.speed}
          rotationIntensity={2}
          floatIntensity={2.5}
          position={obj.position}
        >
          <Sphere args={[1, 64, 64]} scale={obj.scale}>
            <MeshTransmissionMaterial
              background={new THREE.Color("#000000")}
              transmission={0.95}
              thickness={1.2}
              roughness={0.15}
              chromaticAberration={0.08}
              ior={1.6}
              color="#38bdf8"
              attenuationColor="#4f46e5"
              attenuationDistance={3}
            />
          </Sphere>
        </Float>
      ))}
      
      {/* Intense Neon Lights */}
      <spotLight position={[15, 15, -5]} color="#38bdf8" intensity={300} distance={60} angle={1.2} penumbra={1} />
      <spotLight position={[-15, -15, -5]} color="#4f46e5" intensity={250} distance={60} angle={1.2} penumbra={1} />
      <pointLight position={[0, 0, 5]} color="#818cf8" intensity={50} distance={20} />
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-black">
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 45 }} 
        dpr={1}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false, depth: false }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.1} />
        <Suspense fallback={null}>
          <Environment preset="night" />
          <FloatingObjects />
        </Suspense>
        <fog attach="fog" args={["#000000", 12, 40]} />
      </Canvas>
    </div>
  );
}
