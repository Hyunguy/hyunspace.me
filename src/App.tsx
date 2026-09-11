import React, { useEffect, useRef, useState } from '@fuser/vendor/react';
import ThreeCanvas from './components/ThreeCanvas';
import GlitchText from './components/GlitchText';
import HanaLogo from './components/HanaLogo';
import SectionView from './components/SectionView';
import { THEMES, themeOrder, type ThemeName } from './theme';
import './experience.css';

export type SectionType = 'home' | 'about' | 'skills' | 'projects' | 'systems' | 'contact';
const menu: SectionType[] = ['about', 'projects', 'contact'];

export type PortfolioMedia = { va11HeadsGif?: string; va11CityGif?: string; takopiGif?: string; communityPhoto?: string };

export default function App({ sceneReference, portfolioMedia }: {sceneReference?: string; portfolioMedia?: PortfolioMedia;}) {
  const [activeSection, setActiveSection] = useState<SectionType>('home');
  const [hoveredMenu, setHoveredMenu] = useState<SectionType | null>(null);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [gyroMessage, setGyroMessage] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [themeName, setThemeName] = useState<ThemeName>('light');
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>();
  const theme = THEMES[themeName];
  const cycleTheme = () => setThemeName((current) => themeOrder[(themeOrder.indexOf(current) + 1) % themeOrder.length]);
  const transition = (section: SectionType) => {
    setHoveredMenu(null);
    setIsTransitioning(true);
    setActiveSection(section);
    clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => setIsTransitioning(false), 650);
  };
  const navigate = (section: SectionType) => {
    if (section === activeSection) return;
    transition(section);
    window.history.pushState({ section }, '', section === 'home' ? '/' : `/${section}`);
  };
  useEffect(() => {
    const parse = () => {
      const target = (location.hash.slice(1) || location.pathname.replace(/^\/+|\/+$/g, '')).toLowerCase();
      transition(['about', 'skills', 'projects', 'systems', 'contact'].includes(target) ? target as SectionType : 'home');
    };
    parse();
    window.addEventListener('popstate', parse);
    window.addEventListener('hashchange', parse);
    return () => {window.removeEventListener('popstate', parse);window.removeEventListener('hashchange', parse);clearTimeout(transitionTimer.current);};
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeName === 'dark');
    document.documentElement.classList.toggle('light', themeName !== 'dark');
  }, [themeName]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {if (e.key === 'Escape') navigate('home');};
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [activeSection]);
  const requestGyro = async () => {
    if (gyroEnabled) {setGyroEnabled(false);return;}
    try {
      const sensor = (window as any).DeviceOrientationEvent;
      if (!sensor) {setGyroMessage('sensor unavailable');return;}
      if (typeof sensor.requestPermission === 'function' && (await sensor.requestPermission()) !== 'granted') {setGyroMessage('permission denied');return;}
      setGyroEnabled(true);setGyroMessage('');
    } catch {setGyroMessage('sensor unavailable');}
  };
  return <div
    className="app-shell h-screen w-screen overflow-hidden relative select-none font-body"
    data-theme={themeName}
    style={{ '--scene-paper': theme.background, '--scene-ink': theme.ink, '--scene-muted': theme.muted, '--scene-accent': theme.accent, '--scene-line': theme.line } as React.CSSProperties}>

    <ThreeCanvas theme={themeName === 'dark' ? 'dark' : 'light'} backgroundColor={theme.background} accentColor={theme.accent} lineColor={theme.line} renderMode="render" showProfiler={false} gyroEnabled={gyroEnabled} activeSection={activeSection} isTransitioning={isTransitioning} hoveredMenu={hoveredMenu} sceneReference={sceneReference} />
    <main className="relative z-10 h-full w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 pointer-events-none">
      {activeSection === 'home' ? <div className="home-surface">
        <button data-fuser-slot-id="section-button-text-8b32ff4a" onClick={requestGyro} className="gyro-button" aria-pressed={gyroEnabled}>enable_gyro? {gyroEnabled ? '[on]' : ''}<span>{gyroMessage}</span></button>
        <div className="home-brand">
          <div className="flex items-center gap-3"><HanaLogo /><h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tighter leading-none"><GlitchText text="hyun" /></h1></div>
          <p data-fuser-slot-id="section-body-db4a8d27" className="text-base sm:text-xl font-bold tracking-tight mt-4">programmer, artist.</p>
          <div className="home-metadata">
            <div data-fuser-slot-id="section-text-9ae167f2" className="readable-highlight">everything here was built by human hands.</div><div data-fuser-slot-id="section-text-d6b3fc76" className="readable-highlight">designed and authored by: <strong data-fuser-slot-id="section-text-4b407a81">hyun</strong></div><div data-fuser-slot-id="section-text-fe968456" className="readable-highlight">libraries: <strong data-fuser-slot-id="section-text-e9083f4f">three.js / r3f</strong></div><div data-fuser-slot-id="section-text-5698ef5a" className="readable-highlight">framework: <strong data-fuser-slot-id="section-text-8e013ef8">react</strong></div>
          </div>
          <div className="home-links" aria-label="Find hyun online">
            <a data-fuser-slot-id="find-hyun-online-link-fe1d36e0" className="readable-link" href="https://github.com/Hyunguy" target="_blank" rel="noopener noreferrer">github ↗</a>
            <a data-fuser-slot-id="find-hyun-online-link-94b4668c" className="readable-link" href="https://www.linkedin.com/in/hyun-dev/" target="_blank" rel="noopener noreferrer">linkedin ↗</a>
            <a data-fuser-slot-id="find-hyun-online-link-850f79b1" className="readable-link" href="mailto:hyuntheengineer@gmail.com">email ↗</a>
          </div>
        </div>
        <div className="home-menu" aria-label="Portfolio sections">
          {menu.map((section, i) => <button key={section} type="button" aria-label={`${section}.`} onClick={() => navigate(section)} onPointerEnter={() => setHoveredMenu(section)} onPointerLeave={() => setHoveredMenu(null)} onFocus={() => setHoveredMenu(section)} onBlur={() => setHoveredMenu(null)} className={`menu-link ${hoveredMenu === section ? 'is-hovered' : ''}`}>
            <small aria-hidden="true" style={{ visibility: hoveredMenu === section ? 'visible' : 'hidden' }}>{['// a_little_about_me', '// things_i_make', '// just_the_essentials_:)'][i]}</small>
            <span><GlitchText text={`${section}.`} trigger={hoveredMenu === section} /></span>
          </button>)}
        </div>
        <footer className="home-footer"><button className="theme-cycle" onClick={cycleTheme} aria-label={`Current theme ${theme.name}. Switch to next theme`} title={`theme sequence: ${themeOrder.join(' → ')}`}>current_theme: {theme.name}.</button><span>depth_stream: parallel · endless · toward_viewer</span></footer>
      </div> : <SectionView section={activeSection} onBack={() => navigate('home')} themeLabel={theme.name} onCycleTheme={cycleTheme} portfolioMedia={portfolioMedia} />}
    </main>
  </div>;
}
