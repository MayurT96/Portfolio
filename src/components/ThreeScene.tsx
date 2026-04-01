"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
// Mesh import removed; using any for ref


function Sphere({ scroll }: { scroll: number }) {
  const meshRef = useRef<any>(null!);

  useFrame(() => {
    if (!meshRef.current) return;

    // 🔥 scroll based animation
    meshRef.current.rotation.y = scroll * Math.PI * 2;
    meshRef.current.rotation.x = scroll * Math.PI;
    meshRef.current.position.z = scroll * 2;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export default function ThreeScene({ scroll }: { scroll: number }) {
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-[1]">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={2} />
        <directionalLight position={[2, 2, 2]} intensity={2} />
        <Sphere scroll={scroll} />
      </Canvas>
    </div>
  );
}