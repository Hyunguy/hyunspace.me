import React, { useRef, useState, useEffect, useMemo, useContext } from '@fuser/vendor/react';
import { Canvas, useFrame, useThree } from '@fuser/vendor/react-three-fiber';
import { Float } from '@fuser/vendor/react-three-drei';
import * as THREE from '@fuser/vendor/three';
import AnchorConnectorLines from './AnchorConnectorLines';
import ProximityNetwork from './ProximityNetwork';
import FrameDitherPass from './FrameDitherPass';
import BackgroundDraggables from './BackgroundDraggables';
import CameraRig from './CameraRig';
import { applyShapeHalftone } from './ShapeHalftone';

const SceneAccentContext = React.createContext('#ff1b16');

interface ThreeCanvasProps {
  renderMode: 'render' | 'wireframe';
  theme: 'light' | 'dark';
  showProfiler: boolean;
  gyroEnabled: boolean;
  activeSection: string;
  isTransitioning: boolean;
  hoveredMenu: string | null;
  backgroundColor: string;
  accentColor: string;
  lineColor: string;
  sceneReference?: string;
}

// Legacy shader retained for source history; the live material comes from HalftoneMaterial.
const LegacyHalftoneDitherShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#FFFFFF') },
    uColorB: { value: new THREE.Color('#000000') },
    uWireframe: { value: 0.0 },
    uRgbOffset: { value: 0.0 },
    uIsLight: { value: 1.0 },
    uHighlightAmount: { value: 0.0 },
    uHighlightColor: { value: new THREE.Color('#FF2D2D') },
    // A restrained exposure gives the dither shader a physical, AgX-shaped roll-off.
    uExposure: { value: 1.28 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uWireframe;
    uniform float uRgbOffset;
    uniform float uIsLight;
    uniform float uHighlightAmount;
    uniform vec3 uHighlightColor;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;

    // 4x4 Ordered Dither Matrix
    float dither4x4(vec2 position) {
      int x = int(mod(position.x, 4.0));
      int y = int(mod(position.y, 4.0));
      int index = x + y * 4;
      if (index == 0) return 0.0625;
      if (index == 1) return 0.5625;
      if (index == 2) return 0.1875;
      if (index == 3) return 0.6875;
      if (index == 4) return 0.8125;
      if (index == 5) return 0.3125;
      if (index == 6) return 0.9375;
      if (index == 7) return 0.4375;
      if (index == 8) return 0.25;
      if (index == 9) return 0.75;
      if (index == 10) return 0.125;
      if (index == 11) return 0.625;
      if (index == 12) return 1.0;
      if (index == 13) return 0.5;
      if (index == 14) return 0.875;
      return 0.375;
    }

    void main() {
      vec3 lightDir = normalize(vec3(1.0, 2.0, 1.5));
      float diff = max(dot(vNormal, lightDir), 0.0);

      // Fresnel edge lighting
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);

      float brightness = clamp(diff * 0.7 + fresnel * 0.3 + 0.15, 0.0, 1.0);

      // Halftone dot / dither threshold
      vec2 screenCoord = gl_FragCoord.xy / 2.5;
      float threshold = dither4x4(screenCoord);
      float dotVal = step(threshold, brightness);

      vec3 baseColor;
      if (uIsLight > 0.5) {
        // Light mode: dark dots on light background
        baseColor = mix(uColorB, uColorA, dotVal);
      } else {
        // Dark mode: bright dots on dark background
        baseColor = mix(uColorA, uColorB, dotVal);
      }

      // Mix hover / menu target highlight
      if (uHighlightAmount > 0.01) {
        baseColor = mix(baseColor, uHighlightColor, uHighlightAmount * 0.85);
      }

      // RGB Chromatic Aberration / Fringing on edges
      if (uRgbOffset > 0.001) {
        float r = mix(baseColor.r, 1.0, uRgbOffset * 2.5);
        float g = baseColor.g;
        float b = mix(baseColor.b, 0.9, uRgbOffset * 2.0);
        baseColor = vec3(r, g, b);
      }

      if (uWireframe > 0.5) {
        vec2 grid = abs(fract(vUv * 16.0 - 0.5) - 0.5) / fwidth(vUv * 16.0);
        float line = min(grid.x, grid.y);
        float c = 1.0 - min(line, 1.0);
        baseColor = mix(baseColor, vec3(0.16, 0.8, 0.9), c);
      }

      gl_FragColor = vec4(baseColor, 1.0);
    }
  `
};

// 2. Interactive Bounding Target Box with Corner Squares [□] around 3D objects
function ObjectTargetBox({
  size = [2, 2, 2],
  isHovered = false,
  theme = 'light',
  highlightColor = '#ff1b16'
}: {
  size?: [number, number, number];
  isHovered?: boolean;
  theme?: 'light' | 'dark';
  highlightColor?: string;
}) {
  const lineGeo = useMemo(() => {
    const [w, h, d] = [size[0] * 0.6, size[1] * 0.6, size[2] * 0.6];
    const boxGeo = new THREE.BoxGeometry(w, h, d);
    return new THREE.EdgesGeometry(boxGeo);
  }, [size]);

  const lineColor = isHovered
    ? highlightColor
    : theme === 'light'
    ? '#222222'
    : '#29D3E8';

  return (
    <group>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={isHovered ? 0.9 : 0.25}
          linewidth={isHovered ? 2 : 1}
        />
      </lineSegments>
      {/* Corner target dots [□] */}
      {isHovered && (
        <mesh position={[size[0] * 0.3, size[1] * 0.3, size[2] * 0.3]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color={highlightColor} />
        </mesh>
      )}
    </group>
  );
}

// 3. Two independent background systems from the reference: a deep aligned
// square grid and a shallow, continuously rebuilding proximity network.
function ConnectingNodesConstellation({
  theme,
  hoveredMenu,
  lineColor,
  accentColor
}: {
  theme: 'light' | 'dark';
  hoveredMenu: string | null;
  lineColor: string;
  accentColor: string;
}) {
  return (
    <group>
      <AnchorConnectorLines theme={theme} color={lineColor} />
      <ProximityNetwork theme={theme} active={Boolean(hoveredMenu)} color={lineColor} activeColor={accentColor} />
      <mesh position={[9.5, -5.5, -1]} rotation={[0.2, 0.4, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
    </group>
  );
}

// 4. Glitch Confetti Squares
function GlitchConfetti({ theme }: { theme: 'light' | 'dark' }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 70;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const initialTransforms = useMemo(() => {
    return Array.from({ length: count }, () => ({
      pos: [
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12 - 1
      ],
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      scale: 0.12 + Math.random() * 0.22,
      speed: 0.2 + Math.random() * 0.5
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    initialTransforms.forEach((item, i) => {
      dummy.position.set(
        item.pos[0] + Math.sin(time * item.speed + i) * 0.35,
        item.pos[1] + Math.cos(time * item.speed * 0.8 + i) * 0.35,
        item.pos[2]
      );
      dummy.rotation.set(
        item.rot[0] + time * 0.25,
        item.rot[1] + time * 0.35,
        item.rot[2]
      );
      dummy.scale.setScalar(item.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const color = theme === 'light' ? '#111111' : '#29D3E8';

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color={color}
        side={THREE.DoubleSide}
        transparent
        opacity={theme === 'light' ? 0.65 : 0.8}
      />
    </instancedMesh>
  );
}

// 5. Interactive Draggable 3D Object with Hover Highlight
interface DraggableObjectProps {
  children: React.ReactNode;
  position: [number, number, number];
  size?: [number, number, number];
  theme?: 'light' | 'dark';
  highlightColor?: string;
  isMenuTargeted?: boolean;
  onPositionChange?: (position: THREE.Vector3) => void;
}

export function DraggableObject({
  children,
  position,
  size = [2, 2, 2],
  theme = 'light',
  highlightColor = '#FF2D2D',
  isMenuTargeted = false,
  onPositionChange
}: DraggableObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { camera } = useThree();
  const planeRef = useRef(new THREE.Plane());
  // Each prop has its own gentle cruise vector before anyone touches it. Dragging
  // temporarily takes over; after release it eases back into this weightless drift.
  const velocityRef = useRef(new THREE.Vector3(
    Math.sin(position[0] * 2.17 + position[2]) * 0.23,
    Math.cos(position[1] * 1.71 - position[2]) * 0.16,
    Math.sin(position[0] - position[1]) * 0.035,
  ));
  const driftPhaseRef = useRef(Math.abs(position[0] * 1.7 + position[1] * 2.3 + position[2]));
  const driftTargetRef = useRef(new THREE.Vector3());
  const lastDragPositionRef = useRef(new THREE.Vector3(...position));
  const lastDragTimeRef = useRef(0);
  const draggingRef = useRef(false);
  // Holding a prop gives it a deliberate, tactile spin while it follows the pointer.
  // The velocity eases out on release so it settles instead of snapping back.
  const spinVelocityRef = useRef(new THREE.Vector3());

  const activeHighlight = isHovered || isMenuTargeted;
  const themeHighlight = useContext(SceneAccentContext);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    e.target.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    draggingRef.current = true;
    velocityRef.current.set(0, 0, 0);
    spinVelocityRef.current.set(1.25, 2.8, 0.7);
    lastDragPositionRef.current.copy(groupRef.current!.position);
    lastDragTimeRef.current = performance.now();
    document.body.style.cursor = 'grabbing';
    planeRef.current.setFromNormalAndCoplanarPoint(
      camera.getWorldDirection(new THREE.Vector3()).negate(),
      groupRef.current!.position
    );
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging || !groupRef.current) return;
    e.stopPropagation();
    const intersection = new THREE.Vector3();
    if (e.ray.intersectPlane(planeRef.current, intersection)) {
      const now = performance.now();
      const elapsed = Math.max(0.008, Math.min(0.08, (now - lastDragTimeRef.current) / 1000));
      const sampledVelocity = intersection.clone().sub(lastDragPositionRef.current).divideScalar(elapsed);
      velocityRef.current.lerp(sampledVelocity, 0.48).clampLength(0, 18);
      lastDragPositionRef.current.copy(intersection);
      lastDragTimeRef.current = now;
      groupRef.current.position.copy(intersection);
      onPositionChange?.(intersection);
    }
  };

  const releaseObject = () => {
    draggingRef.current = false;
    setIsDragging(false);
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    e.target.releasePointerCapture?.(e.pointerId);
    releaseObject();
    document.body.style.cursor = isHovered ? 'grab' : 'default';
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    if (!isDragging) document.body.style.cursor = 'grab';
  };

  const handlePointerOut = () => {
    if (!isDragging) {
      setIsHovered(false);
      document.body.style.cursor = 'default';
    }
  };

  useFrame(({ clock, gl }, delta) => {
    if (!groupRef.current) return;

    // A slow, individual cruise makes the stage feel inhabited even at rest.
    // It is intentionally subtle: a thrown object keeps its momentum, then
    // gradually rejoins its own drifting orbit instead of coming to a stop.
    if (!draggingRef.current) {
      const phase = driftPhaseRef.current;
      const t = clock.elapsedTime;
      driftTargetRef.current.set(
        Math.sin(t * 0.19 + phase) * 0.24,
        Math.cos(t * 0.15 + phase * 1.31) * 0.17,
        Math.sin(t * 0.11 + phase * 0.73) * 0.04,
      );
      velocityRef.current.lerp(driftTargetRef.current, 1 - Math.exp(-0.18 * delta));
      groupRef.current.position.addScaledVector(velocityRef.current, Math.min(delta, 0.05));

      // Wrap the wide stage so both passive drifts and hard throws return
      // naturally from the opposite edge instead of hitting invisible walls.
      const p = groupRef.current.position;
      if (p.x > 12.5) p.x = -12.5;
      else if (p.x < -12.5) p.x = 12.5;
      if (p.y > 8.5) p.y = -8.5;
      else if (p.y < -8.5) p.y = 8.5;
      if (p.z > 2) p.z = -12;
      else if (p.z < -20) p.z = 2;
      onPositionChange?.(p);
    }

    // A held object rotates around its own center, making a grab feel active
    // without changing the drag plane or interrupting the throw on release.
    const spinDamping = draggingRef.current ? 1 : Math.exp(-5.5 * delta);
    spinVelocityRef.current.multiplyScalar(spinDamping);
    groupRef.current.rotation.x += spinVelocityRef.current.x * delta;
    groupRef.current.rotation.y += spinVelocityRef.current.y * delta;
    groupRef.current.rotation.z += spinVelocityRef.current.z * delta;

    const targetScale = activeHighlight ? 1.12 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.14);
    groupRef.current.traverse((object: any) => {
      const material = object.material as THREE.MeshStandardMaterial | undefined;
      if (!material?.emissive) return;
      material.emissive.set(activeHighlight ? themeHighlight : '#000000');
      material.emissiveIntensity = activeHighlight ? 0.3 : 0;
      applyShapeHalftone(material, gl.getPixelRatio());
    });
  });

  useEffect(() => {
    const onUp = () => {
      draggingRef.current = false;
      setIsDragging(false);
    };
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Target Wireframe Box overlay */}
      <ObjectTargetBox size={size} isHovered={activeHighlight} theme={theme} highlightColor={themeHighlight} />
      {children}
    </group>
  );
}

// 6. Main 3D Scene Content
function SceneContent({
  renderMode,
  theme,
  setStats,
  activeSection,
  isTransitioning,
  hoveredMenu,
  accentColor,
  lineColor
}: {
  renderMode: 'render' | 'wireframe';
  theme: 'light' | 'dark';
  setStats: (stats: any) => void;
  activeSection: string;
  isTransitioning: boolean;
  hoveredMenu: string | null;
  accentColor: string;
  lineColor: string;
}) {

  const isLight = theme === 'light';
  // Neutral surfaces keep directional lighting visible through the halftone.
  const shapeColor = isLight ? undefined : '#ffffff';

  return (
    <>
      <CameraRig section={activeSection} setStats={setStats} />
      {/* Lighting */}
      <ambientLight intensity={isLight ? 0.95 : 0.55} />
      <directionalLight position={[8, 12, 8]} intensity={isLight ? 1.6 : 1.1} />
      <directionalLight position={[-8, -5, -5]} intensity={0.5} color={isLight ? '#999999' : '#29D3E8'} />

      {/* Ambient nearest-neighbour lines plus a separate two-anchor connector field. */}
      <ConnectingNodesConstellation
        theme={theme}
        hoveredMenu={hoveredMenu}
        lineColor={lineColor}
        accentColor={accentColor}
      />


      {/* Floating props are fully independent from the fixed perspective-marker field. */}
      <DraggableObject
        position={[-3.6, -1.2, 0]}
        size={[2.5, 2.5, 1.2]}
        theme={theme}
        isMenuTargeted={Boolean(hoveredMenu)}
      >
        <Float speed={2} rotationIntensity={1.2} floatIntensity={1}>
          <mesh castShadow receiveShadow>
            <torusGeometry args={[1.5, 0.5, 32, 64]} />
            <meshStandardMaterial color={shapeColor ?? '#f4f4f1'} roughness={0.76} metalness={0.04} wireframe={renderMode === 'wireframe'} />
          </mesh>
        </Float>
      </DraggableObject>

      <DraggableObject position={[4.6, -2.4, -2.2]} size={[1.9, 1.9, 1.9]} theme={theme} highlightColor="#00a6a6">
        <Float speed={1.4} rotationIntensity={0.8} floatIntensity={0.7}>
          <mesh rotation={[0.35, 0.55, 0.12]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 1.45, 1.45]} />
            <meshStandardMaterial color={shapeColor ?? '#e8e8e5'} roughness={0.82} wireframe={renderMode === 'wireframe'} />
          </mesh>
        </Float>
      </DraggableObject>

      <DraggableObject position={[-6.2, 2.7, -3.8]} size={[1.5, 3.1, 1.5]} theme={theme} highlightColor="#ff4b22">
        <Float speed={1.7} rotationIntensity={0.65} floatIntensity={0.85}>
          <mesh rotation={[0.3, 0.2, -0.65]} castShadow receiveShadow>
            <capsuleGeometry args={[0.62, 1.45, 12, 24]} />
            <meshStandardMaterial color={shapeColor ?? '#eeeeeb'} roughness={0.72} wireframe={renderMode === 'wireframe'} />
          </mesh>
        </Float>
      </DraggableObject>

      <DraggableObject position={[1.2, 4.2, -4.6]} size={[2.1, 2.1, 2.1]} theme={theme} highlightColor="#00a6a6">
        <Float speed={1.1} rotationIntensity={1.05} floatIntensity={0.55}>
          <mesh rotation={[0.2, 0.8, 0.25]} castShadow receiveShadow>
            <icosahedronGeometry args={[1.15, 1]} />
            <meshStandardMaterial color={shapeColor ?? '#dededb'} roughness={0.88} flatShading wireframe={renderMode === 'wireframe'} />
          </mesh>
        </Float>
      </DraggableObject>

      <DraggableObject position={[7.3, 2.1, -5.6]} size={[2.5, 2.5, 1.2]} theme={theme} highlightColor="#ff4b22">
        <Float speed={1.5} rotationIntensity={0.9} floatIntensity={0.65}>
          <mesh rotation={[0.45, 0.15, 0.3]} castShadow receiveShadow>
            <torusKnotGeometry args={[0.82, 0.24, 72, 12, 2, 3]} />
            <meshStandardMaterial color={shapeColor ?? '#e6e6e2'} roughness={0.79} wireframe={renderMode === 'wireframe'} />
          </mesh>
        </Float>
      </DraggableObject>

      <DraggableObject position={[-0.8, -4.7, -3.4]} size={[1.9, 2.4, 1.9]} theme={theme} highlightColor="#00a6a6">
        <Float speed={1.9} rotationIntensity={0.7} floatIntensity={0.75}>
          <mesh rotation={[0.15, 0.45, 0.18]} scale={[0.9, 1.25, 0.9]} castShadow receiveShadow>
            <octahedronGeometry args={[1.05, 0]} />
            <meshStandardMaterial color={shapeColor ?? '#ededeb'} roughness={0.84} flatShading wireframe={renderMode === 'wireframe'} />
          </mesh>
        </Float>
      </DraggableObject>

      <DraggableObject position={[-8.4, -3.6, -7.4]} size={[1.7, 1.7, 1.7]} theme={theme} highlightColor="#00a6a6">
        <Float speed={1.25} rotationIntensity={0.9} floatIntensity={0.6}>
          <mesh rotation={[0.5, 0.2, 0.35]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.92, 0]} />
            <meshStandardMaterial color={shapeColor ?? '#e4e4e1'} roughness={0.9} flatShading wireframe={renderMode === 'wireframe'} />
          </mesh>
        </Float>
      </DraggableObject>

      <DraggableObject position={[8.8, -0.3, -8.2]} size={[1.6, 2.4, 1.6]} theme={theme} highlightColor="#ff4b22">
        <Float speed={1.55} rotationIntensity={0.7} floatIntensity={0.7}>
          <mesh rotation={[0.25, 0.1, -0.45]} castShadow receiveShadow>
            <coneGeometry args={[0.9, 1.9, 9]} />
            <meshStandardMaterial color={shapeColor ?? '#ecece8'} roughness={0.8} flatShading wireframe={renderMode === 'wireframe'} />
          </mesh>
        </Float>
      </DraggableObject>

      <BackgroundDraggables renderMode={renderMode} theme={theme} />

      <DraggableObject position={[-3.1, 5.6, -8.8]} size={[1.6, 1.6, 1.6]} theme={theme} highlightColor="#00a6a6">
        <Float speed={1.8} rotationIntensity={0.55} floatIntensity={0.8}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.88, 18, 12]} />
            <meshStandardMaterial color={shapeColor ?? '#e7e7e4'} roughness={0.86} wireframe={renderMode === 'wireframe'} />
          </mesh>
        </Float>
      </DraggableObject>

      <DraggableObject position={[4.2, 5.5, -7.1]} size={[2.0, 2.0, 0.9]} theme={theme} highlightColor="#ff4b22">
        <Float speed={1.35} rotationIntensity={1.0} floatIntensity={0.65}>
          <mesh rotation={[0.75, 0.2, 0.4]} castShadow receiveShadow>
            <torusGeometry args={[0.92, 0.25, 16, 40]} />
            <meshStandardMaterial color={shapeColor ?? '#e1e1de'} roughness={0.82} wireframe={renderMode === 'wireframe'} />
          </mesh>
        </Float>
      </DraggableObject>
    </>
  );
}

export default function ThreeCanvas({
  renderMode,
  theme,
  showProfiler,
  gyroEnabled,
  activeSection,
  isTransitioning,
  hoveredMenu,
  backgroundColor,
  accentColor,
  lineColor,
  sceneReference
}: ThreeCanvasProps) {
  const [stats, setStats] = useState({ fps: 60, calls: 0, triangles: 0, points: 0 });

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto" style={{ backgroundColor }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <SceneAccentContext.Provider value={accentColor}>
          <SceneContent
            renderMode={renderMode}
            theme={theme}
            setStats={setStats}
            activeSection={activeSection}
            isTransitioning={isTransitioning}
            hoveredMenu={hoveredMenu}
            accentColor={accentColor}
            lineColor={lineColor}
          />
          <FrameDitherPass theme={theme} backgroundColor={backgroundColor} transitioning={isTransitioning} hovering={Boolean(hoveredMenu)} />
        </SceneAccentContext.Provider>
      </Canvas>

      {sceneReference && (
        <img
          src={sceneReference}
          alt="Scene reference"
          className="fixed bottom-4 right-4 h-20 w-28 object-cover border border-black/35 bg-white shadow-sm opacity-85"
        />
      )}

      {/* Profiler HUD */}
      {showProfiler && (
        <div className="fixed bottom-4 right-4 pointer-events-auto z-50 bg-black/90 border border-black/20 rounded-lg p-3 font-mono text-xs text-white backdrop-blur-md shadow-2xl space-y-1 w-52">
          <div className="text-[10px] text-gray-400 uppercase border-b border-white/20 pb-1 flex justify-between">
            <span data-fuser-slot-id="section-text-9fb84144">R3F PROFILER</span>
            <span data-fuser-slot-id="section-text-d15a3cc2" className="text-emerald-400">LIVE</span>
          </div>
          <div className="flex justify-between">
            <span data-fuser-slot-id="section-text-3e417476">FPS:</span> <span className="font-bold">{stats.fps}</span>
          </div>
          <div className="flex justify-between">
            <span data-fuser-slot-id="section-text-0b22c7a3">DRAWS:</span> <span className="font-bold">{stats.calls}</span>
          </div>
          <div className="flex justify-between">
            <span data-fuser-slot-id="section-text-52efef51">TRIS:</span> <span className="font-bold">{stats.triangles.toLocaleString()}</span>
          </div>
          <div data-fuser-slot-id="section-text-2653d3d3" className="text-[9px] text-gray-400 pt-1 border-t border-white/10">
            Halftone + RGB Fringing Active
          </div>
        </div>
      )}
    </div>
  );
}
