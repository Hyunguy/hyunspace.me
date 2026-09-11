import * as THREE from '@fuser/vendor/three';

/** Retro ordered-dither shader with a compact AgX display transform. */
export const HalftoneDitherShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#FFFFFF') },
    uColorB: { value: new THREE.Color('#000000') },
    uWireframe: { value: 0.0 },
    uRgbOffset: { value: 0.0 },
    uIsLight: { value: 1.0 },
    uHighlightAmount: { value: 0.0 },
    uHighlightColor: { value: new THREE.Color('#FF2D2D') },
    uExposure: { value: 1.28 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uWireframe;
    uniform float uRgbOffset;
    uniform float uIsLight;
    uniform float uHighlightAmount;
    uniform vec3 uHighlightColor;
    uniform float uExposure;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    mat3 rec2020ToSrgb = mat3(
      vec3(1.6605, -0.1246, -0.0182),
      vec3(-0.5876, 1.1329, -0.1006),
      vec3(-0.0728, -0.0083, 1.1187)
    );
    mat3 srgbToRec2020 = mat3(
      vec3(0.6274, 0.0691, 0.0164),
      vec3(0.3293, 0.9195, 0.0880),
      vec3(0.0433, 0.0113, 0.8956)
    );
    vec3 agxContrast(vec3 x) {
      vec3 x2 = x * x;
      vec3 x4 = x2 * x2;
      return 15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4
        - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 0.00232;
    }
    vec3 agxToneMap(vec3 color) {
      mat3 insetMatrix = mat3(
        vec3(0.856627, 0.137319, 0.111898),
        vec3(0.095121, 0.761242, 0.076799),
        vec3(0.048252, 0.101439, 0.811302)
      );
      mat3 outsetMatrix = mat3(
        vec3(1.127101, -0.141330, -0.141330),
        vec3(-0.110607, 1.157824, -0.110607),
        vec3(-0.016494, -0.016494, 1.251936)
      );
      color = insetMatrix * (srgbToRec2020 * color);
      color = log2(max(color, vec3(1e-10)));
      color = clamp((color + 12.47393) / 16.5, 0.0, 1.0);
      color = outsetMatrix * agxContrast(color);
      return clamp(rec2020ToSrgb * pow(max(color, 0.0), vec3(2.2)), 0.0, 1.0);
    }
    float dither4x4(vec2 position) {
      int x = int(mod(position.x, 4.0));
      int y = int(mod(position.y, 4.0));
      int index = x + y * 4;
      if (index == 0) return 0.0625; if (index == 1) return 0.5625;
      if (index == 2) return 0.1875; if (index == 3) return 0.6875;
      if (index == 4) return 0.8125; if (index == 5) return 0.3125;
      if (index == 6) return 0.9375; if (index == 7) return 0.4375;
      if (index == 8) return 0.25; if (index == 9) return 0.75;
      if (index == 10) return 0.125; if (index == 11) return 0.625;
      if (index == 12) return 1.0; if (index == 13) return 0.5;
      if (index == 14) return 0.875; return 0.375;
    }
    void main() {
      vec3 lightDir = normalize(vec3(1.0, 2.0, 1.5));
      float diffuse = max(dot(vNormal, lightDir), 0.0);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);
      float rawBrightness = diffuse * 0.7 + fresnel * 0.3 + 0.15;
      float brightness = agxToneMap(vec3(rawBrightness * uExposure)).r;
      float dotValue = step(dither4x4(gl_FragCoord.xy / 2.5), brightness);
      vec3 baseColor = uIsLight > 0.5 ? mix(uColorB, uColorA, dotValue) : mix(uColorA, uColorB, dotValue);
      if (uHighlightAmount > 0.01) baseColor = mix(baseColor, uHighlightColor, uHighlightAmount * 0.85);
      if (uRgbOffset > 0.001) baseColor = vec3(mix(baseColor.r, 1.0, uRgbOffset * 2.5), baseColor.g, mix(baseColor.b, 0.9, uRgbOffset * 2.0));
      if (uWireframe > 0.5) {
        vec2 grid = abs(fract(vUv * 16.0 - 0.5) - 0.5) / fwidth(vUv * 16.0);
        baseColor = mix(baseColor, vec3(0.16, 0.8, 0.9), 1.0 - min(min(grid.x, grid.y), 1.0));
      }
      gl_FragColor = vec4(baseColor, 1.0);
    }
  `,
};
