// @fuser-socket sceneReference in image "Optional reference still for the scene composition"
// @fuser-socket va11HeadsGif in image "Actual animated VA-11 HALL-A blue character-head GIF"
// @fuser-socket va11CityGif in image "Actual animated VA-11 HALL-A city GIF"
// @fuser-socket takopiGif in image "Actual animated Takopi GIF"
// @fuser-socket communityPhoto in image "Actual group photograph for the community chapter"
type Env = {
  fuser: {
    clientScriptTag(): string;
    inputs?: Record<string, { value?: unknown }>;
  };
  HYUNSPACE_DATA: {
    fetch(req: Request): Promise<Response>;
  };
};

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const sceneReference = (env.fuser.inputs?.sceneReference?.value as string | undefined) ?? '';
    const va11HeadsGif = (env.fuser.inputs?.va11HeadsGif?.value as string | undefined) ?? '';
    const va11CityGif = (env.fuser.inputs?.va11CityGif?.value as string | undefined) ?? '';
    const takopiGif = (env.fuser.inputs?.takopiGif?.value as string | undefined) ?? '';
    const communityPhoto = (env.fuser.inputs?.communityPhoto?.value as string | undefined) ?? '';

    // App API routes for persistent messages via Resource
    if (url.pathname === '/app-api/messages') {
      if (req.method === 'GET') {
        return await env.HYUNSPACE_DATA.fetch(new Request('https://r/items', { method: 'GET' }));
      }
      if (req.method === 'POST') {
        const contentLength = Number(req.headers.get('content-length') || '0');
        if (contentLength > 50_000) {
          return Response.json({ error: 'Message is too large. Please keep it under 50 KB.' }, { status: 413 });
        }
        const body = await req.text();
        if (body.length > 50_000) {
          return Response.json({ error: 'Message is too large. Please keep it under 50 KB.' }, { status: 413 });
        }
        try {
          const parsed = JSON.parse(body) as { message?: unknown; email?: unknown };
          if (typeof parsed.message !== 'string' || !parsed.message.trim()) {
            return Response.json({ error: 'A message is required.' }, { status: 400 });
          }
          if (typeof parsed.email !== 'undefined' && typeof parsed.email !== 'string') {
            return Response.json({ error: 'Email must be plain text.' }, { status: 400 });
          }
          return await env.HYUNSPACE_DATA.fetch(
            new Request('https://r/items', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ message: parsed.message.trim(), email: parsed.email?.trim() || undefined })
            })
          );
        } catch {
          return Response.json({ error: 'Invalid message payload.' }, { status: 400 });
        }
      }
    }

    // Narrow public GitHub proxy for the live portfolio repository index.
    if (url.pathname === '/app-api/github-projects') {
      if (req.method !== 'GET') {
        return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { allow: 'GET' } });
      }
      try {
        const upstream = await fetch('https://api.github.com/users/Hyunguy/repos?sort=updated&per_page=100', {
          headers: {
            accept: 'application/vnd.github+json',
            'user-agent': 'hyunspace-portfolio'
          }
        });
        if (!upstream.ok) {
          return Response.json({ error: 'GitHub is unavailable right now.' }, { status: 502 });
        }
        const repos = await upstream.json() as Array<Record<string, unknown>>;
        const projects = repos
          .filter(repo => !repo.fork && typeof repo.name === 'string' && typeof repo.html_url === 'string')
          .slice(0, 8)
          .map(repo => ({
            name: repo.name,
            url: repo.html_url,
            description: typeof repo.description === 'string' && repo.description.trim()
              ? repo.description.trim()
              : 'Public repository ; explore the source on GitHub.',
            language: typeof repo.language === 'string' ? repo.language : null,
            updatedAt: typeof repo.updated_at === 'string' ? repo.updated_at : null,
            stars: typeof repo.stargazers_count === 'number' ? repo.stargazers_count : 0,
            topics: Array.isArray(repo.topics) ? repo.topics.filter((topic): topic is string => typeof topic === 'string').slice(0, 3) : []
          }));
        return Response.json({ projects }, { headers: { 'cache-control': 'public, max-age=300' } });
      } catch {
        return Response.json({ error: 'GitHub is unavailable right now.' }, { status: 502 });
      }
    }

    // Narrow raw GitHub asset route. The inspected production bundle lives at repo root;
    // project imagery remains inside /assets. Never accept an arbitrary remote path.
    if (url.pathname === '/app-api/asset') {
      if (req.method !== 'GET') {
        return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { allow: 'GET' } });
      }
      const file = url.searchParams.get('file') || '111.png';
      const allowedRootFiles = new Set(['index-DIOP7NZi.js']);
      const safeAsset = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,119}$/.test(file) ? file : '';
      if (!safeAsset) {
        return Response.json({ error: 'Invalid asset name.' }, { status: 400 });
      }
      const upstreamUrl = allowedRootFiles.has(safeAsset)
        ? `https://raw.githubusercontent.com/Hyunguy/hyunspace.me/main/${safeAsset}`
        : `https://raw.githubusercontent.com/Hyunguy/hyunspace.me/main/assets/${safeAsset}`;
      try {
        const res = await fetch(upstreamUrl);
        if (!res.ok) return Response.json({ error: 'Asset not found.' }, { status: 404 });
        const contentType = allowedRootFiles.has(safeAsset)
          ? 'application/javascript; charset=utf-8'
          : (res.headers.get('content-type') || 'application/octet-stream');
        return new Response(res.body, {
          status: 200,
          headers: {
            'content-type': contentType,
            'cache-control': 'public, max-age=86400',
            'access-control-allow-origin': '*'
          }
        });
      } catch {
        return Response.json({ error: 'GitHub asset service is unavailable.' }, { status: 502 });
      }
    }

    // HTML Shell for Hyunspace v2 (Light mode default)
    return new Response(
      `<!doctype html>
<html lang="en" class="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>KEVIN HYUN ; Game Developer &amp; Computer Engineer | Hyunspace v2</title>
  <meta name="description" content="Personal Three.js WebGL portfolio for Kevin Hyun. Computer engineering student at Stevens '28, building real-time graphics, tools, and indie games." />

  <!-- Favicon / Brand UV Checker -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='16' height='16' fill='%23000000'/><rect x='16' width='16' height='16' fill='%23000000'/><rect y='16' width='16' height='16' fill='%23000000'/><rect x='16' y='16' width='16' height='16' fill='%23FFFFFF'/></svg>" />

  <!-- Google Fonts: Bricolage Grotesque, Manrope, JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Tailwind Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
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
  </script>

  <style>
    :root {
      --bg: #FFFFFF;
      --bg-elevated: #F4F5F7;
      --ink: #000000;
      --muted: #555555;
      --accent-warm: #E60000;
      --accent-cool: #0044FF;
      --card-bg: rgba(255, 255, 255, 0.92);
      --border-color: rgba(0, 0, 0, 0.15);
    }

    html.dark {
      --bg: #0B0D10;
      --bg-elevated: #14171C;
      --ink: #ECEEF2;
      --muted: #8890A0;
      --accent-warm: #FF9457;
      --accent-cool: #29D3E8;
      --card-bg: rgba(20, 23, 28, 0.92);
      --border-color: rgba(255, 255, 255, 0.15);
    }

    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg);
      color: var(--ink);
      font-family: 'Manrope', sans-serif;
      overflow: hidden;
      height: 100vh;
      width: 100vw;
      user-select: none;
      -webkit-font-smoothing: antialiased;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* Black highlight box for pxlhvk typography */
    .hl-box {
      background-color: var(--ink);
      color: var(--bg);
      padding: 1px 5px;
      font-weight: 800;
      display: inline;
    }

    /* Checker seam divider rule */
    .checker-seam {
      height: 12px;
      width: 100%;
      background-image: linear-gradient(45deg, #000000 25%, transparent 25%),
                        linear-gradient(-45deg, #000000 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #000000 75%),
                        linear-gradient(-45deg, transparent 75%, #000000 75%);
      background-size: 12px 12px;
      background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
      opacity: 0.15;
    }

    html.dark .checker-seam {
      background-image: linear-gradient(45deg, #FFFFFF 25%, transparent 25%),
                        linear-gradient(-45deg, #FFFFFF 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #FFFFFF 75%),
                        linear-gradient(-45deg, transparent 75%, #FFFFFF 75%);
      opacity: 0.2;
    }

    /* Custom scrollbar for modal overlays */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--ink);
      border-radius: 2px;
    }

    /* One print-grain layer sits above both WebGL and DOM typography. */
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
      opacity: 0.075;
      background-image: radial-gradient(circle, #000 0 0.55px, transparent 0.75px);
      background-size: 4px 4px;
      mix-blend-mode: multiply;
    }
  </style>

  <!-- Capability Import Map -->
  <script type="importmap">
  {
    "imports": {
      "@fuser/vendor/three": "/_app-capabilities/v1/artifacts/react-3d/builtin/three.js",
      "@fuser/vendor/three/addons/controls/OrbitControls.js": "/_app-capabilities/v1/artifacts/react-3d/builtin/three-orbit-controls.js",
      "@fuser/vendor/three/addons/loaders/FBXLoader.js": "/_app-capabilities/v1/artifacts/react-3d/builtin/three-fbx-loader.js",
      "@fuser/vendor/three/addons/loaders/GLTFLoader.js": "/_app-capabilities/v1/artifacts/react-3d/builtin/three-gltf-loader.js",
      "@fuser/vendor/three/addons/loaders/OBJLoader.js": "/_app-capabilities/v1/artifacts/react-3d/builtin/three-obj-loader.js",
      "@fuser/vendor/three/addons/loaders/STLLoader.js": "/_app-capabilities/v1/artifacts/react-3d/builtin/three-stl-loader.js",
      "@fuser/vendor/react": "/_app-capabilities/v1/artifacts/react-3d/builtin/react.js",
      "@fuser/vendor/react-dom": "/_app-capabilities/v1/artifacts/react-3d/builtin/react-dom.js",
      "@fuser/vendor/react-dom/client": "/_app-capabilities/v1/artifacts/react-3d/builtin/react-dom-client.js",
      "@fuser/vendor/react-three-drei": "/_app-capabilities/v1/artifacts/react-3d/builtin/react-three-drei.js",
      "@fuser/vendor/react-three-fiber": "/_app-capabilities/v1/artifacts/react-3d/builtin/react-three-fiber.js",
      "@fuser/vendor/react/jsx-dev-runtime": "/_app-capabilities/v1/artifacts/react-3d/builtin/react-jsx-dev-runtime.js",
      "@fuser/vendor/react/jsx-runtime": "/_app-capabilities/v1/artifacts/react-3d/builtin/react-jsx-runtime.js",
      "@fuser/vendor/lucide-react": "/_app-capabilities/v1/artifacts/lucide-icons/builtin/lucide-react.js",
      "@fuser/vendor/motion-react": "/_app-capabilities/v1/artifacts/motion-react/builtin/motion-react.js",
      "@fuser/vendor/zustand": "/_app-capabilities/v1/artifacts/zustand-state/builtin/zustand.js"
    }
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="application/json" id="__APP_DATA__">${JSON.stringify({ sceneReference }).replace(/</g, '\\u003c')}</script>
  ${env.fuser.clientScriptTag()}
</body>
</html>`,
      {
        headers: { 'content-type': 'text/html; charset=utf-8' }
      }
    );
  }
};
