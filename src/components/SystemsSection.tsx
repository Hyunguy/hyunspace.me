import React from '@fuser/vendor/react';

export default function SystemsSection() {
  const domains = [
  {
    group: 'Languages',
    items: ['C++', 'Python', 'Java', 'C#', 'Lua', 'JavaScript', 'TypeScript']
  },
  {
    group: 'Game & Graphics',
    items: ['Unity', 'Three.js', 'GSAP', 'GLSL/HLSL', 'WebGL', 'OpenGL']
  },
  {
    group: 'Data & AI',
    items: ['LangChain', 'MATLAB', 'React', 'Git/GitHub', 'Linux']
  }];


  return (
    <section id="systems" className="py-8 space-y-6">
      <div className="space-y-2 border-l-2 border-accent-warm pl-4">
        <div data-fuser-slot-id="section-text-06affa10" className="text-xs font-mono text-accent-warm uppercase tracking-widest">/ Stack &amp; Competencies /</div>
        <h2 data-fuser-slot-id="section-title-a08c7189" className="text-2xl sm:text-4xl font-display font-extrabold text-ink-primary">
          SYSTEMS &amp; TOOLING
        </h2>
      </div>

      {/* Grouped Skills Marquee */}
      <div className="space-y-4">
        {domains.map((dom, idx) =>
        <div key={idx} className="bg-bg-elevated/60 border border-white/10 rounded-xl p-4 font-mono text-xs">
            <div data-fuser-slot-id={{ "Languages": "section-text-10c07216", "Game & Graphics": "section-text-d75939fc", "Data & AI": "section-text-f7cc7ac8" }[dom.group]} className="text-accent-cool uppercase font-bold mb-2 tracking-wider">
              [{dom.group}]
            </div>
            <div className="flex flex-wrap gap-2">
              {dom.items.map((item, iIdx) =>
            <span
              key={iIdx}
              className="bg-black/40 border border-white/15 px-3 py-1 rounded text-ink-primary hover:border-accent-cool transition-colors">

                  {item}
                </span>
            )}
            </div>
          </div>
        )}
      </div>
    </section>);

}