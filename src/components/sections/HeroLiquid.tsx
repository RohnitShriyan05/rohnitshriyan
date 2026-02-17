"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  MeshTransmissionMaterial, 
  Environment,
  Float
} from "@react-three/drei";
import * as THREE from "three";

// Magnetic lerp for smooth mouse following
function useLerpedMouse() {
  const mouse = useRef({ x: 0, y: 0 });
  const lerped = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    lerped.current.x += (mouse.current.x - lerped.current.x) * 0.05;
    lerped.current.y += (mouse.current.y - lerped.current.y) * 0.05;
  });

  return lerped;
}

function ChromeGlassShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useLerpedMouse();
  const { viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Magnetic mouse following
    const targetX = mouse.current.x * viewport.width * 0.3;
    const targetY = mouse.current.y * viewport.height * 0.3;
    
    meshRef.current.position.x = targetX;
    meshRef.current.position.y = targetY;
    
    // Subtle rotation based on mouse
    meshRef.current.rotation.x = mouse.current.y * 0.3;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15 + mouse.current.x * 0.3;
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.3}
    >
      <mesh ref={meshRef} scale={1.8}>
        <torusKnotGeometry args={[1, 0.35, 100, 16, 2, 3]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.3}
          samples={4}
          resolution={512}
          transmission={1}
          roughness={0.0}
          thickness={0.5}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropicBlur={0.2}
          distortion={0.3}
          distortionScale={0.2}
          temporalDistortion={0.1}
          color="#ffffff"
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <ChromeGlassShape />
      
      <Environment preset="city" />
    </>
  );
}

export function HeroLiquid() {
  const [latency, setLatency] = useState(42);

  // Simulate fluctuating latency counter (throttled to reduce re-renders)
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 60) + 30);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ 
            antialias: false, 
            alpha: false,
            powerPreference: "high-performance" 
          }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Overlay UI */}
      <div className="relative z-10 h-full flex flex-col justify-between pointer-events-none">
        {/* Top bar */}
        <div className="flex justify-between items-start p-4 md:p-8">
          <div className="font-mono text-[10px] md:text-xs tracking-widest text-muted uppercase">
            Software Engineer
          </div>
          <div className="font-mono text-[10px] md:text-xs tracking-widest text-muted uppercase">
            AI Specialist
          </div>
        </div>

        {/* Center content - name is in 3D */}
        <div className="flex-1" />

        {/* Bottom bar */}
        <div className="p-4 md:p-8 space-y-4">
          {/* Mobile: Stack vertically, Desktop: Grid layout */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-0">
            {/* Latency counter */}
            <div className="font-mono text-[10px] md:text-xs tracking-wider">
              <span className="text-muted">Latency: </span>
              <span className="text-system-red animate-pulse-red font-bold">
                {latency}ms
              </span>
              <span className="text-chrome ml-2">
                {"<"}100ms
              </span>
            </div>

            {/* Scroll hint - hidden on mobile */}
            <div className="hidden md:flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted">
                Scroll
              </span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-muted to-transparent" />
            </div>

            {/* Status */}
            <div className="font-mono text-[10px] md:text-xs tracking-wider md:text-right">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-system-red opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-system-red" />
                </span>
                <span className="text-chrome hidden md:inline">Available for opportunities</span>
                <span className="text-chrome md:hidden">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Massive text overlay - visible behind glass */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none px-4">
        <h1 className="text-center font-display font-black text-outline-thick select-none tracking-tight">
          <div className="text-[clamp(2.5rem,12vw,11rem)] leading-[0.85]">
            ROHNIT
          </div>
          <div className="text-[clamp(2.5rem,12vw,11rem)] leading-[0.85] mt-2 md:mt-0">
            SHRIYAN
          </div>
        </h1>
      </div>
    </section>
  );
}
