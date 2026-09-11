import React from '@fuser/vendor/react';
import { Float } from '@fuser/vendor/react-three-drei';
import { DraggableObject } from './ThreeCanvas';

type Props = { renderMode: 'render' | 'wireframe'; theme: 'light' | 'dark' };

const materials = ['#e9e9e5', '#deded9', '#f1f1ed', '#d8d8d4'];
const extraPositions: [number, number, number][] = [
  [-7.8, 0.8, -14], [6.4, 1.5, -15], [-4, -6.5, -16], [4.7, -4.5, -18],
  [-5, 5.8, -18], [0.8, 1.8, -19], [-1.7, -1.3, -14], [10.8, 6.7, -19],
];

/** A deeper field of small, fully draggable forms that fills the wide camera. */
export default function BackgroundDraggables({ renderMode, theme }: Props) {
  const wireframe = renderMode === 'wireframe';
  const shapeColor = theme === 'dark' ? '#ffffff' : undefined;
  return (
    <group>
      {extraPositions.map((position, i) => (
        <DraggableObject key={i} position={position} size={[2, 2, 2]} theme={theme} highlightColor={i % 2 ? '#00a6a6' : '#ff2d2d'}>
          <Float speed={0.8 + i * 0.1} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh rotation={[i * 0.2, i * 0.35, 0.4]}>
              {i % 4 === 0 && <torusGeometry args={[0.85, 0.25, 16, 32]} />}
              {i % 4 === 1 && <cylinderGeometry args={[0.65, 0.65, 1.5, 6]} />}
              {i % 4 === 2 && <octahedronGeometry args={[1, 0]} />}
              {i % 4 === 3 && <torusKnotGeometry args={[0.65, 0.2, 48, 8]} />}
              <meshStandardMaterial color={shapeColor ?? materials[i % 4]} roughness={0.86} wireframe={wireframe} />
            </mesh>
          </Float>
        </DraggableObject>
      ))}
      <DraggableObject position={[-10.5, 5.6, -9.5]} size={[1.2, 1.2, 1.2]} theme={theme} highlightColor="#ff2d2d">
        <Float speed={1.1} rotationIntensity={0.55} floatIntensity={0.45}><mesh rotation={[0.3, 0.4, 0]}><boxGeometry args={[0.72, 0.72, 0.72]} /><meshStandardMaterial color={shapeColor ?? materials[0]} roughness={0.88} wireframe={wireframe} /></mesh></Float>
      </DraggableObject>
      <DraggableObject position={[10.7, 4.8, -10.5]} size={[1.2, 1.2, 1.2]} theme={theme} highlightColor="#00a6a6">
        <Float speed={1.3} rotationIntensity={0.7} floatIntensity={0.5}><mesh><sphereGeometry args={[0.55, 14, 10]} /><meshStandardMaterial color={shapeColor ?? materials[1]} roughness={0.9} wireframe={wireframe} /></mesh></Float>
      </DraggableObject>
      <DraggableObject position={[-10.8, 0.1, -8.8]} size={[1.5, 1.5, 1.5]} theme={theme} highlightColor="#ff4b22">
        <Float speed={1.6} rotationIntensity={0.9} floatIntensity={0.6}><mesh rotation={[0.4, 0.1, 0.6]}><tetrahedronGeometry args={[0.75, 1]} /><meshStandardMaterial color={shapeColor ?? materials[2]} roughness={0.86} flatShading wireframe={wireframe} /></mesh></Float>
      </DraggableObject>
      <DraggableObject position={[11.1, -4.3, -9.2]} size={[1.45, 1.45, 1.45]} theme={theme} highlightColor="#00a6a6">
        <Float speed={1.2} rotationIntensity={0.65} floatIntensity={0.55}><mesh rotation={[0.2, 0.75, 0.1]}><octahedronGeometry args={[0.72, 0]} /><meshStandardMaterial color={shapeColor ?? materials[3]} roughness={0.88} flatShading wireframe={wireframe} /></mesh></Float>
      </DraggableObject>
      <DraggableObject position={[-7.5, -5.9, -11.5]} size={[1.3, 1.3, 0.7]} theme={theme} highlightColor="#ff2d2d">
        <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.5}><mesh rotation={[0.5, 0.2, 0]}><torusGeometry args={[0.56, 0.16, 12, 28]} /><meshStandardMaterial color={shapeColor ?? materials[0]} roughness={0.82} wireframe={wireframe} /></mesh></Float>
      </DraggableObject>
      <DraggableObject position={[7.2, -5.7, -12.5]} size={[1.2, 2, 1.2]} theme={theme} highlightColor="#00a6a6">
        <Float speed={1.45} rotationIntensity={0.6} floatIntensity={0.65}><mesh rotation={[0.2, 0.35, -0.35]}><coneGeometry args={[0.55, 1.25, 7]} /><meshStandardMaterial color={shapeColor ?? materials[1]} roughness={0.84} flatShading wireframe={wireframe} /></mesh></Float>
      </DraggableObject>
      <DraggableObject position={[-1.7, 6.3, -12]} size={[1.6, 0.9, 1.6]} theme={theme} highlightColor="#ff4b22">
        <Float speed={1.25} rotationIntensity={0.75} floatIntensity={0.5}><mesh rotation={[0.65, 0.15, 0.2]}><torusGeometry args={[0.7, 0.17, 12, 30]} /><meshStandardMaterial color={shapeColor ?? materials[2]} roughness={0.87} wireframe={wireframe} /></mesh></Float>
      </DraggableObject>
      <DraggableObject position={[2.6, -6.5, -10.5]} size={[1.2, 1.2, 1.2]} theme={theme} highlightColor="#00a6a6">
        <Float speed={1.75} rotationIntensity={0.85} floatIntensity={0.55}><mesh rotation={[0.15, 0.55, 0.25]}><icosahedronGeometry args={[0.65, 1]} /><meshStandardMaterial color={shapeColor ?? materials[3]} roughness={0.9} flatShading wireframe={wireframe} /></mesh></Float>
      </DraggableObject>
    </group>
  );
}
