import React, { useEffect, useState } from '@fuser/vendor/react';
import { projects, type Project } from '../data/projects';
import ProjectStory, { ProjectArtwork } from './ProjectStory';
import './projects.css';

type Repository = { id: number; name: string; html_url: string; description: string | null; language: string | null; fork: boolean };
const categories = ['All', 'Games', 'Engineering', 'Software'] as const;

export default function WorkSection() {
  const [category, setCategory] = useState<typeof categories[number]>('All');
  const [selected, setSelected] = useState<Project | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    const controller = new AbortController();
    fetch('https://api.github.com/users/Hyunguy/repos?per_page=100&sort=updated', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Repository index unavailable'); return response.json(); })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Invalid repository index');
        setRepositories(data.filter(repo => !repo.fork && typeof repo.name === 'string' && typeof repo.html_url === 'string' && repo.html_url.startsWith('https://github.com/Hyunguy/')).slice(0, 8));
        setStatus('ready');
      }).catch(() => { if (!controller.signal.aborted) setStatus('error'); });
    return () => controller.abort();
  }, []);
  const visible = projects.filter(project => category === 'All' || project.category === category);
  return <section id="work" className="projects-page">
    <header className="projects-heading"><span>// selected work & experiments</span><h2>Things I’ve made<span>.</span></h2><p>Games, engineering, and tools. Open a project and scroll through the story.</p></header>
    <div className="project-filter-row"><div className="project-filters" role="group" aria-label="Filter projects">{categories.map(value => <button key={value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}<span>{value === 'All' ? projects.length : projects.filter(project => project.category === value).length}</span></button>)}</div><p role="status">{visible.length} projects</p></div>
    <div className="project-grid">{visible.map(project => {
      const number = projects.indexOf(project) + 1;
      return <button key={project.id} className="project-card" aria-label={`Explore ${project.title}`} aria-haspopup="dialog" onClick={() => setSelected(project)}>
        <ProjectArtwork project={project} number={number} />
        <div className="project-card-copy"><div className="project-card-meta"><span>{project.category}</span><span>{String(number).padStart(2, '0')} ↗</span></div><h3>{project.title}</h3><p>{project.summary}</p><div className="project-card-bottom"><span>{project.tags.slice(0, 3).join(' / ')}</span><strong>open story →</strong></div></div>
      </button>;
    })}</div>
    <section className="repository-index" aria-labelledby="repository-heading"><header><div><span>// from github</span><h3 id="repository-heading">More in the source.</h3></div><a href="https://github.com/Hyunguy" target="_blank" rel="noreferrer">Hyunguy ↗</a></header>
      {status === 'loading' && <p role="status">Loading public repositories…</p>}
      {status === 'error' && <p>GitHub’s live list is unavailable. You can still explore the projects above or visit my profile.</p>}
      {status === 'ready' && <div className="repository-grid">{repositories.map(repo => <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"><span>{repo.language || 'Repository'} ↗</span><h4>{repo.name}</h4><p>{repo.description || 'Explore the code and project files on GitHub.'}</p></a>)}</div>}
    </section>
    {selected && <ProjectStory key={selected.id} project={selected} number={projects.indexOf(selected) + 1} onClose={() => setSelected(null)} />}
  </section>;
}
