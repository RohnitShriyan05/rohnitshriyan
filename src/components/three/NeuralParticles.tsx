"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 800;
const CONNECTION_DISTANCE = 1.8;
const MOUSE_INFLUENCE_RADIUS = 2.5;
const MOUSE_REPEL_STRENGTH = 0.6;

interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  basePosition: THREE.Vector3;
  phase: number;
  speed: number;
}

export function NeuralParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const mouse3DRef = useRef(new THREE.Vector3(0, 0, 0));
  const scrollRef = useRef(0);
  const { viewport } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Initialize particle data
  const particles = useMemo<ParticleData[]>(() => {
    const arr: ParticleData[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 8;
      const pos = new THREE.Vector3(x, y, z);
      arr.push({
        position: pos.clone(),
        basePosition: pos.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002
        ),
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
      });
    }
    return arr;
  }, []);

  // Color attributes for instances
  const colorArray = useMemo(() => {
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const purple = new THREE.Color("#a855f7");
    const blue = new THREE.Color("#3b82f6");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random();
      if (t < 0.4) {
        tempColor.copy(purple);
      } else if (t < 0.7) {
        tempColor.copy(blue);
      } else {
        tempColor.lerpColors(purple, blue, Math.random());
      }
      // Occasionally white node
      if (Math.random() < 0.1) {
        tempColor.copy(white);
      }
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }
    return colors;
  }, [tempColor]);

  // Line geometry for connections
  const linePositions = useMemo(
    () => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 0.01 * 6),
    []
  );
  const lineColors = useMemo(
    () => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 0.01 * 6),
    []
  );

  const handlePointerMove = useCallback(
    (e: { clientX: number; clientY: number }) => {
      mouseRef.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      mouse3DRef.current.set(
        mouseRef.current.x * viewport.width * 0.5,
        mouseRef.current.y * viewport.height * 0.5,
        0
      );
    },
    [viewport]
  );

  // Track scroll position
  if (typeof window !== "undefined") {
    if (!(window as unknown as Record<string, boolean>).__scrollListenerAdded) {
      window.addEventListener("scroll", () => {
        scrollRef.current = window.scrollY;
      });
      (window as unknown as Record<string, boolean>).__scrollListenerAdded =
        true;
    }
  }

  useFrame((state) => {
    if (!meshRef.current) return;

    // Set per-instance colors
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      tempColor.setRGB(colorArray[i * 3], colorArray[i * 3 + 1], colorArray[i * 3 + 2]);
      meshRef.current.setColorAt(i, tempColor);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }

    const time = state.clock.getElapsedTime();
    const scrollFactor = scrollRef.current * 0.001;

    // Update each particle
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      // Organic floating motion
      p.position.x =
        p.basePosition.x +
        Math.sin(time * p.speed * 0.5 + p.phase) * 0.3 +
        p.velocity.x * time * 10;
      p.position.y =
        p.basePosition.y +
        Math.cos(time * p.speed * 0.4 + p.phase * 1.3) * 0.25 +
        p.velocity.y * time * 10;
      p.position.z =
        p.basePosition.z +
        Math.sin(time * p.speed * 0.3 + p.phase * 0.7) * 0.2 -
        scrollFactor * 2;

      // Mouse magnetic repulsion
      const dx = p.position.x - mouse3DRef.current.x;
      const dy = p.position.y - mouse3DRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_INFLUENCE_RADIUS) {
        const force =
          (1 - dist / MOUSE_INFLUENCE_RADIUS) * MOUSE_REPEL_STRENGTH;
        p.position.x += (dx / dist) * force;
        p.position.y += (dy / dist) * force;
      }

      // Scale based on z-depth for depth effect
      const scale = THREE.MathUtils.mapLinear(p.position.z, -6, 6, 0.015, 0.045);

      dummy.position.copy(p.position);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;

    // Update connections
    if (linesRef.current) {
      let lineIndex = 0;
      const maxLines = linePositions.length / 6;

      for (let i = 0; i < PARTICLE_COUNT && lineIndex < maxLines; i++) {
        for (
          let j = i + 1;
          j < PARTICLE_COUNT && lineIndex < maxLines;
          j++
        ) {
          const dist = particles[i].position.distanceTo(particles[j].position);
          if (dist < CONNECTION_DISTANCE) {
            const alpha = 1 - dist / CONNECTION_DISTANCE;
            const idx = lineIndex * 6;

            linePositions[idx] = particles[i].position.x;
            linePositions[idx + 1] = particles[i].position.y;
            linePositions[idx + 2] = particles[i].position.z;
            linePositions[idx + 3] = particles[j].position.x;
            linePositions[idx + 4] = particles[j].position.y;
            linePositions[idx + 5] = particles[j].position.z;

            // Purple-blue gradient for lines
            const c = alpha * 0.15;
            lineColors[idx] = 0.66 * c;
            lineColors[idx + 1] = 0.33 * c;
            lineColors[idx + 2] = 0.97 * c;
            lineColors[idx + 3] = 0.23 * c;
            lineColors[idx + 4] = 0.51 * c;
            lineColors[idx + 5] = 0.96 * c;

            lineIndex++;
          }
        }
      }

      // Zero out remaining lines
      for (let i = lineIndex * 6; i < linePositions.length; i++) {
        linePositions[i] = 0;
        lineColors[i] = 0;
      }

      const geom = linesRef.current.geometry;
      geom.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      geom.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(lineColors, 3)
      );
      geom.attributes.position.needsUpdate = true;
      geom.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group onPointerMove={handlePointerMove}>
      {/* Invisible plane for mouse tracking */}
      <mesh visible={false}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial />
      </mesh>

      {/* Instanced particles */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* Neural connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
            count={lineColors.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Ambient atmosphere */}
      <ambientLight intensity={0.1} />
    </group>
  );
}
