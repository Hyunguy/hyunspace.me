import React from '@fuser/vendor/react';
import FunFactWindows from './FunFactWindows';
import type { PortfolioMedia } from '../App';

const languages = ['C++', 'C#', 'Python', 'Java', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL', 'Lua', 'GLSL / HLSL'];
const frameworks = ['React', 'Vue', 'Node.js', 'Vite', 'Tailwind CSS', 'Three.js / R3F', 'Rapier', 'Unity', 'Roblox Studio', 'OpenGL / WebGL', 'GSAP', 'LangChain', 'MATLAB', 'LabVIEW', 'Git / Linux'];
const competencies = [
['Software Development', 'Systems Programming', 'Internal Tools', 'Data Engineering', 'Debugging', 'Test & Verification', 'Game Design', 'Frontend Development', 'Shaders', 'UI/UX'],
['Agile / Team Leadership', 'Production', 'Writing', 'Marketing', 'Illustration', 'Graphic Design', 'Visual Development', 'Character Design', '2D/3D Animation', '3D Modeling', 'UV / Texture'],
['Poster Editing', 'Compositing', 'Motion Graphics', 'VFX']];

const timeline = [
{ year: 'now', title: 'Current game work', org: 'My Dog Zorro · Arcadia Games Collective', desc: 'Currently working on Lemony Fresh at My Dog Zorro and making Prescription. Previously helped make Takedown Protocol at Arcadia Games Collective.' },
{ year: '2028', title: 'B.E. Computer Engineering', org: 'Stevens Institute of Technology', desc: 'Pursuing a B.E. with a Software Engineering minor on the co-op track.' },
{ year: '2025', title: 'Electrical Engineer Co-op', org: 'SRI International', desc: 'Built C++ tooling for optical Fiber Bragg grating sensing in agentic pipelines.' }];


function AboutMedia({ src, alt, label, className = '' }: {src?: string;alt: string;label: string;className?: string;}) {
  return <figure className={`about-media ${className}`}>
    {src ? <img src={src} alt={alt} loading="lazy" /> : <div className="about-media-empty" role="status">{label}<br /><span data-fuser-slot-id="section-text-c500645b">attach original media</span></div>}
    <figcaption>{label}</figcaption>
  </figure>;
}

function BulletList({ title, items }: {title?: string;items: string[];}) {
  return <section className="skill-list">{title && <h3>{title}</h3>}<ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}

export default function AboutSection({ onScroll, media = {"va11HeadsGif":"/media/va11-heads.gif","va11CityGif":"/media/va11-city.gif","takopiGif":"/media/takopi.gif","communityPhoto":"/media/colorstack-eboard.jpg"} }: {media?: PortfolioMedia;onScroll: (direction: 'up' | 'down') => void;}) {
  return <div className="about-page font-body">
    <div className="about-title-row">
      <div className="about-mark" aria-hidden="true"><i /><i /><i /><i /></div>
      <div><p data-fuser-slot-id="section-body-d4704229" className="about-kicker">// abt_primary_content</p><h2 data-fuser-slot-id="section-title-813e1ce7">/ about. /</h2></div>
    </div>
    <div className="about-layout">
      <aside className="about-left-rail">
        <div className="scroll-controls" aria-label="About page scroll controls">
          <button data-fuser-slot-id="about-page-scroll-control-button-text-6aeddc99" onClick={() => onScroll('up')}>scroll_up. ↑</button><span aria-hidden="true">┋<br />◇<br />┋</span><button data-fuser-slot-id="about-page-scroll-control-button-text-c6e5822f" onClick={() => onScroll('down')}>scroll_down. ↓</button>
        </div>
        <FunFactWindows compact />
      </aside>
      <div className="about-main">
        <section className="about-chapter about-intro">
          <div data-fuser-slot-id="section-text-64e20a47" className="chapter-label">01 / the short version</div>
          <div className="about-intro-copy about-outline-text">
            <p data-fuser-slot-id="section-body-3b909d61" className="about-lede"><strong data-fuser-slot-id="section-text-b3acaa80" className="readable-name">KEVIN HYUN</strong> is a computer engineering student at Stevens Institute of Technology ('28) and a <span data-fuser-slot-id="section-text-7cecd460" className="sweep-highlight">game programmer, graphics engineer, and toolmaker</span> who brings code, visual design, and curiosity together to make games feel alive.</p>
            <p>He builds responsive gameplay, expressive graphics, and tools that help creative teams turn ideas into playable experiences. In his free time, he loves powerlifting and getting lost in story-rich games.</p>
            <p data-fuser-slot-id="section-body-2ee5f0b1">He writes gameplay systems and optimization pipelines for several games. He is currently working on <span data-fuser-slot-id="section-text-3195e969" className="sweep-highlight">Lemony Fresh</span> at My Dog Zorro, helped make <span data-fuser-slot-id="section-text-76a8f397" className="sweep-highlight">Takedown Protocol</span> at Arcadia Games Collective, and is also making <span data-fuser-slot-id="section-text-81886b1d" className="sweep-highlight">Prescription</span>.</p>
          </div>
        </section>
        <section className="about-chapter about-stack">
          <div data-fuser-slot-id="section-text-2eeaab03" className="chapter-label">02 / languages &amp; frameworks</div>
          <div className="about-outline-text stack-grid"><BulletList title="// languages" items={languages} /><BulletList title="// frameworks" items={frameworks} /></div>
        </section>
        <section className="about-chapter about-competencies">
          <div data-fuser-slot-id="section-text-29ff1359" className="chapter-label">03 / core compencies</div>
          <div className="about-outline-text stack-grid competency-grid"><BulletList title="// core_compencies" items={competencies[0]} /><BulletList items={competencies[1]} /><BulletList items={competencies[2]} /></div>
        </section>
        <section className="about-chapter about-games">
          <div data-fuser-slot-id="section-text-bbcfa02c" className="chapter-label">04 / things with worlds inside them</div>
          <div className="games-grid about-outline-text"><div><p data-fuser-slot-id="section-body-ffab2bed" className="about-copy">Anything with a rich story pulls me in. I love <strong data-fuser-slot-id="section-text-3caa8a64">Project Moon, Metal Gear, Deep Rock Galactic, and NieR</strong>, plus board games and turn-based games that reward a good plan.</p></div><div className="game-media-pair"><AboutMedia src={media?.va11HeadsGif} label="VA-11 Hall-A / pixel portraits" alt="Neon-blue pixel character head drawings" /><AboutMedia src={media?.va11CityGif} label="VA-11 Hall-A / city nights" alt="Pixel-art neon city at night" /></div></div>
        </section>
        <section className="about-chapter about-anime">
          <div data-fuser-slot-id="section-text-634b9a43" className="chapter-label">05 / offscreen</div>
          <div className="anime-layout about-outline-text"><AboutMedia src={media?.takopiGif} label="Takopi" alt="Takopi crying against a pink sunburst" /><div><p data-fuser-slot-id="section-body-d72a1306" className="about-copy">Favorite anime: <span data-fuser-slot-id="section-text-7eef1f30" className="sweep-highlight">Takopi’s Original Sin</span> and <span data-fuser-slot-id="section-text-89bc3764" className="sweep-highlight">Akame ga Kill!</span></p><p data-fuser-slot-id="section-body-af968bc2" className="about-copy muted-copy">Also: figuring out how things work, programming, producing, making cool stuff, and becoming unbeatable at whatever catches my attention.</p><p data-fuser-slot-id="section-text-7e6f57f6" className="con-love">GO CASTLE POINT &amp; COLORSTACK <span aria-label="heart">♥</span></p></div></div>
        </section>
        <section className="about-chapter about-community">
          <div data-fuser-slot-id="section-text-1e534202" className="chapter-label">06 / making a room for people</div>
          <div className="community-layout about-outline-text"><div><p data-fuser-slot-id="section-body-01ca53f6" className="about-copy">On campus, I’m a <span data-fuser-slot-id="section-text-d3e49432" className="sweep-highlight">community manager for Castle Point Con</span>; the biggest student-run anime convention in the U.S., with 5,000+ attendees and 25k+ followers across its channels.</p><p data-fuser-slot-id="section-body-9b3bbf2a" className="about-copy">I also helped build a 100-member community at Stevens for ColorStack, helping host LeetCode and career fair nights.</p><p data-fuser-slot-id="section-body-7e6f57f6" className="con-love">GO CASTLE POINT &amp; COLORSTACK <span aria-label="heart">♥</span></p></div><AboutMedia src={media?.communityPhoto} alt="Group photo from the community chapter" label="ColorStack E-board" className="community-photo" /></div>
        </section>
        <section className="about-chapter about-record">
          <div data-fuser-slot-id="section-text-5edaf833" className="chapter-label">07 / chronological milestones</div>
          <div className="timeline-list about-outline-text">{timeline.map((item) => <article key={item.year}><time data-fuser-slot-id={{ "now": "section-text-f5be90ad", "2028": "section-text-bee2f60a", "2025": "section-text-89a8ba42" }[item.year]}>{item.year}</time><div><h3 data-fuser-slot-id={{ "Current game work": "section-title-b222e307", "B.E. Computer Engineering": "section-title-b336ce89", "Electrical Engineer Co-op": "section-title-1efdfda8" }[item.title]}>{item.title}</h3><p data-fuser-slot-id={{ "My Dog Zorro \xB7 Arcadia Games Collective": "section-body-61b531fb", "Stevens Institute of Technology": "section-body-ad827e67", "SRI International": "section-body-2c436259" }[item.org]} className="timeline-org">{item.org}</p><p data-fuser-slot-id={{ "Currently working on Lemony Fresh at My Dog Zorro and making Prescription. Previously helped make Takedown Protocol at Arcadia Games Collective.": "section-body-656214c1", "Pursuing a B.E. with a Software Engineering minor on the co-op track.": "section-body-5a519f57", "Built C++ tooling for optical Fiber Bragg grating sensing in agentic pipelines.": "section-body-d7306e37" }[item.desc]}>{item.desc}</p></div></article>)}</div>
        </section>
      </div>
    </div>
  </div>;
}
