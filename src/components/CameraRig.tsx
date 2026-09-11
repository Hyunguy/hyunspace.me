import { useEffect, useRef } from '@fuser/vendor/react';
import { useFrame, useThree } from '@fuser/vendor/react-three-fiber';
import * as THREE from '@fuser/vendor/three';

const SECTION_X: Record<string, number> = { home: 0, about: -2.2, skills: 1.2, projects: 1.8, systems: 0.8, contact: -1.25 };

/** Restrained perspective camera with only section drift and near-imperceptible jitter. */
export default function CameraRig({ section, setStats }: { section: string; setStats: (s: any) => void }) {
  const { camera, gl } = useThree();
  const elapsed = useRef(0);
  const target = useRef(new THREE.Vector3(0, 0, 10));

  useEffect(() => {
    camera.position.set(0, 0, 10);
    camera.quaternion.identity();
    const canvas = gl.domElement;
    canvas.removeAttribute('tabindex');
    canvas.setAttribute('aria-label', 'Interactive 3D portfolio scene with draggable forms, a depth grid, and a moving proximity network.');
  }, [camera, gl]);

  useFrame(({ clock }, dt) => {
    target.current.set(SECTION_X[section] ?? 0, 0, 10);
    camera.position.lerp(target.current, 1 - Math.exp(-2.8 * dt));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const jitterX = reduced ? 0 : Math.sin(clock.elapsedTime * 0.73) * 0.0014;
    const jitterY = reduced ? 0 : Math.cos(clock.elapsedTime * 0.61) * 0.0011;
    camera.rotation.set(jitterY, jitterX, 0);
    elapsed.current += dt;
    if (elapsed.current > 0.5) {
      setStats({ fps: Math.round(1 / Math.max(dt, 0.001)), calls: gl.info.render.calls, triangles: gl.info.render.triangles, points: gl.info.render.points });
      elapsed.current = 0;
    }
  });
  return null;
}
