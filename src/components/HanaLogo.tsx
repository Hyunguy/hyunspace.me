import React, { useState } from '@fuser/vendor/react';
import './hana-logo.css';

// Four independent vector pieces let the mark assemble without moving the wordmark.
const trigrams = [
  { name: 'geon, heaven', bars: [1, 1, 1], x: 32, y: 32, angle: -45, dx: '-20px', dy: '-20px' },
  { name: 'ri , fire', bars: [1, 0, 1], x: 68, y: 32, angle: 45, dx: '20px', dy: '-20px' },
  { name: 'gam , water', bars: [0, 1, 0], x: 32, y: 68, angle: 45, dx: '-20px', dy: '20px' },
  { name: 'gon , earth', bars: [0, 0, 0], x: 68, y: 68, angle: -45, dx: '20px', dy: '20px' },
];
const quarters = ['M50 7L7 50H27L50 27Z','M50 7L93 50H73L50 27Z','M7 50L50 93V73L27 50Z','M93 50L50 93V73L73 50Z'];
export default function HanaLogo() {
  const [cycle, setCycle] = useState(0);
  return <button type="button" className="hana-logo" aria-label="Hana Association , replay four-trigram assembly" title="hana association · click to reassemble" onClick={() => setCycle(n => n + 1)}>
    <svg key={cycle} viewBox="-10 -10 120 120" aria-hidden="true">
      <path className="hana-outline" d="M50 1L99 50L50 99L1 50Z" fill="none" stroke="currentColor" strokeWidth="1.4" pathLength="1" />
      {trigrams.map((t, i) => <g key={t.name} className="hana-piece" style={{ '--dx': t.dx, '--dy': t.dy, animationDelay: `${i * 110}ms` } as React.CSSProperties}>
        <path d={quarters[i]} fill="currentColor" />
        <g transform={`translate(${t.x} ${t.y}) rotate(${t.angle})`} fill="white">
          {t.bars.map((solid, row) => solid ? <rect key={row} x="-10" y={row * 5 - 6.5} width="20" height="3" /> : <g key={row}><rect x="-10" y={row * 5 - 6.5} width="8" height="3" /><rect x="2" y={row * 5 - 6.5} width="8" height="3" /></g>)}
        </g>
      </g>)}
      <path className="hana-pillar" d="M46 37H54V63H46Z" fill="currentColor" />
    </svg>
  </button>;
}
