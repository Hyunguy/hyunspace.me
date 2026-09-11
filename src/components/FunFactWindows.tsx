import React, { useRef, useState } from '@fuser/vendor/react';

const facts = [
'I love VA-11 HALL-A, Project Moon, and story-rich games.',
'Favorite anime: Akame ga Kill! #1 Robin Williams glazer, go watch Dead Poets Society.',
'Vinyl collector, seasonal music lover, and relentlessly curious about how things work. ♥'];


export default function FunFactWindows({ compact = false }: {compact?: boolean;}) {
  const [front, setFront] = useState(2);
  const [collapsed, setCollapsed] = useState<boolean[]>([false, false, false]);
  const [offsets, setOffsets] = useState(facts.map(() => ({ x: 0, y: 0 })));
  const drag = useRef<{id: number;x: number;y: number;ox: number;oy: number;} | null>(null);
  return <div className={`fact-field ${compact ? 'fact-field-compact' : ''}`} aria-label="Floating fun fact windows">
    <div data-fuser-slot-id="floating-fun-fact-window-text-2f21ccce" className="fact-hint">/ fun_facts · drag a title /</div>
    {facts.map((fact, i) => <article key={i} className={`fact-window ${front === i ? 'is-front' : ''}`} style={{ left: `${i * 5}%`, top: `${40 + i * 86}px`, zIndex: front === i ? 5 : i + 1, transform: `translate(${offsets[i].x}px, ${offsets[i].y}px)` }} onPointerEnter={() => setFront(i)} onFocus={() => setFront(i)}>
      <header className="fact-title" onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        e.currentTarget.setPointerCapture(e.pointerId); setFront(i);
        drag.current = { id: i, x: e.clientX, y: e.clientY, ox: offsets[i].x, oy: offsets[i].y };
      }} onPointerMove={(e) => {
        const d = drag.current; if (!d || d.id !== i) return;
        const bounds = e.currentTarget.closest('.fact-field')!.getBoundingClientRect();
        const maxX = Math.max(0, bounds.width - e.currentTarget.parentElement!.offsetWidth - i * bounds.width * .05);
        const maxY = Math.max(0, bounds.height - e.currentTarget.parentElement!.offsetHeight - (40 + i * 86));
        setOffsets((old) => old.map((o, n) => n === i ? { x: Math.max(-i * bounds.width * .05, Math.min(maxX, d.ox + e.clientX - d.x)), y: Math.max(-30 - i * 86, Math.min(maxY, d.oy + e.clientY - d.y)) } : o));
      }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}>
        <span>/ fact_0{i + 1} /</span><button aria-label={`${collapsed[i] ? 'Expand' : 'Minimize'} fun fact ${i + 1}`} aria-expanded={!collapsed[i]} onClick={() => setCollapsed((old) => old.map((v, n) => n === i ? !v : v))}>{collapsed[i] ? '□' : '−'}</button>
      </header>{!collapsed[i] && <p>{fact}</p>}
    </article>)}
  </div>;
}