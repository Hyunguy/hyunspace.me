import React, { useEffect, useRef, useState } from '@fuser/vendor/react';
import type { Project } from '../data/projects';

// Layout width stays stable while the whole dialog is zooming.
const panelWidth = (track: HTMLElement) => track.querySelector<HTMLElement>('.story-panel')?.offsetWidth || track.clientWidth;

export function ProjectArtwork({ project, number, large = false }: { project: Project; number: number; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [project.id]);
  return <div className={`project-artwork ${large ? 'project-artwork-large' : ''}`} data-category={project.category}>
    {project.cover && !failed ? <img src={project.cover} alt={project.coverAlt || project.title} loading={large ? 'eager' : 'lazy'} onError={() => setFailed(true)} />
      : <div className="project-type-art" aria-hidden="true"><span>{String(number).padStart(2, '0')}</span><strong>{project.title}</strong><i>{project.tags.slice(0, 2).join(' / ')}</i></div>}
  </div>;
}

export default function ProjectStory({ project, number, origin, onClose }: { project: Project; number: number; origin: { x: number; y: number }; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [page, setPage] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closing = useRef(false);
  const zoom = useRef<Animation | null>(null);
  const stopWheel = useRef(() => {});
  const closeStory = () => {
    if (closing.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { onClose(); return; }
    closing.current = true;
    stopWheel.current();
    zoom.current?.cancel();
    zoom.current = dialog.current!.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.94)' }], { duration: 220, easing: 'ease-in', fill: 'forwards' });
    const finish = () => { clearTimeout(closeTimer.current); onClose(); };
    zoom.current.onfinish = finish;
    // An interrupted animation must never leave an invisible modal trapping focus.
    closeTimer.current = setTimeout(finish, 280);
  };
  const gallery = project.gallery ?? (project.cover ? [{ src: project.cover, alt: project.coverAlt || project.title, caption: project.coverAlt || project.title, link: undefined }] : []);
  const pageCount = 1 + project.chapters.length + gallery.length;
  const go = (index: number) => {
    const element = track.current;
    if (!element) return;
    stopWheel.current();
    element.scrollTo({ left: Math.max(0, Math.min(pageCount - 1, index)) * panelWidth(element), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  useEffect(() => {
    const modal = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    modal?.showModal();
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (modal && !motion.matches) {
      modal.style.transformOrigin = `${origin.x}px ${origin.y}px`;
      zoom.current = modal.animate([{ opacity: 0, transform: 'scale(.78)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    closeButton.current?.focus({ preventScroll: true });
    const element = track.current!;
    let frame = 0;
    let target = element.scrollLeft;
    let last = 0;
    const stop = () => { cancelAnimationFrame(frame); frame = 0; target = element.scrollLeft; };
    stopWheel.current = stop;
    const glide = (time: number) => {
      const dt = Math.min(40, time - last || 16);
      last = time;
      const difference = target - element.scrollLeft;
      element.scrollLeft += difference * (1 - Math.exp(-dt / 85));
      if (Math.abs(difference) > .6) frame = requestAnimationFrame(glide);
      else { element.scrollLeft = target; frame = 0; }
    };
    const panels = Array.from(element.querySelectorAll<HTMLElement>('.story-panel'));
    const depth = () => panels.forEach((panel, index) => {
      const distance = motion.matches ? 0 : Math.max(-1, Math.min(1, index - element.scrollLeft / panelWidth(element)));
      panel.style.setProperty('--chapter-distance', String(distance));
      panel.style.setProperty('--chapter-away', String(Math.abs(distance)));
    });
    depth();
    element.addEventListener('scroll', depth, { passive: true });
    element.addEventListener('pointerdown', stop);
    const resetMotion = () => { stop(); zoom.current?.cancel(); if (closing.current) onClose(); depth(); };
    motion.addEventListener('change', resetMotion);
    // Long text retains vertical scrolling; a wheel otherwise moves the story horizontally.
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) { stop(); return; }
      const panel = (event.target as HTMLElement).closest<HTMLElement>('.story-panel');
      if (panel && ((event.deltaY > 0 && panel.scrollTop + panel.clientHeight < panel.scrollHeight - 2) || (event.deltaY < 0 && panel.scrollTop > 0))) return;
      if ((event.deltaY < 0 && element.scrollLeft <= 1) || (event.deltaY > 0 && element.scrollLeft >= element.scrollWidth - element.clientWidth - 1)) return;
      event.preventDefault();
      if (!frame) target = element.scrollLeft;
      target = Math.max(0, Math.min(element.scrollWidth - element.clientWidth, target + event.deltaY * (event.deltaMode === 1 ? 24 : event.deltaMode === 2 ? element.clientWidth : 1)));
      if (motion.matches) element.scrollLeft = target;
      else if (!frame) { last = performance.now(); frame = requestAnimationFrame(glide); }
    };
    element.addEventListener('wheel', wheel, { passive: false });
    let width = panelWidth(element);
    const observer = new ResizeObserver(() => {
      const index = Math.round(element.scrollLeft / Math.max(width, 1));
      width = panelWidth(element);
      stop();
      element.scrollTo({ left: index * width, behavior: 'instant' });
      depth();
    });
    observer.observe(element);
    return () => {
      clearTimeout(closeTimer.current); stop(); zoom.current?.cancel(); observer.disconnect(); element.removeEventListener('wheel', wheel); element.removeEventListener('scroll', depth); element.removeEventListener('pointerdown', stop); motion.removeEventListener('change', resetMotion); modal?.close();
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialog} className="project-story" aria-labelledby="story-title" aria-describedby="story-instructions"
    onCancel={(event) => { event.preventDefault(); closeStory(); }}
    onKeyDown={(event) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeStory(); }
      if (event.altKey || event.metaKey || event.ctrlKey) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); event.stopPropagation(); go(page + (event.key === 'ArrowRight' ? 1 : -1)); }
    }}>
    <header className="story-header"><div><span>{project.category} / {String(number).padStart(2, '0')}</span><h2 id="story-title">{project.title}</h2></div><button ref={closeButton} onClick={closeStory} className="story-close">Back to all projects <span aria-hidden="true"> / esc</span></button></header>
    <div ref={track} className="story-track" tabIndex={0} aria-label={`${project.title} chapters`} onScroll={() => {
      const element = track.current!;
      setAtStart(element.scrollLeft <= 1);
      setAtEnd(element.scrollLeft >= element.scrollWidth - element.clientWidth - 1);
      setPage(Math.max(0, Math.min(pageCount - 1, Math.round(element.scrollLeft / panelWidth(element)))));
    }}>
      <section className="story-panel story-intro" aria-label="Overview">
        <div><span className="story-kicker">01 / overview</span><h3>{project.title}</h3><p className="story-summary">{project.summary}</p><p className="story-role">{project.role}</p><ul className="project-tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>{project.link && <a className="story-source" href={project.link} target="_blank" rel="noreferrer">{project.linkLabel || 'Explore the source'} {'->'}</a>}</div>
        <ProjectArtwork project={project} number={number} large />
      </section>
      {project.chapters.map((chapter, index) => <section className="story-panel story-chapter" key={chapter.title} aria-label={chapter.title}>
        <div className="story-chapter-number" aria-hidden="true">{String(index + 2).padStart(2, '0')}</div>
        <div><span className="story-kicker">{project.title} / {index === 0 ? 'the project' : 'the work'}</span><h3>{chapter.title}</h3><p>{chapter.body}</p>{chapter.points && <ul className="story-points">{chapter.points.map(point => <li key={point}>{point}</li>)}</ul>}{index === project.chapters.length - 1 && !project.cover && <button className="story-end" onClick={closeStory}>Back to the project collection {'->'}</button>}</div>
      </section>)}
      {gallery.map((media, index) => <section key={media.src} className="story-panel story-gallery" aria-label={media.caption}><span className="story-kicker">{String(2 + project.chapters.length + index).padStart(2, '0')} / a closer look</span><ProjectArtwork project={{ ...project, id: `${project.id}-${index}`, cover: media.src, coverAlt: media.alt }} number={number} large /><p>{media.caption}</p>{media.link && <a className="story-source" href={media.link} target="_blank" rel="noreferrer">Watch the LinkedIn post {'->'}</a>}{index === gallery.length - 1 && <button className="story-end" onClick={closeStory}>Back to the project collection {'->'}</button>}</section>)}
    </div>
    <footer className="story-footer"><p id="story-instructions">scroll sideways / swipe / arrow keys</p><div className="story-pagination" aria-label="Story navigation"><button aria-label="Previous chapter" disabled={atStart} onClick={() => go(Math.ceil(track.current!.scrollLeft / panelWidth(track.current!) - .01) - 1)}>Previous</button><span aria-live="polite" aria-atomic="true">{String(page + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span><button aria-label="Next chapter" disabled={atEnd} onClick={() => go(Math.floor(track.current!.scrollLeft / panelWidth(track.current!) + .01) + 1)}>{'->'}</button></div></footer>
  </dialog>;
}
