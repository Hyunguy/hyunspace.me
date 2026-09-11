import React, { useEffect, useMemo } from '@fuser/vendor/react';
import { useFrame, useThree } from '@fuser/vendor/react-three-fiber';
import * as THREE from '@fuser/vendor/three';

/** One full-frame ordered-dither pass. It runs after the entire Three scene renders. */
export default function FrameDitherPass({ theme, backgroundColor, transitioning = false, hovering = false }: { theme: 'light' | 'dark'; backgroundColor: string; transitioning?: boolean; hovering?: boolean }) {
  const strength = theme === 'light' ? 0.34 : 0.24;
  const fogColor = backgroundColor;
  const { gl, scene, camera, size } = useThree();
  const target = useMemo(() => {
    const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      depthBuffer: true,
    });
    return renderTarget;
  }, []);

  const pass = useMemo(() => {
    const passScene = new THREE.Scene();
    const passCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tDiffuse: { value: null },
        uStrength: { value: strength },
        uShift: { value: 0 },
        uTime: { value: 0 },
        uPixel: { value: new THREE.Vector2(1, 1) },
        uPaper: { value: new THREE.Color(backgroundColor) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uStrength;
        uniform float uShift;
        uniform float uTime;
        uniform vec2 uPixel;
        uniform vec3 uPaper;
        varying vec2 vUv;
        float bayer4(vec2 p) {
          int x = int(mod(p.x, 4.0));
          int y = int(mod(p.y, 4.0));
          int i = x + y * 4;
          if (i == 0) return 0.03125; if (i == 1) return 0.53125;
          if (i == 2) return 0.15625; if (i == 3) return 0.65625;
          if (i == 4) return 0.78125; if (i == 5) return 0.28125;
          if (i == 6) return 0.90625; if (i == 7) return 0.40625;
          if (i == 8) return 0.21875; if (i == 9) return 0.71875;
          if (i == 10) return 0.09375; if (i == 11) return 0.59375;
          if (i == 12) return 0.96875; if (i == 13) return 0.46875;
          if (i == 14) return 0.84375; return 0.34375;
        }
        void main() {
          // Crisp print registration and a short horizontal scan displacement,
          // never a blur kernel or depth-of-field effect.
          float band = step(0.97, sin(floor(vUv.y * 100.0) * 7.1 + floor(uTime * 14.0)));
          vec2 uv = clamp(vUv + vec2(band * uShift * uPixel.x, 0.0), 0.0, 1.0);
          vec4 source = texture2D(tDiffuse, uv);
          vec4 red = texture2D(tDiffuse, clamp(uv + vec2(uPixel.x * uShift, 0.0), 0.0, 1.0));
          vec4 blue = texture2D(tDiffuse, clamp(uv - vec2(uPixel.x * uShift, 0.0), 0.0, 1.0));
          source = vec4(mix(uPaper.r, red.r, red.a), mix(uPaper.g, source.g, source.a), mix(uPaper.b, blue.b, blue.a), 1.0);
          float threshold = bayer4(gl_FragCoord.xy);
          float luminance = dot(source.rgb, vec3(0.299, 0.587, 0.114));
          float printed = step(threshold, luminance);
          vec3 mono = vec3(printed);
          float neutral = 1.0 - smoothstep(0.06, 0.32, max(source.r, max(source.g, source.b)) - min(source.r, min(source.g, source.b)));
          source.rgb = mix(source.rgb, mono, uStrength * neutral);
          gl_FragColor = source;
        }
      `,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    passScene.add(quad);
    return { passScene, passCamera, material, quad };
  }, []);

  useEffect(() => {
    target.setSize(Math.max(1, size.width * gl.getPixelRatio()), Math.max(1, size.height * gl.getPixelRatio()));
  }, [gl, size.height, size.width, target]);

  useEffect(() => { pass.material.uniforms.uStrength.value = strength; }, [pass, strength]);
  useEffect(() => { pass.material.uniforms.uPaper.value.set(backgroundColor); }, [backgroundColor, pass]);
  useEffect(() => {
    const previousFog = scene.fog;
    scene.fog = new THREE.Fog(fogColor, 25, 90);
    return () => { scene.fog = previousFog; };
  }, [fogColor, scene]);

  useEffect(() => () => {
    target.dispose();
    pass.quad.geometry.dispose();
    pass.material.dispose();
  }, [pass, target]);

  useFrame(({ clock }, delta) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const goal = reduced ? 0 : transitioning ? 3.5 : hovering ? 1.25 : 0;
    pass.material.uniforms.uShift.value = THREE.MathUtils.lerp(pass.material.uniforms.uShift.value, goal, 1 - Math.exp(-14 * delta));
    pass.material.uniforms.uTime.value = clock.elapsedTime;
    pass.material.uniforms.uPixel.value.set(1 / target.width, 1 / target.height);
    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    pass.material.uniforms.tDiffuse.value = target.texture;
    gl.render(pass.passScene, pass.passCamera);
  }, 1);

  return null;
}
