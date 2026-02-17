"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 400;
const CONNECTION_DISTANCE = 2.0;
const MOUSE_INFLUENCE_RADIUS = 2.5;
const MOUSE_REPEL_STRENGTH = 0.6;
const GRID_CELL_SIZE = CONNECTION_DISTANCE;

interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  basePosition: THREE.Vector3;
  phase: number;
  speed: number;
}

// Spatial hash grid for O(n) neighbor lookups instead of O(n²)
class SpatialGrid {
  private cells: Map<string, number[]> = new Map();

  clear() {
    this.cells.clear();
  }

  private key(x: number, y: number, z: number): string {
    return `${Math.floor(x / GRID_CELL_SIZE)},${Math.floor(y / GRID_CELL_SIZE)},${Math.floor(z / GRID_CELL_SIZE)}`;
  }

  insert(index: number, x: number, y: number, z: number) {
    const k = this.key(x, y, z);
    let cell = this.cells.get(k);
    if (!cell) {
      cell = [];
      this.cells.set(k, cell);
    }
    cell.push(index);
  }

  getNeighbors(x: number, y: number, z: number): number[] {
    const cx = Math.floor(x / GRID_CELL_SIZE);
    const cy = Math.floor(y / GRID_CELL_SIZE);
    const cz = Math.floor(z / GRID_CELL_SIZE);
    const result: number[] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const cell = this.cells.get(`${cx + dx},${cy + dy},${cz + dz}`);
          if (cell) {
            for (let i = 0; i < cell.length; i++) {
              result.push(cell[i]);
            }
          }
        }
      }
    }
    return result;
  }
}

export function NeuralParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const mouse3DRef = useRef(new THREE.Vector3(0, 0, 0));
  const scrollRef = useRef(0);
  const frameCount = useRef(0);
  const { viewport } = useThree();

  const grid = useMemo(() => new SpatialGrid(), []);

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

  // Point positions buffer (updated in place each frame)
  const pointPositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  // Point colors (static — computed once, never touched again)
  const pointColors = useMemo(() => {
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const purple = new THREE.Color("#a855f7");
    const blue = new THREE.Color("#3b82f6");
    const white = new THREE.Color("#ffffff");
    const c = new THREE.Color();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random();
      if (t < 0.4) c.copy(purple);
      else if (t < 0.7) c.copy(blue);
      else c.lerpColors(purple, blue, Math.random());
      if (Math.random() < 0.1) c.copy(white);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return colors;
  }, []);

  // Line geometry buffers (pre-allocated, reused every frame)
  const maxLines = PARTICLE_COUNT * 3;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

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

  // Passive scroll listener (registered once)
  useMemo(() => {
    if (typeof window !== "undefined") {
      const key = "__neuralScrollListener";
      if (!(window as unknown as Record<string, boolean>)[key]) {
        window.addEventListener("scroll", () => { scrollRef.current = window.scrollY; }, { passive: true });
        (window as unknown as Record<string, boolean>)[key] = true;
      }
    }
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    frameCount.current++;
    const updateConnections = frameCount.current % 2 === 0;

    const time = state.clock.getElapsedTime();
    const scrollFactor = scrollRef.current * 0.001;

    // Update particle positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      p.position.x = p.basePosition.x + Math.sin(time * p.speed * 0.5 + p.phase) * 0.3 + p.velocity.x * time * 10;
      p.position.y = p.basePosition.y + Math.cos(time * p.speed * 0.4 + p.phase * 1.3) * 0.25 + p.velocity.y * time * 10;
      p.position.z = p.basePosition.z + Math.sin(time * p.speed * 0.3 + p.phase * 0.7) * 0.2 - scrollFactor * 2;

      // Mouse repulsion (use squared distance to skip sqrt when possible)
      const dx = p.position.x - mouse3DRef.current.x;
      const dy = p.position.y - mouse3DRef.current.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < MOUSE_INFLUENCE_RADIUS * MOUSE_INFLUENCE_RADIUS) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / MOUSE_INFLUENCE_RADIUS) * MOUSE_REPEL_STRENGTH;
        p.position.x += (dx / dist) * force;
        p.position.y += (dy / dist) * force;
      }

      pointPositions[i * 3] = p.position.x;
      pointPositions[i * 3 + 1] = p.position.y;
      pointPositions[i * 3 + 2] = p.position.z;
    }

    // Flag positions dirty (no allocation, just flip the flag)
    (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    // Update connections using spatial grid — every other frame to halve cost
    if (updateConnections && linesRef.current) {
      grid.clear();
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        grid.insert(i, particles[i].position.x, particles[i].position.y, particles[i].position.z);
      }

      let lineIndex = 0;
      const connDistSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

      for (let i = 0; i < PARTICLE_COUNT && lineIndex < maxLines; i++) {
        const pi = particles[i];
        const neighbors = grid.getNeighbors(pi.position.x, pi.position.y, pi.position.z);

        for (let n = 0; n < neighbors.length && lineIndex < maxLines; n++) {
          const j = neighbors[n];
          if (j <= i) continue;

          const pj = particles[j];
          const ddx = pi.position.x - pj.position.x;
          const ddy = pi.position.y - pj.position.y;
          const ddz = pi.position.z - pj.position.z;
          const dSq = ddx * ddx + ddy * ddy + ddz * ddz;

          if (dSq < connDistSq) {
            const dist = Math.sqrt(dSq);
            const alpha = 1 - dist / CONNECTION_DISTANCE;
            const idx = lineIndex * 6;

            linePositions[idx] = pi.position.x;
            linePositions[idx + 1] = pi.position.y;
            linePositions[idx + 2] = pi.position.z;
            linePositions[idx + 3] = pj.position.x;
            linePositions[idx + 4] = pj.position.y;
            linePositions[idx + 5] = pj.position.z;

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

      // Zero remainder
      for (let i = lineIndex * 6; i < linePositions.length; i++) {
        linePositions[i] = 0;
        lineColors[i] = 0;
      }

      const geom = linesRef.current.geometry;
      (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geom.attributes.color as THREE.BufferAttribute).needsUpdate = true;
      geom.setDrawRange(0, lineIndex * 2);
    }
  });

  return (
    <group onPointerMove={handlePointerMove}>
      {/* Invisible plane for mouse tracking */}
      <mesh visible={false}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial />
      </mesh>

      {/* Points instead of InstancedMesh — far cheaper to render */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} count={PARTICLE_COUNT} />
          <bufferAttribute attach="attributes-color" args={[pointColors, 3]} count={PARTICLE_COUNT} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          size={0.06}
          sizeAttenuation
        />
      </points>

      {/* Neural connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} count={linePositions.length / 3} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} count={lineColors.length / 3} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </lineSegments>

      <ambientLight intensity={0.1} />
    </group>
  );
}
