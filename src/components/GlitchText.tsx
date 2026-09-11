import React, { useState, useEffect } from '@fuser/vendor/react';

interface GlitchTextProps {
  text: string;
  className?: string;
  trigger?: boolean;
}

const GLITCH_CHARS = '░▒▓█X#%&_*/\\01<>[]~';

export default function GlitchText({ text, className = '', trigger = false }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isGlitching, setIsGlitching] = useState<boolean>(true);

  useEffect(() => {
    let iteration = 0;
    setDisplayText(text);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsGlitching(false);
      return;
    }
    setIsGlitching(true);

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsGlitching(false);
      }

      iteration += 1 / 2;
    }, 30);

    return () => clearInterval(interval);
  }, [text, trigger]);

  // Real glyphs reserve their exact advance widths; random glyphs are paint only.
  // Neither the label nor its clickable parent can resize during a scramble.
  return (
    <span className={`glitch-text ${className}`} aria-label={text}>
      {text.split('').map((char, index) => (
        <span className="glitch-cell" aria-hidden="true" key={index}>
          <span className="glitch-reserve">{char === ' ' ? '\u00a0' : char}</span>
          <span className={`glitch-paint ${isGlitching ? 'text-accent-cool' : ''}`}>
            {isGlitching ? displayText[index] : char}
          </span>
        </span>
      ))}
    </span>
  );
}
