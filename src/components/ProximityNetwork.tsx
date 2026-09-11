import React, { useEffect, useMemo, useRef } from '@fuser/vendor/react';
import { useFrame } from '@fuser/vendor/react-three-fiber';
import * as THREE from '@fuser/vendor/three';

// Keep the constellation deliberately airy: fewer anchors cover a much wider field.
const POINT_COUNT = 220;
const MAX_SEGMENTS = 420;
const LIMIT = new THREE.Vector3(125, 19, 3.4);
const CENTER_Z = -10;

const seeded = (n: number) => {
  const value = Math.sin(n * 91.731 + 17.19) * 43758.5453;
  return value - Math.floor(value);
};

/** A wide, shallow cloud whose proximity lines are rebuilt as its points drift. */
export default function ProximityNetwork({ theme, active, color, activeColor }: { theme: 'light' | 'dark'; active: boolean; color?: string; activeColor?: string }) {
  const pointGeometry = useMemo(() => new THREE.BufferGeometry(), []);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry(), []);
  const positions = useMemo(() => {
    const array = new Float32Array(POINT_COUNT * 3);
    for (let i = 0; i < POINT_COUNT; i += 1) {
      array[i * 3] = (seeded(i) * 2 - 1) * LIMIT.x;
      array[i * 3 + 1] = (seeded(i + 701) * 2 - 1) * LIMIT.y;
      array[i * 3 + 2] = CENTER_Z + (seeded(i + 1402) * 2 - 1) * LIMIT.z;
    }
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(array, 3));
    return array;
  }, [pointGeometry]);
  const velocities = useMemo(() => Array.from({ length: POINT_COUNT }, (_, i) => new THREE.Vector3(
    (seeded(i + 2001) - 0.5) * 0.5,
    (seeded(i + 2501) - 0.5) * 0.34,
    (seeded(i + 3001) - 0.5) * 0.12,
  )), []);
  const lines = useMemo(() => {
    const array = new Float32Array(MAX_SEGMENTS * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(array, 3));
    lineGeometry.setDrawRange(0, 0);
    return array;
  }, [lineGeometry]);
  const frame = useRef(0);

  useEffect(() => () => { pointGeometry.dispose(); lineGeometry.dispose(); }, [lineGeometry, pointGeometry]);

  useFrame((_, delta) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dt = reduced ? 0 : Math.min(delta, 0.05);
    for (let i = 0; i < POINT_COUNT; i += 1) {
      const p = i * 3;
      positions[p] += velocities[i].x * dt;
      positions[p + 1] += velocities[i].y * dt;
      positions[p + 2] += velocities[i].z * dt;
      if (Math.abs(positions[p]) > LIMIT.x) velocities[i].x *= -1;
      if (Math.abs(positions[p + 1]) > LIMIT.y) velocities[i].y *= -1;
      if (Math.abs(positions[p + 2] - CENTER_Z) > LIMIT.z) velocities[i].z *= -1;
    }
    (pointGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    frame.current += 1;
    if (frame.current % 2 !== 0) return;
    const connections = new Uint8Array(POINT_COUNT);
    let segment = 0;
    for (let a = 0; a < POINT_COUNT && segment < MAX_SEGMENTS; a += 1) {
      for (let b = a + 1; b < POINT_COUNT && segment < MAX_SEGMENTS; b += 1) {
        if (connections[a] >= 3 || connections[b] >= 3) continue;
        const ax = positions[a * 3], ay = positions[a * 3 + 1], az = positions[a * 3 + 2];
        const dx = ax - positions[b * 3], dy = ay - positions[b * 3 + 1], dz = az - positions[b * 3 + 2];
        if (dx * dx + dy * dy + dz * dz >= 64) continue;
        const cursor = segment * 6;
        lines[cursor] = ax; lines[cursor + 1] = ay; lines[cursor + 2] = az;
        lines[cursor + 3] = positions[b * 3]; lines[cursor + 4] = positions[b * 3 + 1]; lines[cursor + 5] = positions[b * 3 + 2];
        connections[a] += 1; connections[b] += 1; segment += 1;
      }
    }
    lineGeometry.setDrawRange(0, segment * 2);
    (lineGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  const lineColor = active ? (activeColor ?? '#e11b16') : (color ?? (theme === 'light' ? '#243c32' : '#ffffff'));
  const opacity = theme === 'light' ? 0.48 : 0.86;
  return <group renderOrder={-1}>
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color={lineColor} transparent opacity={opacity} depthWrite={false} fog />
    </lineSegments>
    <points geometry={pointGeometry}>
      <pointsMaterial color={lineColor} size={0.13} transparent opacity={theme === 'light' ? 0.72 : 1} depthWrite={false} fog />
    </points>
  </group>;
}
