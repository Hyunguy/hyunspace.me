import React, { useEffect, useRef, useState } from '@fuser/vendor/react';
import type { Project } from '../data/projects';

export function ProjectArtwork({ project, number, large = false }: { project: Project; number: number; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [project.id]);
  return <div className={`project-artwork ${large ? 'project-artwork-large' : ''}`} data-category={project.category}>
    {project.cover && !failed ? <img src={project.cover} alt={project.coverAlt || project.title} loading="lazy" onError={() => setFailed(true)} />
      : <div className="project-type-art" aria-hidden="true"><span>{String(number).padStart(2, '0')}</span><strong>{project.title}</strong><i>{project.tags.slice(0, 2).join(' / ')}</i></div>}
  </div>;
}

export default function ProjectStory({ project, number, onClose }: { project: Project; number: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [page, setPage] = useState(0);
  const pageCount = 1 + project.chapters.length + (project.cover ? 1 : 0);
  const go = (index: number) => {
    const element = track.current;
    if (!element) return;
    element.scrollTo({ left: Math.max(0, Math.min(pageCount - 1, index)) * element.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  useEffect(() => {
    const modal = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    modal?.showModal();
    closeButton.current?.focus({ preventScroll: true });
    const element = track.current!;
    // Long text retains vertical scrolling; a wheel otherwise moves the story horizontally.
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const panel = (event.target as HTMLElement).closest<HTMLElement>('.story-panel');
      if (panel && ((event.deltaY > 0 && panel.scrollTop + panel.clientHeight < panel.scrollHeight - 2) || (event.deltaY < 0 && panel.scrollTop > 0))) return;
      if ((event.deltaY < 0 && element.scrollLeft <= 1) || (event.deltaY > 0 && element.scrollLeft >= element.scrollWidth - element.clientWidth - 1)) return;
      event.preventDefault();
      element.scrollLeft += event.deltaY * (event.deltaMode === 1 ? 24 : event.deltaMode === 2 ? element.clientWidth : 1);
    };
    element.addEventListener('wheel', wheel, { passive: false });
    let width = element.clientWidth;
    const observer = new ResizeObserver(() => {
      const index = Math.round(element.scrollLeft / Math.max(width, 1));
      width = element.clientWidth;
      element.scrollTo({ left: index * width, behavior: 'instant' });
    });
    observer.observe(element);
    return () => {
      observer.disconnect(); element.removeEventListener('wheel', wheel); modal?.close();
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialog} className="project-story" aria-labelledby="story-title" aria-describedby="story-instructions"
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onKeyDown={(event) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
      if (event.altKey || event.metaKey || event.ctrlKey) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); event.stopPropagation(); go(page + (event.key === 'ArrowRight' ? 1 : -1)); }
    }}>
    <header className="story-header"><div><span>{project.category} / {String(number).padStart(2, '0')}</span><h2 id="story-title">{project.title}</h2></div><button ref={closeButton} onClick={onClose} className="story-close">← all projects <span aria-hidden="true"> / esc</span></button></header>
    <div ref={track} className="story-track" tabIndex={0} aria-label={`${project.title} chapters`} onScroll={() => {
      const element = track.current!;
      setPage(Math.max(0, Math.min(pageCount - 1, Math.round(element.scrollLeft / element.clientWidth))));
    }}>
      <section className="story-panel story-intro" aria-label="Overview">
        <div><span className="story-kicker">01 / overview</span><h3>{project.title}</h3><p className="story-summary">{project.summary}</p><p className="story-role">{project.role}</p><ul className="project-tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>{project.link && <a className="story-source" href={project.link} target="_blank" rel="noreferrer">Explore the source ↗</a>}</div>
        <ProjectArtwork project={project} number={number} large />
      </section>
      {project.chapters.map((chapter, index) => <section className="story-panel story-chapter" key={chapter.title} aria-label={chapter.title}>
        <div className="story-chapter-number" aria-hidden="true">{String(index + 2).padStart(2, '0')}</div>
        <div><span className="story-kicker">{project.title} / {index === 0 ? 'the project' : 'the work'}</span><h3>{chapter.title}</h3><p>{chapter.body}</p>{chapter.points && <ul className="story-points">{chapter.points.map(point => <li key={point}>{point}</li>)}</ul>}{index === project.chapters.length - 1 && !project.cover && <button className="story-end" onClick={onClose}>Back to the project collection ↗</button>}</div>
      </section>)}
      {project.cover && <section className="story-panel story-gallery" aria-label="Project image"><span className="story-kicker">{String(pageCount).padStart(2, '0')} / a closer look</span><ProjectArtwork project={project} number={number} large /><p>{project.coverAlt}</p><button className="story-end" onClick={onClose}>Back to the project collection ↗</button></section>}
    </div>
    <footer className="story-footer"><p id="story-instructions">scroll sideways / swipe / ← →</p><div className="story-pagination" aria-label="Story navigation"><button aria-label="Previous chapter" disabled={page === 0} onClick={() => go(page - 1)}>←</button><span aria-live="polite" aria-atomic="true">{String(page + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span><button aria-label="Next chapter" disabled={page === pageCount - 1} onClick={() => go(page + 1)}>→</button></div></footer>
  </dialog>;
}
