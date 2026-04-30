"use client";

import React, { useRef, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Earth() {
  const earthGroupRef = useRef<THREE.Group>(null);
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const blastRef = useRef<THREE.Points>(null);
  
  // Ref for animating the natively built spark blast opacity and scale
  const blastParams = useRef({ opacity: 0, scale: 0 });
  const fireballRef = useRef<THREE.Mesh>(null);

  // Load standard continuous Earth texture
  const texture = useLoader(THREE.TextureLoader, "/earth.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  
  const { camera } = useThree();
  // Generate physics data for a hyper-realistic explosion
  // Using useMemo to generate arrays once, then simulating physics purely on GPU/CPU in useFrame
  const blastData = useMemo(() => {
    const count = 1500; // Massive spark density for realism
    const initPos = new Float32Array(count * 3);
    const velocity = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Core lava and fire colors
    const fireColors = [
      new THREE.Color("#ff2a00"), // Red core
      new THREE.Color("#ff7300"), // Orange flame
      new THREE.Color("#ffaa00"), // Yellow flame
      new THREE.Color("#ffffff"), // Hot white
    ];

    for (let i = 0; i < count; i++) {
        // Distribute points on the surface of the Earth (radius 5)
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 5.0 + Math.random() * 0.5; 
        
        const px = r * Math.sin(phi) * Math.cos(theta);
        const py = r * Math.sin(phi) * Math.sin(theta);
        const pz = r * Math.cos(phi);
        
        initPos[i*3] = px;
        initPos[i*3+1] = py;
        initPos[i*3+2] = pz;

        // Realistic explosive velocity outward (Normal vector + scatter)
        const speed = 5.0 + Math.pow(Math.random(), 4) * 25.0; // Some extremely fast flying sparks
        const scatterX = (Math.random() - 0.5) * 1.5;
        const scatterY = (Math.random() - 0.5) * 1.5;
        const scatterZ = (Math.random() - 0.5) * 1.5;
        
        // Normalize direction and multiply by speed
        const dirX = (px / r) + scatterX;
        const dirY = (py / r) + scatterY;
        const dirZ = (pz / r) + scatterZ;
        const length = Math.sqrt(dirX*dirX + dirY*dirY + dirZ*dirZ);
        
        velocity[i*3] = (dirX / length) * speed;
        velocity[i*3+1] = (dirY / length) * speed;
        velocity[i*3+2] = (dirZ / length) * speed;

        const color = fireColors[Math.floor(Math.random() * fireColors.length)];
        colors[i*3] = color.r;
        colors[i*3+1] = color.g;
        colors[i*3+2] = color.b;
    }
    return { initPos, velocity, colors, count };
  }, []);

  const blastGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(blastData.initPos), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(blastData.colors, 3));
    return geo;
  }, [blastData]);


  useEffect(() => {
    if (!earthGroupRef.current) return;

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, 
      }
    });

    // Gentle pan and subtle zoom for depth
    tl.to(camera.position, {
      y: -2,  
      z: 11,  
      ease: "power2.inOut",
      duration: 1
    }, 0);

    // Fast, dramatic cinematic rotation mapped to the entire scroll
    tl.to(earthGroupRef.current.rotation, {
      x: 0.5,
      y: Math.PI * 1.5, // Earth will visibly spin dramatically faster start to end
      ease: "power1.inOut",
      duration: 1
    }, 0);

    // BLAST EFFECT
    // Triggers beautifully at 80% mark as requested
    tl.to(earthGroupRef.current.scale, {
      x: 0.85,
      y: 0.85,
      z: 0.85,
      duration: 0.2,
      ease: "power3.out"
    }, 0.8);

    tl.to(blastParams.current, {
      opacity: 1,
      scale: 1,
      duration: 0.2, // Pops open brightly
      ease: "power2.out"
    }, 0.8);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [camera]);

  useFrame(() => {
    if (earthMeshRef.current) {
      // Natural continuous atmospheric background spin
      earthMeshRef.current.rotation.y += 0.0008;
    }
    // Update realistic scrubbable physics! 
    const uProgress = blastParams.current.scale; // 0 to 1 based on scroll
    
    // 1. Flash effect of the central lava core exploding
    if (fireballRef.current) {
      fireballRef.current.scale.setScalar(1 + uProgress * 2.5);
      const flashOpacity = Math.max(0, (1.0 - uProgress * 2.5)); // Fades out extremely fast
      (fireballRef.current.material as THREE.MeshBasicMaterial).opacity = flashOpacity * blastParams.current.opacity * 0.9;
    }

    // 2. Flying sparks with physics (air resistance and gravity)
    if (blastRef.current && blastRef.current.geometry) {
      const posAttr = blastRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const { initPos, velocity, count } = blastData;
      
      const t = uProgress * 1.5; // scaled time
      // Air drag formula to make particles shoot fast then slow down gracefully
      const damping = 1.0 - Math.exp(-t * 4.0); 
      // Gravity pulling sparks down
      const gravity = 12.0 * t * t; 

      for (let i = 0; i < count; i++) {
         posAttr.array[i*3]     = initPos[i*3]     + velocity[i*3]     * damping;
         posAttr.array[i*3 + 1] = initPos[i*3 + 1] + velocity[i*3 + 1] * damping - gravity;
         posAttr.array[i*3 + 2] = initPos[i*3 + 2] + velocity[i*3 + 2] * damping;
      }
      posAttr.needsUpdate = true;
      
      (blastRef.current.material as THREE.PointsMaterial).opacity = blastParams.current.opacity * Math.max(0, 1.0 - uProgress); 
    }
  });

  return (
    <group ref={earthGroupRef}>
      <mesh ref={earthMeshRef}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial 
          map={texture} 
          roughness={1}
          metalness={0}
        />
      </mesh>
      
      {/* Inner Massive Fireball Flash */}
      <mesh ref={fireballRef}>
        <sphereGeometry args={[5.2, 32, 32]} />
        <meshBasicMaterial 
          color="#ff4500" 
          transparent 
          opacity={0} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false} 
        />
      </mesh>

      {/* Realistic Lava Sparks */}
      <points ref={blastRef} geometry={blastGeometry}>
        <pointsMaterial 
          size={0.12} 
          vertexColors={true}
          transparent 
          opacity={0} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function EarthScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 75 }}
      dpr={1} 
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false, depth: true }} 
      style={{ width: "100%", height: "100%", position: "fixed", top: 0, left: 0, zIndex: -10, pointerEvents: "none" }}
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[8, 5, 2]} intensity={1.5} color={0xffffff} />
      <directionalLight position={[-4, -2, -2]} intensity={0.3} color={0xa78bfa} />
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
    </Canvas>
  );
}
