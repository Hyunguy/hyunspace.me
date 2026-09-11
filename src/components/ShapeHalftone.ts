import * as THREE from '@fuser/vendor/three';

const configured = new WeakMap<THREE.Material, { value: number }>();

// Extend the standard lit material: retain Three's lighting and fog uniforms.
export function applyShapeHalftone(material: THREE.MeshStandardMaterial, pixelRatio: number) {
  const existing = configured.get(material);
  if (existing) { existing.value = pixelRatio; return; }
  const ratio = { value: pixelRatio };
  configured.set(material, ratio);
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uHalftonePixelRatio = ratio;
    shader.fragmentShader = 'uniform float uHalftonePixelRatio;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <fog_fragment>', `
      vec3 lit = gl_FragColor.rgb;
      float tone = clamp(dot(lit, vec3(0.299, 0.587, 0.114)), 0.0, 1.0);
      vec2 cell = fract(gl_FragCoord.xy / (4.0 * uHalftonePixelRatio)) - 0.5;
      float radius = sqrt(mix(0.025, 0.68, tone) / 3.14159265);
      float distanceToDot = length(cell);
      float edge = max(fwidth(distanceToDot), 0.015);
      float dotInk = 1.0 - smoothstep(radius - edge, radius + edge, distanceToDot);
      float chroma = max(lit.r, max(lit.g, lit.b)) - min(lit.r, min(lit.g, lit.b));
      vec3 highlight = mix(vec3(0.96), lit / max(max(lit.r, max(lit.g, lit.b)), 0.001), smoothstep(0.12, 0.4, chroma));
      gl_FragColor.rgb = mix(vec3(0.025), highlight, dotInk);
      #include <fog_fragment>
    `);
  };
  material.customProgramCacheKey = () => 'hyun-lit-halftone-v1';
  material.needsUpdate = true;
}
