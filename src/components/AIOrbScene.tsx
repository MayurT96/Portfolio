"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function NeuralOrb({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Points>(null);
  const originalPositions = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (coreRef.current) {
      const pos = coreRef.current.geometry.attributes.position.array as Float32Array;
      originalPositions.current = new Float32Array(pos);
    }
  }, []);

  const ringGeometry = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.3 + (Math.random() - 0.5) * 0.3;
      const y = (Math.random() - 0.5) * 0.4;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = isActive ? 2.5 : 1;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.4 * speed;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.15;
    }

    if (coreRef.current && originalPositions.current) {
      const pos = coreRef.current.geometry.attributes.position;
      const orig = originalPositions.current;
      const intensity = isActive ? 0.18 : 0.07;
      for (let i = 0; i < pos.count; i++) {
        const ox = orig[i * 3];
        const oy = orig[i * 3 + 1];
        const oz = orig[i * 3 + 2];
        const d = Math.sin(ox * 4 + t * speed * 1.5) * Math.cos(oy * 4 + t * speed) * intensity;
        pos.setXYZ(i, ox * (1 + d), oy * (1 + d), oz * (1 + d));
      }
      pos.needsUpdate = true;
    }

    if (innerRef.current) {
      const s = 1 + Math.sin(t * 3 * speed) * 0.12;
      innerRef.current.scale.setScalar(s);
    }

    if (ringRef.current) {
      ringRef.current.rotation.y = -t * 0.25;
      ringRef.current.rotation.z = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.85, 2]} />
        <meshPhongMaterial
          color="#a78bfa"
          emissive={isActive ? "#22d3ee" : "#7c3aed"}
          emissiveIntensity={isActive ? 0.5 : 0.25}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshPhongMaterial
          color={isActive ? "#22d3ee" : "#c4b5fd"}
          emissive={isActive ? "#06b6d4" : "#8b5cf6"}
          emissiveIntensity={1}
          transparent
          opacity={0.85}
        />
      </mesh>
      <points ref={ringRef} geometry={ringGeometry}>
        <pointsMaterial
          color={isActive ? "#67e8f9" : "#c4b5fd"}
          size={0.04}
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 2]} intensity={1.5} color="#a78bfa" distance={8} />
      <pointLight position={[-2, -1, 1.5]} intensity={0.7} color="#22d3ee" distance={6} />
    </group>
  );
}

export default function AIOrbScene({ isActive }: { isActive: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
    >
      <React.Suspense fallback={null}>
        <NeuralOrb isActive={isActive} />
      </React.Suspense>
    </Canvas>
  );
}
