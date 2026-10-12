export const SHOWCASE_BASE = '/lemony-fresh-showcase';
export const isShowcasePath = (path: string) => path === SHOWCASE_BASE || path.startsWith(`${SHOWCASE_BASE}/`);
export const sectionPath = (section: string, showcase: boolean) => `${showcase ? SHOWCASE_BASE : ''}${section === 'home' ? '/' : `/${section}`}`;
export const sectionFromPath = (path: string) => (isShowcasePath(path) ? path.slice(SHOWCASE_BASE.length) : path).replace(/^\/+|\/+$/g, '');
export const showcaseProjects = <T extends { id: string }>(projects: T[], showcase: boolean) => showcase ? projects.filter(project => project.id !== 'lemony-fresh') : projects;
