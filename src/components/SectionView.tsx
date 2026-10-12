import React, { useLayoutEffect, useRef } from '@fuser/vendor/react';
import { bounceEntrance } from './bounceEntrance';
import AboutSection from './AboutSection';
import WorkSection from './WorkSection';
import ContactSection from './ContactSection';
import SystemsSection from './SystemsSection';
import CoreSkillsSection from './CoreSkillsSection';
import type { PortfolioMedia, SectionType } from '../App';

export default function SectionView({ section, onBack, themeLabel, onCycleTheme, portfolioMedia }: { portfolioMedia?: PortfolioMedia; section: SectionType; onBack: () => void; themeLabel: string; onCycleTheme: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!['about', 'projects'].includes(section) || !sectionRef.current) return;
    const root = sectionRef.current;
    const projectCards = section === 'projects'
      ? Array.from(root.querySelectorAll<HTMLElement>('.project-card')).filter(card => {
        const bounds = card.getBoundingClientRect();
        const viewport = scrollRef.current!.getBoundingClientRect();
        return bounds.top < viewport.bottom && bounds.bottom > viewport.top;
      })
      : [];
    return bounceEntrance([
      Array.from(root.querySelectorAll<HTMLElement>('.section-heading button, .section-bottom button')),
      Array.from(root.querySelectorAll<HTMLElement>('.scroll-controls button')),
      Array.from(root.querySelectorAll<HTMLElement>('.fact-title button')),
      Array.from(root.querySelectorAll<HTMLElement>('.projects-heading')),
      Array.from(root.querySelectorAll<HTMLElement>('.project-filters button')),
      // Animate card contents so the existing scroll-driven card transform stays intact.
      projectCards.flatMap(card => Array.from(card.children) as HTMLElement[]),
    ]);
  }, [section]);
  const scrollSection = (direction: 'up' | 'down') => {
    scrollRef.current?.scrollBy({ top: direction === 'up' ? -window.innerHeight * 0.72 : window.innerHeight * 0.72, behavior: 'smooth' });
  };

  return <section ref={sectionRef} className={`section-view section-${section}`}>
    <header className="section-heading">
      <h1>/ {section}. /</h1>
      <button onClick={onBack}>{section === 'projects' ? '[ back to menu ]' : '[ ← back to menu ]'}</button>
    </header>
    <div ref={scrollRef} className="section-scroll custom-scrollbar" key={section}>
      <div className="section-content-layer">
        {section === 'about' && <AboutSection onScroll={scrollSection} media={portfolioMedia} />}
        {section === 'skills' && <CoreSkillsSection onScroll={scrollSection} />}
        {section === 'projects' && <WorkSection />}
        {section === 'contact' && <ContactSection />}
        {section === 'systems' && <SystemsSection />}
      </div>
    </div>
    <footer className="section-bottom"><button className="theme-cycle" onClick={onCycleTheme} aria-label={`Current theme ${themeLabel}. Switch to next theme`}>current_theme: {themeLabel}.</button><button onClick={onBack}>{section === 'projects' ? 'esc_to_return.' : 'esc_to_return. ↵'}</button></footer>
  </section>;
}
