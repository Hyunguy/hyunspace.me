import React, { useEffect, useMemo, useRef } from '@fuser/vendor/react';
import { useFrame } from '@fuser/vendor/react-three-fiber';
import * as THREE from '@fuser/vendor/three';

// A wider, lower-density depth field keeps the vanishing-point structure readable.
const COLUMNS = 23;
const ROWS = 9;
const DEPTH_LAYERS = 14;
const COUNT = COLUMNS * ROWS * DEPTH_LAYERS;
const SPACING = 7;

/**
 * The reference marker field: 7,722 aligned, flat wireframe planes arranged
 * through depth. Each plane keeps the same XY orientation, including the
 * diagonal formed by PlaneGeometry's two triangles.
 */
export default function AnchorConnectorLines({ theme = 'light', color }: { theme?: 'light' | 'dark'; color?: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lastUpdate = useRef(0);

  useEffect(() => {
    if (mesh.current) mesh.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }, []);

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced && now - lastUpdate.current < 1 / 30) return;
    lastUpdate.current = now;
    const time = reduced ? 0 : now;
    let index = 0;
    for (let z = 0; z < DEPTH_LAYERS; z += 1) {
      const layerMotion = z % 5 === 0
        ? Math.max(-7, Math.min(7, Math.tan(time * 0.055 + z * 0.37)))
        : Math.sin(time * 0.16 + z * 0.41) * 0.55;
      for (let y = 0; y < ROWS; y += 1) {
        for (let x = 0; x < COLUMNS; x += 1) {
          // Keep every marker locked to an exact XY rail. Only complete depth
          // layers move, so the projected streams stay crisp and straight.
          dummy.position.set(
            (x - (COLUMNS - 1) / 2) * SPACING,
            (y - (ROWS - 1) / 2) * SPACING,
            -z * SPACING + layerMotion,
          );
          dummy.rotation.set(0, 0, 0);
          // Leave the camera's optical axis clear: the exact center rail reads
          // as a single line sitting on the lens instead of part of the field.
          const isCenterRail = x === Math.floor(COLUMNS / 2) && y === Math.floor(ROWS / 2);
          dummy.scale.setScalar(isCenterRail ? 0 : 1);
          dummy.updateMatrix();
          mesh.current?.setMatrixAt(index, dummy.matrix);
          index += 1;
        }
      }
    }
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false} renderOrder={-2}>
      <planeGeometry args={[0.18, 0.18]} />
      <meshBasicMaterial
        color={color ?? (theme === 'light' ? '#2b4439' : '#ffffff')}
        wireframe
        transparent
        opacity={theme === 'light' ? 0.58 : 1}
        depthWrite={false}
        fog
      />
    </instancedMesh>
  );
}
