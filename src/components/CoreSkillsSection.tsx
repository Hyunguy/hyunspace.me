import React from '@fuser/vendor/react';
import './core-skills.css';

const skillColumns = [
['Software Development', 'Internal Tools', 'Game Design', 'Frontend Development', 'Shaders', 'UI/UX', 'Leadership', 'Production', 'Writing', 'Marketing'],
['Illustration', 'Graphic Design', 'Visual Development', 'Character Design', '2D/3D Animation', '3D Modeling', 'UV / Texture', 'Poster Editing', 'Compositing', 'Motion Graphics', 'VFX']];


export default function CoreSkillsSection({ onScroll }: {onScroll: (direction: 'up' | 'down') => void;}) {
  return <div className="core-skills-page">
    <aside className="core-skills-rail" aria-label="Core skills scroll controls">
      <button data-fuser-slot-id="core-skills-scroll-control-button-text-7e3c1d51" onClick={() => onScroll('up')}>scroll_up. ↑</button>
      <span aria-hidden="true">┋<br />◇<br />┋</span>
      <button data-fuser-slot-id="core-skills-scroll-control-button-text-85d587d3" onClick={() => onScroll('down')}>scroll_down. ↓</button>
    </aside>
    <div className="core-skills-content">
      <header className="core-skills-title">
        <p>/ abt_primary_content /</p>
        <h2>core skills.</h2>
      </header>
      <section className="core-skills-panel">
        <div data-fuser-slot-id="section-text-f3612489" className="core-skills-label">//_core_competencies</div>
        <p data-fuser-slot-id="section-body-dbbc38e7" className="core-skills-intro">A cross-disciplinary practice for building games, visual systems, and the stories around them.</p>
        <div className="core-skills-grid">
          {skillColumns.map((column, columnIndex) => <ul key={columnIndex}>
            {column.map((skill) => <li key={skill}>{skill}</li>)}
          </ul>)}
        </div>
      </section>
      <p data-fuser-slot-id="section-body-935d1f0d" className="core-skills-next">//_languages_&amp;_frameworks</p>
    </div>
  </div>;
}