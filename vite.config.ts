import { defineConfig } from 'vite';
// Preserve Fuser-compatible source imports while compiling with local packages.
export default defineConfig({
  resolve: { alias: [
    { find: '@fuser/vendor/react-three-fiber', replacement: '@react-three/fiber' },
    { find: '@fuser/vendor/react-three-drei', replacement: '@react-three/drei' },
    { find: /^@fuser\/vendor\/(.*)$/, replacement: '$1' },
  ] },
});
