import React, { useState } from '@fuser/vendor/react';
import './contact.css';

const links = [
{ label: 'business email', text: 'hyuntheengineer@gmail.com', href: 'mailto:hyuntheengineer@gmail.com' },
{ label: 'linkedin', text: 'hyun-dev', href: 'https://www.linkedin.com/in/hyun-dev/' },
{ label: 'github', text: 'Hyunguy', href: 'https://github.com/Hyunguy' },
{ label: 'the actual site', text: 'hyunspace.me', href: 'https://hyunspace.me/' }];

export default function ContactSection() {
  const [copyState, setCopyState] = useState('copy username');
  const copyDiscord = async () => {
    try {await navigator.clipboard.writeText('mrhyun');setCopyState('copied!');}
    catch {setCopyState('select mrhyun to copy');}
  };
  return <section id="contact" className="contact-sheet">
    <p data-fuser-slot-id="section-body-e671908a" className="contact-eyebrow">// just_the_essentials_ :)</p>
    <h2 data-fuser-slot-id="section-title-83808f9e">let’s connect.</h2>
    <p data-fuser-slot-id="section-body-9eed6857" className="contact-intro">For game development, graphics programming, research, or something worth making together.</p>
    <div className="contact-links">
      {links.map((link) => <a key={link.label} href={link.href} target={link.href.startsWith('https') ? '_blank' : undefined} rel={link.href.startsWith('https') ? 'noopener noreferrer' : undefined}>
        <span data-fuser-slot-id={{ "business email": "section-text-9e3bbf50", "linkedin": "section-text-0b5ed31f", "github": "section-text-14152af8", "the actual site": "section-text-ead3a72e" }[link.label]} className="contact-label">{link.label}</span><strong data-fuser-slot-id={{ "hyuntheengineer@gmail.com": "section-text-df362204", "hyun-dev": "section-text-bea532e2", "Hyunguy": "section-text-c554d256", "hyunspace.me": "section-text-a35d1904" }[link.text]} className="contact-value readable-link">{link.text}</strong><span aria-hidden="true">↗</span>
      </a>)}
      <div className="discord-row"><span data-fuser-slot-id="section-text-7a1abe39" className="contact-label">discord</span><strong data-fuser-slot-id="section-text-0389eb7f" className="contact-value discord-handle readable-link">mrhyun</strong><button onClick={copyDiscord} aria-label="Copy Discord username mrhyun">{copyState}</button></div>
    </div>
    <p className="contact-note" role="status">{copyState === 'copied!' ? 'mrhyun copied to clipboard.' : 'email for business · discord for a hello.'}</p>
  </section>;
}