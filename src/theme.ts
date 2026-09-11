export type SceneThemeName = 'light' | 'dark' | 'monochrome' | 'turquoise' | 'cobalt' | 'apricot';

export type ScenePalette = {
  name: SceneThemeName;
  background: string;
  ink: string;
  muted: string;
  accent: string;
  line: string;
  shape: string;
  footer: string;
};

export const SCENE_THEMES: ScenePalette[] = [
  { name: 'light', background: '#ffffff', ink: '#000000', muted: '#5b5b5b', accent: '#ff1b16', line: '#2b4439', shape: '#e8e8e4', footer: '#cce8cc' },
  { name: 'dark', background: '#050505', ink: '#ffffff', muted: '#888888', accent: '#fcd116', line: '#ffffff', shape: '#ffffff', footer: '#ffffff' },
  { name: 'monochrome', background: '#e8e8e4', ink: '#111111', muted: '#555553', accent: '#111111', line: '#3d3d3a', shape: '#f6f6f2', footer: '#c9c9c4' },
  { name: 'turquoise', background: '#bde9df', ink: '#062d2b', muted: '#315f5a', accent: '#007a72', line: '#17665f', shape: '#e9fff9', footer: '#79cfc1' },
  { name: 'cobalt', background: '#cad7ff', ink: '#071947', muted: '#344c82', accent: '#1648d8', line: '#173c8c', shape: '#eef2ff', footer: '#91aaf6' },
  { name: 'apricot', background: '#ffe0c7', ink: '#35160c', muted: '#795447', accent: '#d44518', line: '#814833', shape: '#fff4e9', footer: '#f5aa7e' },
];

export type ThemeName = SceneThemeName;
export const themeOrder = SCENE_THEMES.map((theme) => theme.name);
export const THEMES = Object.fromEntries(SCENE_THEMES.map((theme) => [theme.name, theme])) as Record<ThemeName, ScenePalette>;
