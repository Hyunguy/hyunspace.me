module.exports = {
      content: ['./index.html', './src/**/*.{ts,tsx}'],
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            'bg-render': '#FFFFFF',
            'bg-elevated': '#F3F4F6',
            'ink-primary': '#000000',
            'ink-muted': '#555555',
            'accent-warm': '#FF3333',
            'accent-cool': '#0055FF',
            'wire-bg': '#FFFFFF',
            'wire-ink': '#000000',
            'wire-muted': '#666666',
            'wire-border': '#E0E0E0'
          },
          fontFamily: {
            display: ['"Bricolage Grotesque"', 'sans-serif'],
            body: ['Manrope', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace']
          },
          keyframes: {
            marquee: {
              '0%': { transform: 'translateX(0%)' },
              '100%': { transform: 'translateX(-50%)' }
            },
            glitch: {
              '0%, 100%': { transform: 'translate(0)' },
              '20%': { transform: 'translate(-3px, 2px)' },
              '40%': { transform: 'translate(-2px, -3px)' },
              '60%': { transform: 'translate(3px, 1px)' },
              '80%': { transform: 'translate(1px, -2px)' }
            },
            rgbShift: {
              '0%': { filter: 'drop-shadow(2px 0px 0px rgba(255,0,0,0.8)) drop-shadow(-2px 0px 0px rgba(0,255,255,0.8))' },
              '50%': { filter: 'drop-shadow(-3px 1px 0px rgba(255,0,0,0.9)) drop-shadow(3px -1px 0px rgba(0,255,255,0.9))' },
              '100%': { filter: 'none' }
            }
          },
          animation: {
            marquee: 'marquee 25s linear infinite',
            glitch: 'glitch 0.15s ease infinite',
            rgbShift: 'rgbShift 0.3s ease-out'
          }
        }
      }
    };
