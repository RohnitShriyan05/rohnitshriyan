"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { NeuralParticles } from "./NeuralParticles";

export function Scene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <NeuralParticles />
        </Suspense>
      </Canvas>
    </div>
  );
}
