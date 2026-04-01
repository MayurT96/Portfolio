"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MAX_PARTICLES = 1800;

/**
 * Luxury Firecracker Particle System
 * Manages pools of particles that explode in radial patterns based on scroll intensity.
 */
function SparkSystem({ scrollVelocity }: { scrollVelocity: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null!);
  
  // Particle Data Pool
  const particleData = useMemo(() => {
    return Array.from({ length: MAX_PARTICLES }, () => ({
      pos: new THREE.Vector3(0, 0, -100),
      vel: new THREE.Vector3(),
      life: 0,
      size: Math.random() * 0.08 + 0.04,
      hue: 0.1, // Golden base
    }));
  }, []);

  // Buffers for Geometry
  const [positions, colors] = useMemo(() => [
    new Float32Array(MAX_PARTICLES * 3),
    new Float32Array(MAX_PARTICLES * 3)
  ], []);

  /**
   * Triggers a burst of gold sparks at a specific location
   */
  const spawnBurst = (x: number, y: number, z: number, intensity: number) => {
    let count = Math.min(60, Math.floor(40 * intensity));
    let activated = 0;

    for (let i = 0; i < MAX_PARTICLES && activated < count; i++) {
      if (particleData[i].life <= 0) {
        particleData[i].pos.set(x, y, z);
        
        // Radial distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = (0.04 + Math.random() * 0.12) * intensity;
        
        particleData[i].vel.set(
          speed * Math.sin(phi) * Math.cos(theta),
          speed * Math.sin(phi) * Math.sin(theta),
          speed * Math.cos(phi)
        );
        
        particleData[i].life = 1.0;
        activated++;
      }
    }
  };

  useFrame((state, delta) => {
    const vel = Math.abs(scrollVelocity.current);
    
    // Spawn explosions based on scroll speed
    if (vel > 0.02 && Math.random() < vel * 0.8) {
      spawnBurst(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10,
        -Math.random() * 5 - 2,
        Math.min(2.5, vel * 12)
      );
    }

    // Ambient drifted sparks for cinematic depth
    if (Math.random() < 0.015) {
      spawnBurst((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, -8, 0.6);
    }

    // Update Particles
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = particleData[i];
      
      if (p.life > 0) {
        // Physics: Velocity + Friction + Slight Drift
        p.pos.add(p.vel);
        p.vel.multiplyScalar(0.97); // Smooth friction
        p.pos.y += 0.002; // Upward drift (heat effect)
        p.life -= delta * 0.65; // Fade over time

        positions[i * 3] = p.pos.x;
        positions[i * 3 + 1] = p.pos.y;
        positions[i * 3 + 2] = p.pos.z;

        // Luxury Gold Gradient (Gold to Soft Orange)
        const alpha = Math.max(0, p.life);
        colors[i * 3] = 1.0; // R
        colors[i * 3 + 1] = 0.75 * alpha + 0.1; // G
        colors[i * 3 + 2] = 0.2 * alpha; // B
      } else {
        positions[i * 3 + 2] = -100; // Move off-camera
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={MAX_PARTICLES}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={MAX_PARTICLES}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function ThreeScene() {
  const [isMobile, setIsMobile] = useState(false);
  const scrollVelocity = useRef(0);
  const lastScroll = useRef(0);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          // Calculate scroll velocity for physics reaction
          const delta = self.scroll() - lastScroll.current;
          scrollVelocity.current = delta * 0.001;
          lastScroll.current = self.scroll();
          
          // Reset velocity after a short delay for bursts
          gsap.to(scrollVelocity, {
              current: 0,
              duration: 0.8,
              ease: "power2.out"
          });
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
      background: "#06060f"
    }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 35 }} dpr={[1, 2]}>
        <fog attach="fog" args={["#06060f", 5, 20]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFD700" />
        <SparkSystem scrollVelocity={scrollVelocity} />
      </Canvas>
    </div>
  );
}
